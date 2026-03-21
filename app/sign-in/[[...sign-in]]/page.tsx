// src/app/sign-in/[[...sign-in]]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { cn } from '@/app/lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase'; 
import toast from 'react-hot-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'entreprise' | 'chauffeur'>('entreprise');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useFirebaseAuth();
  const { user: appUser, login } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (appUser) {
      console.log("🔄 Utilisateur déjà connecté, redirection vers:", appUser.role);
      router.push(appUser.role === 'entreprise' ? '/dashboard/entreprise' : '/dashboard/chauffeur');
    }
  }, [appUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ✅ Vérifier que Firebase est initialisé
      if (!db) {
        throw new Error("Firebase Firestore n'est pas initialisé");
      }

      console.log("🔑 Tentative de connexion pour:", email, "rôle sélectionné:", role);
      
      // 1. Connexion avec Firebase
      const userCredential = await signIn(email, password);
      console.log("✅ Firebase Auth réussi pour UID:", userCredential.uid);
      
      // 2. Récupérer les infos supplémentaires depuis Firestore
      console.log("📦 Chargement document Firestore pour:", userCredential.uid);
      const userDoc = await getDoc(doc(db, 'users', userCredential.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("✅ Données Firestore récupérées:", userData);
        console.log("Rôle dans Firestore:", userData.role, "Rôle sélectionné:", role);
        
        // 3. Vérifier le rôle
        if (userData.role !== role) {
          const errorMsg = `Ce compte est un compte ${userData.role}, pas un compte ${role}`;
          console.error("❌", errorMsg);
          setError(errorMsg);
          toast.error(errorMsg);
          setIsLoading(false);
          return;
        }
        
        // 4. Connecter dans le contexte local
        console.log("✅ Rôle OK, connexion dans AppContext");
        login(email, role);
        
        // 5. Message de succès
        toast.success('✅ Connexion réussie !', {
          duration: 2000,
          icon: '🎉',
        });
        
        // 6. Rediriger
        const destination = role === 'entreprise' ? '/dashboard/entreprise' : '/dashboard/chauffeur';
        console.log("🚀 Redirection vers:", destination);
        router.push(destination);
      } else {
        console.error("❌ Document Firestore non trouvé pour UID:", userCredential.uid);
        setError('Utilisateur non trouvé dans la base de données');
        toast.error('❌ Utilisateur non trouvé');
      }
      
    } catch (err: any) {
      console.error('❌ Erreur connexion:', err);
      
      let errorMessage = 'Email ou mot de passe incorrect';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte trouvé avec cet email';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Format d\'email invalide';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Réessayez plus tard.';
      } else if (err.message === "Firebase Firestore n'est pas initialisé") {
        errorMessage = 'Service temporairement indisponible';
      }
      
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-md w-full space-y-8 bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-sm border border-[var(--border-color)]">
        <div className="text-center">
          <Truck className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold text-[var(--text-primary)]">Connexion</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Ou{' '}
            <Link href="/sign-up" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              créez un compte gratuitement
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-500/20">
            {error}
          </div>
        )}
        
        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => {
              console.log("🎯 Changement de rôle vers:", role === 'entreprise' ? 'chauffeur' : 'entreprise');
              setRole(role === 'entreprise' ? 'chauffeur' : 'entreprise');
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
              role === 'entreprise' 
                ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Building2 className="w-4 h-4" />
            Entreprise
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("🎯 Changement de rôle vers:", role === 'chauffeur' ? 'entreprise' : 'chauffeur');
              setRole(role === 'chauffeur' ? 'entreprise' : 'chauffeur');
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
              role === 'chauffeur' 
                ? "bg-white dark:bg-slate-800 text-blue-500 dark:text-blue-400 shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Truck className="w-4 h-4" />
            Chauffeur
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Adresse email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  console.log("📝 Email:", e.target.value);
                  setEmail(e.target.value);
                }}
                placeholder="exemple@email.com"
                disabled={isLoading}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-[var(--text-primary)]">
                  Mot de passe
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className={cn(
              "w-full",
              role === 'chauffeur' 
                ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600" 
                : "bg-blue-700 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800"
            )} 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              `Se connecter en tant que ${role === 'entreprise' ? 'entreprise' : 'chauffeur'}`
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}