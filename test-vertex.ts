import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function run() {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hello! Respond with a single word.',
    });
    console.log("SUCCESS1.5:", result.text);
  } catch (e: any) {
    console.error("FAIL1.5:", e.message);
  }
  
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello! Respond with a single word.',
    });
    console.log("SUCCESS2.5:", result.text);
  } catch (e: any) {
    console.error("FAIL2.5:", e.message);
  }
}

run();
