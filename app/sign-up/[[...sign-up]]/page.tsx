// src/app/sign-up/[[...sign-up]]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Truck, Building2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Role, User } from '@/app/types';
import { cn } from '@/app/lib/utils';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

const CITIES = ['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Bohicon', 'Natitingou', 'Lokossa', 'Ouidah', 'Kandi', 'Djougou'];
const TRUCK_TYPES = ['Camionnette', 'Camion bâché', 'Camion frigorifique', 'Camion plateau', 'Semi-remorque'];

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get('role') as Role) || 'entreprise';
  
  const [role, setRole] = useState<Role>(defaultRole);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    truckType: TRUCK_TYPES[0],
    capacity: '5',
    zone: CITIES[0]
  });

  const { register: registerInApp } = useAppContext();
  const { signUp: firebaseSignUp, user: firebaseUser } = useFirebaseAuth();
  const router = useRouter();

  // 📍 LOG 1: Surveillance de firebaseUser
  useEffect(() => {
    console.log("useEffect - firebaseUser:", firebaseUser?.email, "isRedirecting:", isRedirecting);
    
    if (firebaseUser && isRedirecting) {
      const destination = role === 'entreprise' ? '/dashboard/entreprise' : '/dashboard/chauffeur';
      console.log("🚀 REDIRECTION VERS:", destination);
      router.push(destination);
    }
  }, [firebaseUser, router, role, isRedirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🟢 Formulaire soumis");
    
    setIsLoading(true);

    try {
      // ✅ Vérifier que Firebase est initialisé
      if (!db) {
        throw new Error("Firebase Firestore n'est pas initialisé");
      }

      // 1. Créer l'utilisateur dans Firebase Auth
      console.log("Création utilisateur Firebase...");
      const userCredential = await firebaseSignUp(formData.email, formData.password);
      console.log("✅ Utilisateur Firebase créé:", userCredential.uid);
      
      // ✅ SOLUTION: Activer isRedirecting IMMÉDIATEMENT après création Firebase
      console.log("🟡 Activation de isRedirecting = true");
      setIsRedirecting(true);
      
      // 2. Préparer l'objet utilisateur
      const newUser: User = {
        id: userCredential.uid,
        role,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(role === 'entreprise' ? { companyName: formData.companyName } : {}),
        ...(role === 'chauffeur' ? { 
          truckType: formData.truckType, 
          capacity: Number(formData.capacity), 
          zone: formData.zone,
          rating: 5.0
        } : {})
      };

      // 3. Sauvegarder dans Firestore (en arrière-plan)
      console.log("Sauvegarde Firestore...");
      await setDoc(doc(db, 'users', userCredential.uid), newUser);
      console.log("✅ Utilisateur sauvegardé dans Firestore");
      
      // 4. Enregistrer dans le contexte local
      registerInApp(newUser);
      console.log("✅ Utilisateur enregistré dans le contexte");
      
      // 5. Message de succès
      const welcomeMsg = role === 'entreprise' 
        ? `Bienvenue, l'entreprise ${formData.companyName} est prête !` 
        : `Route libre ! Bienvenue à bord, ${formData.name.split(' ')[0]}.`;
      
      toast.success(welcomeMsg, {
        duration: 3000,
        icon: role === 'entreprise' ? '🏢' : '🚛',
      });
      
    } catch (err: any) {
      console.error('❌ Erreur inscription:', err);
      
      let errorMsg = "Impossible de créer le compte.";
      
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = "Cet email est déjà utilisé par un autre compte.";
      } else if (err.code === 'auth/weak-password') {
        errorMsg = "Le mot de passe doit contenir au moins 6 caractères.";
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = "L'adresse email n'est pas valide.";
      } else if (err.message === "Firebase Firestore n'est pas initialisé") {
        errorMsg = "Service temporairement indisponible";
      }

      toast.error(errorMsg);
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
      <div className="max-w-xl w-full space-y-8 bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-sm border border-[var(--border-color)]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">Créer un compte</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Déjà inscrit ?{' '}
            <Link href="/sign-in" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              Connectez-vous
            </Link>
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
          <button
            type="button"
            onClick={() => setRole('entreprise')}
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
            onClick={() => setRole('chauffeur')}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nom complet</label>
              <Input 
                required 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Jean Dupont"
                disabled={isLoading || isRedirecting}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email</label>
              <Input 
                type="email" 
                required 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="jean@exemple.com"
                disabled={isLoading || isRedirecting}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Téléphone</label>
              <Input 
                required 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                placeholder="+229 90000000"
                disabled={isLoading || isRedirecting}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Mot de passe</label>
              <Input 
                type="password" 
                required 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                placeholder="••••••••"
                disabled={isLoading || isRedirecting}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>

            {role === 'entreprise' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Nom de l'entreprise</label>
                <Input 
                  required 
                  value={formData.companyName} 
                  onChange={e => setFormData({...formData, companyName: e.target.value})} 
                  placeholder="Ma Société SARL"
                  disabled={isLoading || isRedirecting}
                  className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                />
              </div>
            )}

            {role === 'chauffeur' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Type de camion</label>
                  <Select 
                    value={formData.truckType} 
                    onChange={e => setFormData({...formData, truckType: e.target.value})}
                    disabled={isLoading || isRedirecting}
                    className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  >
                    {TRUCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Capacité (Tonnes)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    required 
                    value={formData.capacity} 
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                    disabled={isLoading || isRedirecting}
                    className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Zone principale</label>
                  <Select 
                    value={formData.zone} 
                    onChange={e => setFormData({...formData, zone: e.target.value})}
                    disabled={isLoading || isRedirecting}
                    className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
              </>
            )}
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
            disabled={isLoading || isRedirecting}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirection...
              </>
            ) : (
              'Créer mon compte'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}