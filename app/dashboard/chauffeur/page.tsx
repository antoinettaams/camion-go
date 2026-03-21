'use client';

import React, { useState, useEffect } from 'react';
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

// Importer les composants de contenu
import { DashboardOverview } from '@/app/components/dashboard/chauffeur/DashboardOverview';
import { AvailableMissions } from '@/app/components/dashboard/chauffeur/AvailableMissions';
import { MyMissions } from '@/app/components/dashboard/chauffeur/Mymissions';
import { Profile } from '@/app/components/dashboard/chauffeur/Profile';
import { Settings } from '@/app/components/dashboard/chauffeur/Settings';

export default function ChauffeurDashboardPage() {
  const { user, setUser, users } = useAppContext();
  const { user: firebaseUser, logout: firebaseLogout, loading: firebaseLoading } = useFirebaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);

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