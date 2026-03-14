// src/app/not-found.tsx
'use client';

import Link from 'next/link';
import { Truck } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="w-12 h-12 text-blue-700" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page non trouvée</h2>
        <p className="text-slate-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}