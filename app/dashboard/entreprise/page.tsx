'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Truck, Menu, X, UserCircle, Building2 } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Sidebar } from '@/app/components/Sidebar';
import { Input } from '@/app/components/ui/Input';
import { cn } from '@/app/lib/utils'; 
import toast from 'react-hot-toast';
import { NotificationBell } from '@/app/components/NotificationBell';

// Importer les composants de contenu
import { DashboardOverview } from '@/app/components/dashboard/entreprise/DashboardOverview';
import { NewRequest } from '@/app/components/dashboard/entreprise/NewRequest';
import { Orders } from '@/app/components/dashboard/entreprise/Orders';
import { History } from '@/app/components/dashboard/entreprise/History';
import { Profile } from '@/app/components/dashboard/entreprise/Profile';
import { Settings } from '@/app/components/dashboard/entreprise/Settings';

// Composant principal qui utilise useSearchParams
function DashboardContent() {
  const { user, missions } = useAppContext();
  const { logout: firebaseLogout, loading: firebaseLoading } = useFirebaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Filtrer les missions de l'entreprise connectée
  const userMissions = useMemo(() => {
    if (!user) return [];
    return missions.filter(mission => mission.entrepriseId === user.id);
  }, [missions, user]);

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = userMissions.filter(mission => {
      const searchTerm = query.toLowerCase().trim();
      
      // Rechercher dans différents champs
      return (
        mission.merchandiseType?.toLowerCase().includes(searchTerm) ||
        mission.departure?.toLowerCase().includes(searchTerm) ||
        mission.destination?.toLowerCase().includes(searchTerm) ||
        mission.id?.toLowerCase().includes(searchTerm) ||
        mission.status?.toLowerCase().includes(searchTerm) ||
        mission.note?.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(filtered);
    setShowSearchResults(true);
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Naviguer vers une mission trouvée
  const handleMissionClick = (missionId: string) => {
    clearSearch();
    // Rediriger vers la page de la mission
    router.push(`/dashboard/entreprise/mission/${missionId}`);
  };

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

  // Fermer les résultats de recherche quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

            {/* Barre de recherche - au centre */}
            <div id="search-container" className={cn(
              "flex-1 transition-all duration-200 relative",
              isMobileSearchFocused ? "max-w-full" : "max-w-md lg:max-w-2xl"
            )}>
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
                <Input
                  type="text"
                  placeholder="Rechercher une mission (type, trajet, statut, ID...)"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsMobileSearchFocused(true)}
                  className="w-full pl-8 sm:pl-10 pr-8 py-1.5 sm:py-2 text-sm sm:text-base bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-blue-500 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>

              {/* Résultats de recherche */}
              {showSearchResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border-color)]">
                        {searchResults.length} mission(s) trouvée(s)
                      </div>
                      {searchResults.map((mission) => (
                        <button
                          key={mission.id}
                          onClick={() => handleMissionClick(mission.id)}
                          className="w-full text-left px-4 py-3 hover:bg-[var(--bg-primary)] transition-colors border-b border-[var(--border-color)] last:border-0"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[var(--text-primary)] truncate">
                                {mission.merchandiseType || 'Type non spécifié'}
                              </p>
                              <p className="text-sm text-[var(--text-secondary)] truncate">
                                {mission.departure} → {mission.destination}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  mission.status === 'En attente' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400",
                                  mission.status === 'Devis reçus' && "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400",
                                  mission.status === 'Confirmée' && "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400",
                                  mission.status === 'Payée' && "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400",
                                  mission.status === 'Livrée' && "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                                )}>
                                  {mission.status}
                                </span>
                                {mission.price && (
                                  <span className="text-xs text-[var(--text-secondary)]">
                                    {mission.price.toLocaleString('fr-FR')} FCFA
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">
                              {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Search className="w-8 h-8 mx-auto text-[var(--text-secondary)] mb-2" />
                      <p className="text-[var(--text-secondary)]">Aucune mission trouvée</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        Essayez avec un autre mot-clé
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="flex items-center gap-2">
              <NotificationBell />
            </div>
            
            {/* Profil avec infos - à droite (desktop) - CLICKABLE */}
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden md:flex items-center gap-3 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--text-primary)]">{user.companyName || user.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-base lg:text-lg font-bold text-blue-700 dark:text-blue-400 flex-shrink-0">
                {user.companyName?.charAt(0) || user.name.charAt(0)}
              </div>
            </button>

            {/* Version mobile - icône profil seule - CLICKABLE */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex md:hidden items-center gap-2 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-400">
                {user.companyName?.charAt(0) || user.name.charAt(0)}
              </div>
            </button>
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