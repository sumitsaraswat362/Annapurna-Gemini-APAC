import { GoogleGenAI } from '@google/genai';

const project = process.env.GCP_PROJECT_ID || 'project-a9c284f8-6bca-440a-a0c';
const location = process.env.GCP_LOCATION || 'us-central1';

let _aiInstance: GoogleGenAI | null = null;

export const ai = new Proxy({} as GoogleGenAI, {
  get(target, prop) {
    if (!_aiInstance) {
      _aiInstance = new GoogleGenAI({});
    }
    return (_aiInstance as any)[prop];
  }
});

export const DEFAULT_MODEL = 'gemini-2.5-flash';
