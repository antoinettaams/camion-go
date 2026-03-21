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
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}