'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Truck, Menu, X, UserCircle
} from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Sidebar } from '@/app/components/Sidebar';
import { Input } from '@/app/components/ui/Input';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { NotificationBell } from '@/app/components/NotificationBell';

// Importer les composants de contenu
import { DashboardOverview } from '@/app/components/dashboard/chauffeur/DashboardOverview';
import { AvailableMissions } from '@/app/components/dashboard/chauffeur/AvailableMissions';
import { MyMissions } from '@/app/components/dashboard/chauffeur/Mymissions';
import { Profile } from '@/app/components/dashboard/chauffeur/Profile';
import { Settings } from '@/app/components/dashboard/chauffeur/Settings';

export default function ChauffeurDashboardPage() {
  const { user, setUser, users, missions } = useAppContext();
  const { user: firebaseUser, logout: firebaseLogout, loading: firebaseLoading } = useFirebaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Charger l'utilisateur depuis Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (firebaseUser) {
        try {
          // Chercher dans la liste des users déjà chargés par AppContext
          const foundUser = users.find(u => u.id === firebaseUser.uid);
          if (foundUser) {
            setUser(foundUser);
            setLoading(false);
          } else {
            // Si pas trouvé, charger depuis Firestore directement
            const userDoc = await getDocs(query(
              collection(db!, 'users'),
              where('email', '==', firebaseUser.email)
            ));
            if (!userDoc.empty) {
              const userData = { id: userDoc.docs[0].id, ...userDoc.docs[0].data() } as any;
              setUser(userData);
            }
            setLoading(false);
          }
        } catch (error) {
          console.error("❌ Erreur chargement utilisateur:", error);
          setLoading(false);
        }
      }
    };

    if (firebaseUser) {
      loadUserData();
    }
  }, [firebaseUser, users, setUser]);

  // Filtrer les missions disponibles (celles qui sont en attente ou avec devis reçus)
  const availableMissions = useMemo(() => {
    return missions.filter(mission => 
      mission.status === 'En attente' || mission.status === 'Devis reçus'
    );
  }, [missions]);

  // Fonction de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Rechercher dans les missions disponibles
    const filtered = availableMissions.filter(mission => {
      return (
        mission.merchandiseType?.toLowerCase().includes(searchTerm) ||
        mission.departure?.toLowerCase().includes(searchTerm) ||
        mission.destination?.toLowerCase().includes(searchTerm) ||
        mission.id?.toLowerCase().includes(searchTerm) ||
        mission.note?.toLowerCase().includes(searchTerm) ||
        mission.weightVolume?.toLowerCase().includes(searchTerm)
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
    // Aller à l'onglet des missions disponibles et focus sur la mission
    setActiveTab('available');
    // Optionnel: vous pouvez passer un paramètre pour scroller vers la mission
    setTimeout(() => {
      const missionElement = document.getElementById(`mission-${missionId}`);
      if (missionElement) {
        missionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

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

  // Redirection
  useEffect(() => {
    if (!firebaseLoading && !firebaseUser) {
      router.push('/sign-in');
    } else if (user && user.role !== 'chauffeur') {
      router.push('/dashboard/entreprise');
    }
  }, [user, firebaseUser, firebaseLoading, router]);

  if (firebaseLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Chargement de votre profil...</p>
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

  // Fonction pour rendre le contenu selon l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview onViewAvailable={() => setActiveTab('available')} />;
      case 'available':
        return <AvailableMissions searchQuery={searchQuery} />;
      case 'my-missions':
        return <MyMissions />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview onViewAvailable={() => setActiveTab('available')} />;
    }
  };

  // Formater le prix
  const formatPrice = (price: number) => {
    return price?.toLocaleString('fr-FR') + ' FCFA';
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400';
      case 'Devis reçus':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400';
      case 'Confirmée':
        return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400';
      case 'Payée':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400';
      case 'Livrée':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <Sidebar
        userRole="chauffeur"
        userName={user.name}
        userInitial={user.name.charAt(0)}
        userEmail={user.email}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
                  placeholder="Rechercher une mission (type, trajet, ID...)"
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
                      <div className="px-4 py-2 text-xs text-[var(--text-secondary)] border-b border-[var(--border-color)] flex justify-between items-center">
                        <span>{searchResults.length} mission(s) trouvée(s)</span>
                        <button
                          onClick={() => setActiveTab('available')}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Voir toutes les missions
                        </button>
                      </div>
                      {searchResults.map((mission) => (
                        <button
                          key={mission.id}
                          onClick={() => handleMissionClick(mission.id)}
                          className="w-full text-left px-4 py-3 hover:bg-[var(--bg-primary)] transition-colors border-b border-[var(--border-color)] last:border-0"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-[var(--text-primary)] truncate">
                                  {mission.merchandiseType || 'Type non spécifié'}
                                </p>
                                <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusColor(mission.status))}>
                                  {mission.status}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)] truncate">
                                📍 {mission.departure} → {mission.destination}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                                {mission.weightVolume && mission.weightVolume !== 'Non spécifié' && (
                                  <span>📦 {mission.weightVolume}</span>
                                )}
                                {mission.desiredDate && (
                                  <span>📅 {new Date(mission.desiredDate).toLocaleDateString('fr-FR')}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              {mission.price && (
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  {formatPrice(mission.price)}
                                </p>
                              )}
                              <p className="text-xs text-[var(--text-secondary)] mt-1">
                                {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
                              </p>
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
                      <button
                        onClick={() => {
                          clearSearch();
                          setActiveTab('available');
                        }}
                        className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Voir toutes les missions disponibles
                      </button>
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
                <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{user.truckType} • {user.zone}</p>
              </div>
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-base lg:text-lg font-bold text-blue-700 dark:text-blue-400 flex-shrink-0">
                {user.name.charAt(0)}
              </div>
            </button>

            {/* Version mobile - icône profil seule - CLICKABLE */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex md:hidden items-center gap-2 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-400">
                {user.name.charAt(0)}
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