const { GoogleGenAI } = require('@google/genai');

async function testGenAI() {
  try {
    console.log("Initializing @google/genai with Vertex AI...");
    const ai = new GoogleGenAI({ vertexai: true, project: 'project-a9c284f8-6bca-440a-a0c', location: 'us-central1' });
    
    console.log("Sending request to Gemini via Vertex AI...");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Reply ONLY with the word SUCCESS',
    });
    
    console.log("RESULT:", response.text);
  } catch (error) {
    console.error("GenAI Error:", error);
  }
}

testGenAI();
