// src/context/FirebaseAuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import { useAppContext } from './AppContext';
import { User } from '@/app/types'; 

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<FirebaseUser>;
  signIn: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setAppUser } = useAppContext();
  const isMounted = useRef(true);
  const initDone = useRef(false);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // ✅ Vérifier que Firebase est initialisé
  useEffect(() => {
    if (auth && db) {
      setFirebaseReady(true);
    } else {
      console.warn("⚠️ Firebase non disponible, arrêt du provider");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!firebaseReady || !auth) return;
    
    isMounted.current = true;
    
    // Vérifier si on a déjà des données en session
    const cachedUser = sessionStorage.getItem('firebase_user');
    if (cachedUser && !initDone.current) {
      try {
        const userData: User = JSON.parse(cachedUser);
        console.log("📦 Utilisateur chargé depuis session:", userData.email);
        setAppUser(userData);
        setLoading(false);
        initDone.current = true;
      } catch (e) {
        console.error("❌ Erreur parsing session:", e);
        sessionStorage.removeItem('firebase_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted.current) return;
      
      console.log("🔥 Firebase Auth state changed:", firebaseUser?.email || "déconnecté");
      setUser(firebaseUser);
      
      if (firebaseUser && db) {
        try {
          // Si déjà initialisé depuis le cache, on ne refait pas
          if (initDone.current) {
            setLoading(false);
            return;
          }

          console.log("📦 Chargement Firestore pour:", firebaseUser.uid);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists() && isMounted.current) {
            const userData = userDoc.data() as User;
            console.log("✅ Utilisateur chargé depuis Firestore:", userData.email);
            
            sessionStorage.setItem('firebase_user', JSON.stringify(userData));
            setAppUser(userData);
            setLoading(false);
            initDone.current = true;
          } else if (isMounted.current) {
            console.log("⚠️ Document Firestore non trouvé pour:", firebaseUser.uid);
            setLoading(false);
          }
        } catch (error) {
          console.error("❌ Erreur Firestore:", error);
          if (isMounted.current) {
            setLoading(false);
          }
        }
      } else {
        // Déconnexion
        console.log("👥 Utilisateur déconnecté");
        sessionStorage.removeItem('firebase_user');
        setAppUser(null);
        setLoading(false);
        initDone.current = false;
      }
    });
    
    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [firebaseReady, setAppUser, db]);

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth non initialisé");
    console.log("📝 Création utilisateur Firebase:", email);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth non initialisé");
    console.log("🔑 Connexion utilisateur:", email);
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const logout = async () => {
    if (!auth) return;
    console.log("👋 Déconnexion");
    sessionStorage.removeItem('firebase_user');
    setAppUser(null);
    await signOut(auth);
    initDone.current = false;
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Firebase Auth non initialisé");
    console.log("📧 Envoi email de réinitialisation à:", email);
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      logout,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
}