import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Using the Google Cloud Project ID already present in .env
  projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID || process.env.GCP_PROJECT_ID || "project-a9c284f8-6bca-440a-a0c",
  
  // Note: For a fully production Firebase app, you would also need apiKey, authDomain, etc.
  // But for Firestore unauthenticated reads/writes (if security rules allow), projectId can sometimes suffice
  // To ensure the demo works locally even without full credentials, we rely on the same fallback pattern.
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
