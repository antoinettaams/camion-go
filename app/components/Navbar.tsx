// src/components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, LogOut, User as UserIcon, Menu, X, LogIn, UserPlus, CircleHelp } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';  // ← Chemin absolu

export function Navbar() {
  const { user, logout } = useAppContext();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
              <Truck className="h-8 w-8 text-blue-700" />
              <span className="font-bold text-xl text-slate-900">CamionGo</span>
            </Link>
          </div>

          {/* Menu pour utilisateurs connectés */}
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Connecté en tant que <span className="font-medium text-slate-900">{user.name}</span>
              </span>
              {user.role === 'entreprise' ? (
                <>
                  <Link href="/entreprise" className="nav-link">Dashboard</Link>
                  <Link href="/entreprise/nouvelle-demande" className="nav-link">Nouvelle mission</Link>
                </>
              ) : (
                <>
                  <Link href="/chauffeur" className="nav-link">Dashboard</Link>
                  <Link href="/chauffeur/mes-missions" className="nav-link">Mes missions</Link>
                </>
              )}
              <Link href="/profil" className="nav-link">Profil</Link>
              <Link href="/evaluations" className="nav-link">Évaluations</Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          )}

          {/* Desktop Menu - Non connecté */}
          {!user && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/contact" className="text-base font-medium text-black hover:text-blue-700 transition-colors px-2">
                Contact
              </Link>
              <Link href="/sign-in" className="text-base font-medium text-black hover:text-blue-700 transition-colors px-2">
                Se connecter
              </Link>
              <Link href="/sign-up" className="text-base font-medium text-black hover:text-blue-700 transition-colors px-2">
                Créer un compte
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!user && (
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
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
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg absolute w-full left-0">
          <div className="flex flex-col">
            <div className="flex flex-col bg-white">
              <Link href="/sign-in" onClick={closeMenu} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors">
                <LogIn className="h-6 w-6 text-slate-600" />
                <span className="text-lg font-medium">Se connecter</span>
              </Link>
              <Link href="/sign-up" onClick={closeMenu} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-colors">
                <UserPlus className="h-6 w-6 text-slate-600" />
                <span className="text-lg font-medium">Créer un compte</span>
              </Link>
              <Link href="/contact" onClick={closeMenu} className="flex items-center gap-4 px-6 py-4 text-slate-700 hover:bg-slate-50 transition-colors">
                <CircleHelp className="h-6 w-6 text-slate-600" />
                <span className="text-lg font-medium">Contact</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}