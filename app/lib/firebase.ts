// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 1. On vérifie si on a au moins l'API Key avant d'initialiser
// Cela évite l'erreur "invalid-api-key" si le build tente d'accéder à ce fichier sans les variables env
const app = (getApps().length > 0) 
  ? getApp() 
  : (firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null);

// 2. On exporte avec des gardes-fous
export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;
export { app };