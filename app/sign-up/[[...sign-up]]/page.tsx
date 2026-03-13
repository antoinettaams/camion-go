// src/app/sign-up/[[...sign-up]]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // ← Changé: useRouter
import Link from 'next/link';  // ← Changé: Link de next/link
import { useSearchParams } from 'next/navigation';  // ← Changé: useSearchParams de next/navigation
import { Truck, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';  // ← Chemin absolu
import { Input } from '@/app/components/ui/Input';    // ← Chemin absolu
import { Select } from '@/app/components/ui/Select';  // ← Chemin absolu
import { useAppContext } from '@/app/context/AppContext';  // ← Chemin absolu
import { Role, User } from '@/app/types';  // ← Chemin absolu
import { cn } from '@/app/lib/utils';  // ← Chemin absolu

const CITIES = ['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Bohicon', 'Natitingou', 'Lokossa', 'Ouidah', 'Kandi', 'Djougou'];
const TRUCK_TYPES = ['Camionnette', 'Camion bâché', 'Camion frigorifique', 'Camion plateau', 'Semi-remorque'];

export default function SignUpPage() {  // ← Changé: export default
  const searchParams = useSearchParams();  // ← Changé: plus de crochets
  const defaultRole = (searchParams.get('role') as Role) || 'entreprise';
  
  const [role, setRole] = useState<Role>(defaultRole);
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

  const { register, user } = useAppContext();
  const router = useRouter();  // ← Changé: useRouter

  useEffect(() => {
    if (user) {
      router.push(user.role === 'entreprise' ? '/entreprise' : '/chauffeur');  // ← Changé: router.push
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: `u${Date.now()}`,
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

    register(newUser);
    router.push(role === 'entreprise' ? '/entreprise' : '/chauffeur');  // ← Changé: router.push
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Créer un compte</h2>
          <p className="mt-2 text-sm text-slate-600">
            Déjà inscrit ?{' '}
            <Link href="/sign-in" className="font-medium text-blue-700 hover:text-blue-600">  {/* ← href */}
              Connectez-vous
            </Link>
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-lg">
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jean Dupont" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jean@exemple.com" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+229 90000000" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <Input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
            </div>

            {role === 'entreprise' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise</label>
                <Input required value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Ma Société SARL" />
              </div>
            )}

            {role === 'chauffeur' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type de camion</label>
                  <Select value={formData.truckType} onChange={e => setFormData({...formData, truckType: e.target.value})}>
                    {TRUCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacité (Tonnes)</label>
                  <Input type="number" min="1" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Zone principale</label>
                  <Select value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
              </>
            )}
          </div>

          <Button type="submit" className={cn("w-full", role === 'chauffeur' ? "bg-blue-500 hover:bg-blue-600" : "")} size="lg">
            Créer mon compte
          </Button>
        </form>
      </div>
    </div>
  );
}