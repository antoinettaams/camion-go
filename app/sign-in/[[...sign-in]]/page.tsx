// src/app/sign-in/[[...sign-in]]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // ← Changé: useRouter
import Link from 'next/link';  // ← Changé: Link de next/link
import { Truck, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';  // ← Changé: chemin absolu
import { Input } from '@/app/components/ui/Input';   // ← Changé: chemin absolu
import { useAppContext } from '@/app/context/AppContext';  // ← Changé: chemin absolu
import { cn } from '@/app/lib/utils';// ← Changé: chemin absolu

export default function SignInPage() {  // ← Changé: export default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'entreprise' | 'chauffeur'>('entreprise');
  const { login, user } = useAppContext();
  const router = useRouter();  // ← Changé: useRouter

  useEffect(() => {
    if (user) {
      router.push(user.role === 'entreprise' ? '/entreprise' : '/chauffeur');  // ← Changé: router.push
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, role);
    if (success) {
      setTimeout(() => {
        router.push('/dashboard-redirect');  // ← Changé: router.push
      }, 100);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center">
          <Truck className="mx-auto h-12 w-12 text-blue-700" />
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Connexion</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ou{' '}
            <Link href="/sign-up" className="font-medium text-blue-700 hover:text-blue-600">  {/* ← href */}
              créez un compte gratuitement
            </Link>
          </p>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setRole('entreprise')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all",
              role === 'entreprise' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
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
              role === 'chauffeur' ? "bg-white text-blue-500 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Truck className="w-4 h-4" />
            Chauffeur
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mb-6">
          <p className="font-semibold mb-1">Compte de démo ({role === 'entreprise' ? 'Entreprise' : 'Chauffeur'}) :</p>
          <ul className="list-disc pl-5 space-y-1">
            {role === 'entreprise' ? (
              <li>Email: <strong>contact@pharma.bj</strong></li>
            ) : (
              <li>Email: <strong>koffi@camion.bj</strong></li>
            )}
            <li>Mot de passe: (n'importe quoi)</li>
          </ul>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className={cn("w-full", role === 'chauffeur' ? "bg-blue-500 hover:bg-blue-600" : "")} size="lg">
            Se connecter en tant que {role === 'entreprise' ? 'entreprise' : 'chauffeur'}
          </Button>
        </form>
      </div>
    </div>
  );
}