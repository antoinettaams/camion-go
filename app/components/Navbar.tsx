// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Truck, LogOut, Menu, X, LogIn, UserPlus, CircleHelp } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';

export function Navbar() {
  const { user, logout } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // ✅ Masquer la navbar sur les pages d'authentification
  useEffect(() => {
    const authPages = ['/sign-in', '/sign-up', '/forgot-password', '/verify-email'];
    setIsVisible(!authPages.includes(pathname));
  }, [pathname]);

  const handleLogout = () => {
    logout(); 
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  // ✅ Vérifier si on est sur une page de dashboard
  const isDashboardPage = pathname?.startsWith('/dashboard/');

  // ✅ Ne rien afficher si on est sur une page d'auth
  if (!isVisible) return null;

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo - caché sur les pages dashboard */}
          {!isDashboardPage && (
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                <Truck className="h-8 w-8 text-blue-700 dark:text-blue-400" />
                <span className="font-bold text-xl text-slate-900 dark:text-white">CamionGo</span>
              </Link>
            </div>
          )}

          {/* Desktop Menu - Non connecté */}
          {!user && (
            <div className="hidden md:flex items-center gap-4 ml-auto">
              <Link href="/contact" className="text-base font-medium text-black dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors px-2">
                Contact
              </Link>
              <Link href="/sign-in" className="text-base font-medium text-black dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors px-2">
                Se connecter
              </Link>
              <Link href="/sign-up" className="text-base font-medium text-black dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors px-2">
                Créer un compte
              </Link>
            </div>
          )}

          {/* Mobile Menu Button - seulement si non connecté */}
          {!user && (
            <div className="flex items-center md:hidden ml-auto">
              <button
                type="button"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && !user && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg absolute w-full left-0">
          <div className="flex flex-col">
            <div className="flex flex-col bg-white dark:bg-slate-800">
              <Link href="/sign-in" onClick={closeMenu} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <LogIn className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                <span className="text-lg font-medium">Se connecter</span>
              </Link>
              <Link href="/sign-up" onClick={closeMenu} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <UserPlus className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <span className="text-lg font-medium">Créer un compte</span>
              </Link>
              <Link href="/contact" onClick={closeMenu} className="flex items-center gap-4 px-6 py-4 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <CircleHelp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <span className="text-lg font-medium">Contact</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}