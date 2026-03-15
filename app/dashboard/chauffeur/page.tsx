// src/app/dashboard/chauffeur/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, MapPin, Package, Star, Wallet, Bell, Clock, CheckCircle2, ArrowRight, Truck,
  LayoutDashboard, ListOrdered, History, BarChart3, UserCircle, Settings, LogOut,
  Building2, Lock, BellRing, TrendingUp, AlertTriangle, Home, PlusCircle, Menu, X
} from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';

export default function ChauffeurDashboardPage() {
  const { user, missions, quotes } = useAppContext();
  const { logout: firebaseLogout, loading: firebaseLoading } = useFirebaseAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);

  // ✅ UN SEUL EFFET pour la redirection
  useEffect(() => {
    if (!firebaseLoading) {
      if (!user) {
        console.log("❌ Aucun utilisateur - redirection vers sign-in");
        router.push('/sign-in');
      } else if (user.role !== 'chauffeur') {
        console.log(`❌ Mauvais rôle (${user.role}) - redirection vers entreprise`);
        router.push('/dashboard/entreprise');
      } else {
        console.log("✅ Dashboard chauffeur chargé pour:", user.email);
      }
    }
  }, [user, firebaseLoading, router]);

  // ✅ UN SEUL LOADER
  if (firebaseLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">
            {firebaseLoading ? "Connexion à Firebase..." : "Chargement de votre profil..."}
          </p>
        </div>
      </div>
    );
  }

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await firebaseLogout();
      toast.success('👋 Déconnexion réussie', {
        duration: 2000,
        icon: '👋',
        style: {
          background: '#10b981',
          color: 'white',
        },
      });
      router.push('/');
    } catch (error) {
      toast.error('❌ Erreur lors de la déconnexion');
    }
  };

  // ✅ Données du dashboard
  const availableMissions = missions.filter(m => 
    ['En attente', 'Devis reçus'].includes(m.status) && 
    !quotes.some(q => q.missionId === m.id && q.driverId === user.id)
  );

  const myActiveMissions = missions.filter(m => 
    m.driverId === user.id && ['Confirmée', 'En cours'].includes(m.status)
  );

  const myCompletedMissions = missions.filter(m => 
    m.driverId === user.id && m.status === 'Livrée'
  );

  const myPendingQuotes = quotes.filter(q => 
    q.driverId === user.id && 
    missions.find(m => m.id === q.missionId)?.status === 'Devis reçus' &&
    missions.find(m => m.id === q.missionId)?.acceptedQuoteId !== q.id
  );

  const newlyConfirmedMissions = myActiveMissions.filter(m => m.status === 'Confirmée');

  const totalEarnings = myCompletedMissions.reduce((acc, mission) => {
    const quote = quotes.find(q => q.id === mission.acceptedQuoteId);
    return acc + (quote?.price || 0);
  }, 0);

  // Filtrer les missions en fonction de la recherche
  const filteredAvailableMissions = availableMissions.filter(mission => 
    mission.merchandiseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.weightVolume.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ DashboardOverview
  const DashboardOverview = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-blue-700 flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">Bonjour, {user.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-slate-600 mt-1">
              <Badge variant="outline" className="bg-slate-50 text-xs sm:text-sm">{user.truckType}</Badge>
              <span className="hidden xs:inline">•</span>
              <span className="flex items-center gap-1 text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-blue-500 text-blue-500" /> 
                {user.rating || 'Nouveau'}
              </span>
              <span className="hidden xs:inline">•</span>
              <span className="flex items-center gap-1 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" /> Zone: {user.zone}
              </span>
            </div>
          </div>
        </div>
        <Link href="/dashboard/chauffeur/mes-missions" className="w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2">
            <Package className="w-4 h-4" />
            <span className="sm:hidden">Mes missions</span>
            <span className="hidden sm:inline">Mes missions</span>
          </Button>
        </Link>
      </div>

      {newlyConfirmedMissions.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="p-2 sm:p-3 bg-emerald-100 rounded-full text-emerald-700 flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-emerald-900">
                Félicitations !
              </p>
              <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                {newlyConfirmedMissions.length} mission{newlyConfirmedMissions.length > 1 ? 's' : ''} confirmée{newlyConfirmedMissions.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link href="/dashboard/chauffeur/mes-missions" className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm">
              Commencer
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg text-blue-700">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Disponibles</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{availableMissions.length}</p>
        </div>
        
        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg text-blue-600">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">En cours</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{myActiveMissions.length}</p>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-yellow-50 rounded-lg text-yellow-600">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Devis</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{myPendingQuotes.length}</p>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Revenus</p>
          </div>
          <p className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">
            {totalEarnings.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
          </p>
        </div>
      </div>

      {/* Nouvelles opportunités */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Nouvelles opportunités</h2>
          <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 text-xs sm:text-sm px-2 sm:px-3 py-1">
            Zone: {user.zone}
          </Badge>
        </div>

        {filteredAvailableMissions.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              {searchQuery ? "Aucun résultat" : "Aucune mission disponible"}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {searchQuery 
                ? "Aucune mission ne correspond à votre recherche." 
                : "Il n'y a pas de nouvelles demandes dans votre zone pour le moment."}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredAvailableMissions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ✅ MissionCard Component
  const MissionCard = ({ mission }: { mission: any }) => (
    <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 hover:border-blue-300 transition-all hover:shadow-md group">
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-700 transition-colors">{mission.merchandiseType}</h3>
                <Badge variant="status" status="En attente" className="text-xs">Nouveau</Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Publiée le {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-100">
            <div className="flex items-start gap-2 sm:gap-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trajet</p>
                <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{mission.departure} &rarr; {mission.destination}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Chargement</p>
                <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{mission.weightVolume}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 gap-3 sm:gap-0">
          <div className="sm:mb-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 hidden sm:block">Date souhaitée</p>
            <p className="font-semibold text-slate-900 flex items-center gap-2 text-sm sm:text-base">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 sm:hidden" />
              {new Date(mission.desiredDate).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short'
              })}
            </p>
          </div>
          <Link href={`/dashboard/chauffeur/mission/${mission.id}`} className="w-auto sm:w-full">
            <Button size="sm" className="w-full sm:w-auto gap-2 text-xs sm:text-sm group-hover:bg-blue-800 transition-colors">
              Proposer
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // ✅ AvailableMissionsView
  const AvailableMissionsView = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Missions disponibles</h1>
          <p className="text-sm text-slate-600 mt-1">Trouvez de nouvelles opportunités.</p>
        </div>
        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 text-xs sm:text-sm px-3 py-1">
          Zone: {user.zone}
        </Badge>
      </div>

      {filteredAvailableMissions.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
            {searchQuery ? "Aucun résultat" : "Aucune mission disponible"}
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {searchQuery 
              ? "Aucune mission ne correspond à votre recherche." 
              : "Il n'y a pas de nouvelles demandes dans votre zone pour le moment."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredAvailableMissions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}
    </div>
  );

  // ✅ AnalyticsView
  const AnalyticsView = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Analyses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">Revenus ce mois</h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
            {(totalEarnings * 0.4).toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span>
          </p>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-emerald-600">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>+12%</span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">Missions terminées</h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{myCompletedMissions.length}</p>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-emerald-600">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>+3 cette semaine</span>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs sm:text-sm font-medium text-slate-500 mb-2">Note moyenne</h3>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{user.rating || 'N/A'}</p>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-slate-500">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500 fill-blue-500" />
            <span>{myCompletedMissions.length} avis</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm h-48 sm:h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-xs sm:text-sm text-slate-500">Graphiques à venir</p>
        </div>
      </div>
    </div>
  );

  // ✅ ProfileView
  const ProfileView = () => (
    <div className="max-w-3xl space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Profil</h1>
      <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-100 rounded-full flex items-center justify-center text-2xl sm:text-4xl font-bold text-blue-700 flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{user.name}</h2>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-1">
              <Truck className="w-3 h-3 sm:w-4 sm:h-4" /> {user.truckType}
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Nom complet</label>
              <Input defaultValue={user.name} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input defaultValue={user.email} type="email" className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <Input defaultValue={user.phone} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Zone</label>
              <Input defaultValue={user.zone} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Type de camion</label>
              <Input defaultValue={user.truckType} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Capacité</label>
              <Input defaultValue={user.capacity} type="number" className="text-sm" />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button size="sm" onClick={() => toast.success('Profil mis à jour !')}>Enregistrer</Button>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ SettingsView
  const SettingsView = () => (
    <div className="max-w-3xl space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Paramètres</h1>
      
      <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Sécurité
          </h2>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label>
            <Input type="password" placeholder="••••••••" className="text-sm" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
            <Input type="password" placeholder="••••••••" className="text-sm" />
          </div>
          <Button variant="outline" size="sm" className="mt-2">Mettre à jour</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BellRing className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Notifications
          </h2>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-medium text-slate-900">Nouvelles missions</p>
              <p className="text-xs text-slate-500">Dans votre zone</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-medium text-slate-900">Devis acceptés</p>
              <p className="text-xs text-slate-500">Quand une entreprise accepte</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'available': return <AvailableMissionsView />;
      case 'analytics': return <AnalyticsView />;
      case 'profile': return <ProfileView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardOverview />;
    }
  };

  // Menu items pour desktop
  const menuItems = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Accueil' },
    { id: 'available', icon: <Search className="w-5 h-5" />, label: 'Missions disponibles' },
    { id: 'my-missions', icon: <Package className="w-5 h-5" />, label: 'Mes missions', to: '/dashboard/chauffeur/mes-missions' },
    { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analyses' },
    { id: 'profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profil' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' },
  ];

  const SidebarItem = ({ id, icon, label, to }: { id: string, icon: React.ReactNode, label: string, to?: string }) => {
    if (to) {
      return (
        <Link
          href={to}
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
            "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <div className="flex-shrink-0">{icon}</div>
          <span className="flex-1">{label}</span>
        </Link>
      );
    }
    return (
      <button
        onClick={() => {
          setActiveTab(id);
          setIsMobileMenuOpen(false);
        }}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
          activeTab === id 
            ? "bg-blue-50 text-blue-700" 
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <div className="flex-shrink-0">{icon}</div>
        <span className="flex-1">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header responsive */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Menu hamburger - seulement sur mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg flex-shrink-0"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
          </button>

          {/* Logo CamionGo - visible seulement sur desktop */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Truck className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-700" />
            <span className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">CamionGo</span>
          </div>

          {/* Barre de recherche - responsive */}
          <div className={cn(
            "flex-1 transition-all duration-200",
            isMobileSearchFocused ? "max-w-full" : "max-w-md lg:max-w-2xl"
          )}>
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Rechercher une mission..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsMobileSearchFocused(true)}
                onBlur={() => setIsMobileSearchFocused(false)}
                className="w-full pl-8 sm:pl-10 pr-8 py-1.5 sm:py-2 text-sm sm:text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Avatar + Icône camion sur mobile */}
          <div className="flex items-center gap-2 md:hidden flex-shrink-0">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-blue-700">
              {user.name.charAt(0)}
            </div>
          </div>

          {/* User info - desktop */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.truckType}</p>
            </div>
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center text-base lg:text-lg font-bold text-blue-700 flex-shrink-0">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex-col">
          <nav className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-1">
            {menuItems.map(item => (
              <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} to={item.to} />
            ))}
          </nav>
          <div className="p-3 lg:p-4 border-t border-slate-200">
            <button
              onClick={openLogoutModal}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Mobile Menu Modal */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/50">
            <div className="absolute left-0 top-0 h-full w-64 sm:w-72 bg-white shadow-xl">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
                {menuItems.map(item => (
                  <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} to={item.to} />
                ))}
                <button
                  onClick={openLogoutModal}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mx-auto mb-3 sm:mb-4">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Déconnexion</h3>
              <p className="text-sm sm:text-base text-slate-500">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
            </div>
            <div className="bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white flex-1" 
                  onClick={confirmLogout}
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}