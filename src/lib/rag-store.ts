import { ai, DEFAULT_MODEL } from './vertex-client';
import { Firestore, FieldValue } from '@google-cloud/firestore';
import { GoogleGenAI } from '@google/genai';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'project-a9c284f8-6bca-440a-a0c';

let _embedAiInstance: GoogleGenAI | null = null;
const embedAi = new Proxy({} as GoogleGenAI, {
  get(target, prop) {
    if (!_embedAiInstance) {
      _embedAiInstance = new GoogleGenAI({
        vertexai: {
          project: PROJECT_ID,
          location: 'us-central1'
        }
      });
    }
    return (_embedAiInstance as any)[prop];
  }
});

// Configure Firestore
const getFirestore = () => {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, 'base64').toString());
    return new Firestore({ projectId: PROJECT_ID, credentials });
  }
  return new Firestore({ projectId: PROJECT_ID });
};

let _firestoreInstance: Firestore | null = null;
const firestore = new Proxy({} as Firestore, {
  get(target, prop) {
    if (!_firestoreInstance) {
      _firestoreInstance = getFirestore();
    }
    const val = (_firestoreInstance as any)[prop];
    return typeof val === 'function' ? val.bind(_firestoreInstance) : val;
  }
});

export class LegalAdvisor {
  async queryLegalContext(question: string): Promise<string> {
    try {
      // 1. Embed the incoming question using Vertex AI text-embedding-004
      const embedResponse = await embedAi.models.embedContent({
        model: 'text-embedding-004',
        contents: question,
        config: {
          taskType: 'RETRIEVAL_QUERY',
        }
      });

      const queryVector = embedResponse.embeddings?.[0]?.values;
      if (!queryVector) throw new Error('Failed to embed query');

      // 2. Perform Native Vector Search on Firestore
      const coll = firestore.collection('legal_documents');
      
      // We use findNearest to find the top 3 most similar documents using COSINE distance
      // @ts-ignore - The local @google-cloud/firestore types might not include vector search yet
      const vectorQuery = coll.findNearest('embedding', FieldValue.vector(queryVector), {
        limit: 3,
        distanceMeasure: 'COSINE',
      });
      
      const snapshot = await vectorQuery.get();
      
      let retrievedContext = '';
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        retrievedContext += `--- Document: ${data.title} ---\n${data.content}\n\n`;
      });

      if (!retrievedContext) {
        retrievedContext = "No specific FSSAI compliance documents found. Provide general advice.";
      }

      // 3. Ground the final Gemini response in the retrieved Firestore context
      const systemPrompt = `You are an expert Indian Legal Advisor specializing in food safety and logistics.
Use the following retrieved FSSAI context to answer the user's question accurately.
Do not make up non-existent laws. If the answer is not contained within the context, state that clearly.

RETRIEVED CONTEXT:
${retrievedContext}
`;

      const result = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        config: {
          systemInstruction: systemPrompt,
        },
        contents: question,
      });
      
      return result.text || 'Unable to generate legal context at this time.';
    } catch (e: any) {
      console.error('[RAG Error]', e.message);
      return 'An error occurred during legal retrieval: ' + e.message;
    }
  }
}
