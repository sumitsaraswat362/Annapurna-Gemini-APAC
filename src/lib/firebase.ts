import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALFV0IqDjwDNc_MFyvpEme7uRnYiRgIpU",
  authDomain: "project-a9c284f8-6bca-440a-a0c.firebaseapp.com",
  projectId: "project-a9c284f8-6bca-440a-a0c",
  storageBucket: "project-a9c284f8-6bca-440a-a0c.firebasestorage.app",
  messagingSenderId: "887568501843",
  appId: "1:887568501843:web:e747db27d1f927cf8c4aa6",
  measurementId: "G-M0CMRMP06J"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
