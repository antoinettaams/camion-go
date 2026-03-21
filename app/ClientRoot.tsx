'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { FirebaseAuthProvider } from '@/app/context/FirebaseAuthContext';
import { AppProvider } from '@/app/context/AppContext';
import { Navbar } from './components/Navbar';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Charger la préférence de thème
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <FirebaseAuthProvider>
      <AppProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </AppProvider>
    </FirebaseAuthProvider>
  );
}