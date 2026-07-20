import { GoogleGenAI } from '@google/genai';

const project = process.env.GCP_PROJECT_ID || 'project-a9c284f8-6bca-440a-a0c';
const location = process.env.GCP_LOCATION || 'us-central1';

export const ai = new GoogleGenAI({
  vertexai: true,
  project,
  location,
});

export const DEFAULT_MODEL = 'gemini-2.5-flash';
