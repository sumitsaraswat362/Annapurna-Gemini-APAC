import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MockVectorDB } from '@/lib/rag-store';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const vectorDB = new MockVectorDB();
    const context = vectorDB.searchLegalDocs(query);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert Legal & Compliance AI Consultant for a logistics and food supply chain platform.
Based on the following retrieved legal context, answer the user's query with a definitive, professional legal liability report. Use markdown formatting for clarity.

Context retrieved from Vector DB:
${context}

User Query:
${query}

Definitive Legal Liability Report:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ report: text, context: context });
  } catch (error) {
    console.error('Error in Legal RAG route:', error);
    return NextResponse.json({ error: 'Failed to generate legal report' }, { status: 500 });
  }
}
