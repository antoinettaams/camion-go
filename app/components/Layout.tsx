// src/components/Layout.tsx
'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard/entreprise') || pathname.startsWith('/dashboard/chauffeur');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}  {/* ← Ceci remplace Outlet */}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}