// src/app/layout.tsx
import type { Metadata } from 'next';
import { FirebaseAuthProvider } from '@/app/context/FirebaseAuthContext';
import { AppProvider } from '@/app/context/AppContext';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'CamionGo - Transport au Bénin',
  description: 'Plateforme de mise en relation entre entreprises et chauffeurs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* ✅ AppProvider doit être à l'extérieur car FirebaseAuthProvider en dépend */}
        <AppProvider>
          <FirebaseAuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            />
          </FirebaseAuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}