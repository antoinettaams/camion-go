import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientRoot from './ClientRoot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CamionGo - Transport de marchandises',
  description: 'Plateforme de mise en relation entre transporteurs et clients',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClientRoot>
          {children}
        </ClientRoot>
      </body>
    </html>
  );
}