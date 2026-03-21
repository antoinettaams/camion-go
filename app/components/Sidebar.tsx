'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Search, Package, Settings, LogOut, Truck,
  PlusCircle, ListOrdered, History, BarChart3, X,
  UserCircle, AlertTriangle
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/Button';

interface SidebarProps {
  userRole: 'chauffeur' | 'entreprise';
  userName: string;
  userInitial: string;
  userEmail?: string;
  companyName?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout: () => Promise<void>;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

// Menu items par rôle - SUPPRIMEZ LES href POUR LES ONGLETS INTERNES
const MENU_ITEMS = {
  chauffeur: [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Accueil' },
    { id: 'available', icon: <Search className="w-5 h-5" />, label: 'Missions disponibles' },
    { id: 'my-missions', icon: <Package className="w-5 h-5" />, label: 'Mes missions' },
    { id: 'profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profil' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' },
  ],
  entreprise: [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Accueil' },
    { id: 'new-request', icon: <PlusCircle className="w-5 h-5" />, label: 'Nouvelle demande' },
    { id: 'orders', icon: <ListOrdered className="w-5 h-5" />, label: 'Commandes' },
    { id: 'history', icon: <History className="w-5 h-5" />, label: 'Historique' },
    { id: 'profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profil' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' },
  ]
};

export function Sidebar({
  userRole,
  userName,
  userInitial,
  userEmail,
  companyName,
  activeTab,
  onTabChange,
  onLogout,
  isMobileOpen = false,
  onMobileClose,
  className
}: SidebarProps) {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = MENU_ITEMS[userRole] || [];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const SidebarItem = ({ item }: { item: any }) => {
    // Pour les items sans href, on utilise activeTab
    const isActive = activeTab === item.id;

    const baseClasses = cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
      isActive 
        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" 
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white"
    );

    // Tous les items sont des boutons qui changent l'onglet
    return (
      <button 
        onClick={() => {
          onTabChange?.(item.id);
          onMobileClose?.();
        }} 
        className={baseClasses}
      >
        <div className="flex-shrink-0">{item.icon}</div>
        <span className="flex-1">{item.label}</span>
      </button>
    );
  };

  // Version desktop
  const DesktopSidebar = () => (
    <aside className={cn(
      "hidden md:flex md:w-64 lg:w-72 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex-shrink-0 flex-col",
      className
    )}>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600 dark:text-blue-400" />
          <span className="text-base lg:text-lg font-bold text-[var(--text-primary)]">CamionGo</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="p-3 lg:p-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );

  // Version mobile
  const MobileSidebar = () => (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50">
      <div className="absolute left-0 top-0 h-full w-64 sm:w-72 bg-[var(--bg-secondary)] shadow-xl flex flex-col">
        {/* Header mobile */}
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-[var(--text-primary)]">CamionGo</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation mobile */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Déconnexion mobile */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <button
            onClick={() => {
              setIsLogoutModalOpen(true);
              onMobileClose?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Modal de déconnexion
  const LogoutModal = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] rounded-xl sm:rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-[var(--border-color)]">
        <div className="p-4 sm:p-6 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mx-auto mb-3 sm:mb-4">
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">Déconnexion</h3>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/30 px-4 sm:px-6 py-3 sm:py-4 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1"
              disabled={isLoggingOut}
            >
              Annuler
            </Button>
            <Button 
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white flex-1" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      {isMobileOpen && <MobileSidebar />}
      {isLogoutModalOpen && <LogoutModal />}
    </>
  );
}