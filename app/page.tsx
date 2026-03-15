// src/app/page.tsx
'use client';

import { useAppContext } from './context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Landing } from './components/Landing';

export default function HomePage() {
  const { user } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // ✅ Corrigé : ajout de /dashboard/
      router.push(user.role === 'entreprise' ? '/dashboard/entreprise' : '/dashboard/chauffeur');
    }
  }, [user, router]);

  return <Landing />;
}