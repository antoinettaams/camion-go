// src/app/dashboard/chauffeur/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, MapPin, Package, Star, Wallet, Bell, Clock, CheckCircle2, ArrowRight, Truck,
  LayoutDashboard, ListOrdered, History, BarChart3, UserCircle, Settings, LogOut,
  Building2, Lock, BellRing, TrendingUp, AlertTriangle
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

  // ✅ DashboardOverview
  const DashboardOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bonjour, {user.name}</h1>
            <div className="flex items-center gap-2 text-slate-600 mt-1">
              <Badge variant="outline" className="bg-slate-50">{user.truckType}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-blue-500 text-blue-500" /> {user.rating || 'Nouveau'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Zone: {user.zone}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href="/dashboard/chauffeur/mes-missions" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <Package className="w-4 h-4" />
              Mes missions
            </Button>
          </Link>
        </div>
      </div>

      {newlyConfirmedMissions.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-700">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-emerald-900">
                Félicitations ! Votre devis a été accepté.
              </p>
              <p className="text-sm text-emerald-700 mt-0.5">
                Vous avez {newlyConfirmedMissions.length} mission{newlyConfirmedMissions.length > 1 ? 's' : ''} confirmée{newlyConfirmedMissions.length > 1 ? 's' : ''} prête{newlyConfirmedMissions.length > 1 ? 's' : ''} à démarrer.
              </p>
            </div>
          </div>
          <Link href="/dashboard/chauffeur/mes-missions" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm">
              Commencer la livraison
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Disponibles</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{availableMissions.length}</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">En cours</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{myActiveMissions.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Devis en attente</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{myPendingQuotes.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-600">Revenus générés</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalEarnings.toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-500">FCFA</span></p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Nouvelles opportunités</h2>
          <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
            Zone: {user.zone}
          </Badge>
        </div>

        {availableMissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune mission disponible</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Il n'y a pas de nouvelles demandes de transport dans votre zone pour le moment. Revenez plus tard !
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableMissions.map(mission => (
              <div key={mission.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-blue-300 transition-all hover:shadow-md group">
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{mission.merchandiseType}</h3>
                          <Badge variant="status" status="En attente">Nouveau</Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                          Publiée le {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trajet</p>
                          <p className="font-medium text-slate-900">{mission.departure} &rarr; {mission.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Chargement</p>
                          <p className="font-medium text-slate-900">{mission.weightVolume}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-between items-start sm:items-end w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date souhaitée</p>
                      <p className="font-semibold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(mission.desiredDate).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'short'
                        })}
                      </p>
                    </div>
                    <Link href={`/dashboard/chauffeur/mission/${mission.id}`} className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto gap-2 group-hover:bg-blue-800 transition-colors">
                        Proposer un prix
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ✅ AvailableMissionsView
  const AvailableMissionsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Missions disponibles</h1>
          <p className="text-slate-600 mt-1">Trouvez de nouvelles opportunités de transport dans votre zone.</p>
        </div>
        <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50 text-sm px-3 py-1">
          Zone: {user.zone}
        </Badge>
      </div>

      {availableMissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune mission disponible</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Il n'y a pas de nouvelles demandes de transport dans votre zone pour le moment. Revenez plus tard !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableMissions.map(mission => (
            <div key={mission.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-blue-300 transition-all hover:shadow-md group">
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{mission.merchandiseType}</h3>
                        <Badge variant="status" status="En attente">Nouveau</Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        Publiée le {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trajet</p>
                        <p className="font-medium text-slate-900">{mission.departure} &rarr; {mission.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Chargement</p>
                        <p className="font-medium text-slate-900">{mission.weightVolume}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between items-start sm:items-end w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date souhaitée</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {new Date(mission.desiredDate).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short'
                      })}
                    </p>
                  </div>
                  <Link href={`/dashboard/chauffeur/mission/${mission.id}`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto gap-2 group-hover:bg-blue-800 transition-colors">
                      Proposer un prix
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ✅ AnalyticsView
  const AnalyticsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Analyses et Rapports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Revenus ce mois</h3>
          <p className="text-3xl font-bold text-slate-900">{(totalEarnings * 0.4).toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-500">FCFA</span></p>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12% par rapport au mois dernier</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Missions terminées</h3>
          <p className="text-3xl font-bold text-slate-900">{myCompletedMissions.length}</p>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+3 cette semaine</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Note moyenne</h3>
          <p className="text-3xl font-bold text-slate-900">{user.rating || 'N/A'}</p>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <Star className="w-4 h-4 mr-1 text-blue-500 fill-blue-500" />
            <span>Basé sur {myCompletedMissions.length} avis</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500">Graphiques détaillés d'activité à venir</p>
        </div>
      </div>
    </div>
  );

  // ✅ ProfileView
  const ProfileView = () => (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Profil Chauffeur</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-700">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1"><Truck className="w-4 h-4" /> {user.truckType}</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
              <Input defaultValue={user.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input defaultValue={user.email} type="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
              <Input defaultValue={user.phone} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Zone de couverture</label>
              <Input defaultValue={user.zone} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type de camion</label>
              <Input defaultValue={user.truckType} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacité (Tonnes)</label>
              <Input defaultValue={user.capacity} type="number" />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button onClick={() => toast.success('Profil mis à jour avec succès !')}>Enregistrer les modifications</Button>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ SettingsView
  const SettingsView = () => (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Lock className="w-5 h-5 text-slate-500" /> Sécurité du compte</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button variant="outline" className="mt-2">Mettre à jour le mot de passe</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><BellRing className="w-5 h-5 text-slate-500" /> Préférences de notification</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Nouvelles missions</p>
              <p className="text-sm text-slate-500">Recevoir une notification pour les nouvelles missions dans ma zone</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Devis acceptés</p>
              <p className="text-sm text-slate-500">Être notifié quand une entreprise accepte mon devis</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
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

  const SidebarItem = ({ id, icon, label, to }: { id: string, icon: React.ReactNode, label: string, to?: string }) => {
    if (to) {
      return (
        <Link
          href={to}
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
        onClick={() => setActiveTab(id)}
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
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 border-t border-slate-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <SidebarItem id="dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Tableau de bord" />
          <SidebarItem id="available" icon={<Search className="w-5 h-5" />} label="Missions disponibles" />
          <SidebarItem id="my-missions" icon={<Package className="w-5 h-5" />} label="Mes missions" to="/dashboard/chauffeur/mes-missions" />
          <SidebarItem id="analytics" icon={<BarChart3 className="w-5 h-5" />} label="Analyses" />
          <SidebarItem id="profile" icon={<UserCircle className="w-5 h-5" />} label="Profil" />
        </nav>
        <div className="p-4 border-t border-slate-200 space-y-1">
          <SidebarItem id="settings" icon={<Settings className="w-5 h-5" />} label="Paramètres" />
          <button
            onClick={openLogoutModal}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <div className="flex-shrink-0"><LogOut className="w-5 h-5" /></div>
            <span className="flex-1">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mx-auto mb-4">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Déconnexion</h3>
                    <p className="text-slate-500">
                      Êtes-vous sûr de vouloir vous déconnecter de votre espace entreprise ?
                    </p>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsLogoutModalOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white" 
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