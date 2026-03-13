// src/app/layout.tsx
import type { Metadata } from 'next';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'CamionGo - Transport au Bénin',
  description: 'Plateforme de mise en relation entre entreprises et chauffeurs pour le transport de marchandises au Bénin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}