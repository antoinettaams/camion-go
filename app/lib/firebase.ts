// src/lib/firebase.ts - Version avec clés en dur pour le build
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️ Mets tes clés en DIRECT ici temporairement pour le build
const firebaseConfig = {
  apiKey: "AIzaSyCBS7HYg8APpyg-fV6Z9eg72GoCbHlsXr0",
  authDomain: "camiongo-7cec4.firebaseapp.com",
  projectId: "camiongo-7cec4",
  storageBucket: "camiongo-7cec4.firebasestorage.app",
  messagingSenderId: "515402669073",
  appId: "1:515402669073:web:a6bfc63eb9932ca22ae5b0"
};

console.log("🔥 Firebase Config chargée");

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };