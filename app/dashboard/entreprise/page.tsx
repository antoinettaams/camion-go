'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Truck, Menu, X, UserCircle, Building2 } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Sidebar } from '@/app/components/Sidebar';
import { Input } from '@/app/components/ui/Input';
import { cn } from '@/app/lib/utils'; 
import toast from 'react-hot-toast';

// Importer les composants de contenu
import { DashboardOverview } from '@/app/components/dashboard/entreprise/DashboardOverview';
import { NewRequest } from '@/app/components/dashboard/entreprise/NewRequest';
import { Orders } from '@/app/components/dashboard/entreprise/Orders';
import { History } from '@/app/components/dashboard/entreprise/History';
import { Profile } from '@/app/components/dashboard/entreprise/Profile';
import { Settings } from '@/app/components/dashboard/entreprise/Settings';

// Composant principal qui utilise useSearchParams
function DashboardContent() {
  const { user } = useAppContext();
  const { logout: firebaseLogout, loading: firebaseLoading } = useFirebaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);

  // Lire le paramètre tab depuis l'URL au chargement
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    
    if (tabParam) {
      const validTabs = ['dashboard', 'new-request', 'orders', 'history', 'profile', 'settings'];
      if (validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams]);

  // Redirection
  useEffect(() => {
    if (!firebaseLoading) {
      if (!user) {
        router.push('/sign-in');
      } else if (user.role !== 'entreprise') {
        router.push('/dashboard/chauffeur');
      }
    }
  }, [user, firebaseLoading, router]);

  if (firebaseLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await firebaseLogout();
      toast.success('👋 Déconnexion réussie');
      router.push('/');
    } catch (error) {
      toast.error('❌ Erreur lors de la déconnexion');
    }
  };

  // Fonction pour changer d'onglet et mettre à jour l'URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Mettre à jour l'URL sans recharger la page
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url.toString());
  };

  // Fonction pour rendre le contenu selon l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onNewRequest={() => handleTabChange('new-request')} />;
      case 'new-request':
        return <NewRequest onBack={() => handleTabChange('dashboard')} />;
      case 'orders':
        return <Orders />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview onNewRequest={() => handleTabChange('new-request')} />;
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <Sidebar
        userRole="entreprise"
        userName={user.name}
        userInitial={user.companyName?.charAt(0) || user.name.charAt(0)}
        userEmail={user.email}
        companyName={user.companyName}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec recherche et profil */}
        <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Menu mobile - à gauche */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg flex-shrink-0 text-[var(--text-secondary)]"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Logo + icône pour desktop */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-[var(--text-primary)]">CamionGo</span>
            </div>

            {/* Barre de recherche - au centre */}
            <div className={cn(
              "flex-1 transition-all duration-200",
              isMobileSearchFocused ? "max-w-full" : "max-w-md lg:max-w-2xl"
            )}>
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
                <Input
                  type="text"
                  placeholder="Rechercher une mission..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsMobileSearchFocused(true)}
                  onBlur={() => setIsMobileSearchFocused(false)}
                  className="w-full pl-8 sm:pl-10 pr-8 py-1.5 sm:py-2 text-sm sm:text-base bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-blue-500 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Profil avec infos - à droite (desktop) */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--text-primary)]">{user.companyName || user.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-base lg:text-lg font-bold text-blue-700 dark:text-blue-400 flex-shrink-0">
                {user.companyName?.charAt(0) || user.name.charAt(0)}
              </div>
            </div>

            {/* Version mobile - icône profil seule */}
            <div className="flex md:hidden items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-400">
                {user.companyName?.charAt(0) || user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Export principal avec Suspense
export default function EntrepriseDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Chargement...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}