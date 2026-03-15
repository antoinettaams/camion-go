// src/app/dashboard/entreprise/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, PlusCircle, ListOrdered, History, 
  BarChart3, UserCircle, Settings, Plus, Package, 
  CheckCircle2, CreditCard, Bell, Clock, MapPin,  
  ArrowRight, Building2, Trash2, AlertTriangle, 
  BellRing, Lock, TrendingUp, Truck, LogOut, Home,
  Menu, Search, X, ChevronDown
} from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';

const MARCHANDISES = ['Alimentaire', 'Électroménager', 'Matériaux de construction', 'Pièces détachées', 'Autre'];
const CITIES = ['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Bohicon', 'Natitingou', 'Lokossa', 'Ouidah', 'Kandi', 'Djougou'];

export default function EntrepriseDashboardPage() {
  const { user, missions, quotes, deleteMission, addMission, logout: appLogout } = useAppContext();
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
      } else if (user.role !== 'entreprise') {
        console.log(`❌ Mauvais rôle (${user.role}) - redirection vers chauffeur`);
        router.push('/dashboard/chauffeur');
      } else {
        console.log("✅ Dashboard entreprise chargé pour:", user.email);
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
      appLogout();
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
  const myMissions = missions.filter(m => m.entrepriseId === user.id);
  const activeMissions = myMissions.filter(m => !['Livrée', 'Annulée'].includes(m.status));
  const completedMissions = myMissions.filter(m => m.status === 'Livrée');
  const missionsWithQuotes = myMissions.filter(m => m.status === 'Devis reçus');

  const totalSpent = completedMissions.reduce((acc, mission) => {
    const quote = quotes.find(q => q.id === mission.acceptedQuoteId);
    return acc + (quote?.price || 0);
  }, 0);

  // Filtrer les missions en fonction de la recherche
  const filteredMissions = myMissions.filter(mission => 
    mission.merchandiseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mission.weightVolume.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Composant MissionCard
  const MissionCard = ({ mission }: { mission: any }) => {
    const missionQuotesCount = quotes.filter(q => q.missionId === mission.id).length;
    const hasNewQuotes = mission.status === 'Devis reçus';
    const acceptedQuote = mission.acceptedQuoteId 
      ? quotes.find(q => q.id === mission.acceptedQuoteId) 
      : null;

    const handleDelete = (missionId: string, event: React.MouseEvent) => {
      event.preventDefault();
      
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium">Supprimer cette demande ?</p>
          <p className="text-sm text-slate-500">Cette action est irréversible.</p>
          <div className="flex gap-2 justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => toast.dismiss(t.id)}
            >
              Annuler
            </Button>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                deleteMission(missionId);
                toast.dismiss(t.id);
                toast.success('Demande supprimée', {
                  duration: 2000,
                  icon: '🗑️',
                });
              }}
            >
              Confirmer
            </Button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
      });
    };

    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 hover:border-blue-300 transition-all hover:shadow-md group relative overflow-hidden">
        {hasNewQuotes && (
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
        )}
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-blue-700 transition-colors">{mission.merchandiseType}</h3>
                    <Badge variant="status" status={mission.status} className="text-xs">{mission.status}</Badge>
                    {hasNewQuotes && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {missionQuotesCount} devis
                      </span>
                    )}
                  </div>
                  {['En attente', 'Devis reçus'].includes(mission.status) && (
                    <button 
                      onClick={(e) => handleDelete(mission.id, e)}
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-2 sm:ml-4"
                      title="Supprimer la demande"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Créée le {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
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
            <div className="flex flex-col items-end gap-2">
              {acceptedQuote && (
                <div className="text-base sm:text-lg font-bold text-slate-900 whitespace-nowrap">
                  {acceptedQuote.price.toLocaleString('fr-FR')} FCFA
                </div>
              )}
              <Link href={`/dashboard/entreprise/mission/${mission.id}`} className="w-full sm:w-auto">
                <Button variant={hasNewQuotes ? 'default' : 'outline'} size="sm" className="w-full sm:w-auto gap-2 text-xs sm:text-sm">
                  {hasNewQuotes ? 'Voir les devis' : 'Détails'}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ✅ DashboardOverview
  const DashboardOverview = () => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Carte de bienvenue responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-blue-700 flex-shrink-0">
            {user.companyName?.charAt(0) || user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">Bonjour, {user.companyName || user.name}</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-slate-600 mt-1">
              <span className="flex items-center gap-1 text-xs sm:text-sm"><Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> Espace Entreprise</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-xs sm:text-sm truncate">{user.email}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => setActiveTab('new-request')} size="sm" className="w-full sm:w-auto gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-sm">
          <Plus className="w-4 h-4" />
          <span className="sm:hidden">Nouvelle</span>
          <span className="hidden sm:inline">Nouvelle demande</span>
        </Button>
      </div>

      {missionsWithQuotes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full text-blue-700 flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-blue-900">Nouveaux devis !</p>
              <p className="text-xs sm:text-sm text-blue-700 mt-0.5">
                {missionsWithQuotes.length} mission{missionsWithQuotes.length > 1 ? 's' : ''} en attente
              </p>
            </div>
          </div>
          <Button onClick={() => setActiveTab('orders')} variant="outline" size="sm" className="w-full sm:w-auto bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
            Voir les devis
          </Button>
        </div>
      )}

      {/* Stats cards responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg text-blue-700"><Package className="w-4 h-4 sm:w-5 sm:h-5" /></div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Actives</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{activeMissions.length}</p>
        </div>
        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-yellow-50 rounded-lg text-yellow-600"><Clock className="w-4 h-4 sm:w-5 sm:h-5" /></div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Devis</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{missionsWithQuotes.length}</p>
        </div>
        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /></div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Terminées</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900">{completedMissions.length}</p>
        </div>
        <div className="bg-white p-3 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg text-blue-600"><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /></div>
            <p className="text-xs sm:text-sm font-medium text-slate-600">Dépenses</p>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">{totalSpent.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">FCFA</span></p>
        </div>
      </div>

      {/* Demandes récentes */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Demandes récentes</h2>
          <Button variant="ghost" size="sm" className="text-blue-600 text-sm" onClick={() => setActiveTab('orders')}>Voir tout</Button>
        </div>
        {filteredMissions.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              {searchQuery ? "Aucun résultat" : "Aucune demande"}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery 
                ? "Aucune mission ne correspond à votre recherche." 
                : "Créez votre première demande de transport."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setActiveTab('new-request')} size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Créer une demande
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredMissions.slice(0, 3).map(mission => <MissionCard key={mission.id} mission={mission} />)}
          </div>
        )}
      </div>
    </div>
  );

  // ✅ NewRequestView
  const NewRequestView = () => {
    const [formData, setFormData] = useState({
      merchandiseType: MARCHANDISES[0],
      weightVolume: '',
      departure: CITIES[0],
      destination: CITIES[1],
      desiredDate: '',
      note: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addMission({ entrepriseId: user.id, ...formData });
      toast.success('✅ Demande publiée avec succès !', {
        duration: 3000,
        icon: '🚀',
        style: {
          background: '#10b981',
          color: 'white',
        },
      });
      setActiveTab('orders');
    };

    return (
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">Nouvelle demande</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Remplissez les détails pour recevoir des devis.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Type de marchandise</label>
                <Select value={formData.merchandiseType} onChange={e => setFormData({...formData, merchandiseType: e.target.value})} className="text-sm">
                  {MARCHANDISES.map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Poids / Volume</label>
                <Input required placeholder="ex: 2 tonnes" value={formData.weightVolume} onChange={e => setFormData({...formData, weightVolume: e.target.value})} className="text-sm" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Départ</label>
                <Select value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} className="text-sm">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Destination</label>
                <Select value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="text-sm">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Date souhaitée</label>
                <Input type="datetime-local" required value={formData.desiredDate} onChange={e => setFormData({...formData, desiredDate: e.target.value})} className="text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Note (optionnel)</label>
                <textarea 
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] sm:min-h-[100px]"
                  placeholder="Instructions..."
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab('dashboard')}>Annuler</Button>
              <Button type="submit" size="sm">Publier</Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ✅ OrdersView
  const OrdersView = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Commandes</h1>
        <Badge variant="outline" className="bg-white text-xs sm:text-sm">{activeMissions.length} actives</Badge>
      </div>
      {activeMissions.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
          <ListOrdered className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Aucune commande active</h3>
          <p className="text-sm text-slate-500 mb-6">Vous n'avez aucune mission en cours.</p>
          <Button onClick={() => setActiveTab('new-request')} size="sm">Créer une demande</Button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {activeMissions.map(mission => <MissionCard key={mission.id} mission={mission} />)}
        </div>
      )}
    </div>
  );

  // ✅ HistoryView
  const HistoryView = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-900">Historique</h1>
        <Badge variant="outline" className="bg-white text-xs sm:text-sm">{completedMissions.length} terminées</Badge>
      </div>
      {completedMissions.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
          <History className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Aucun historique</h3>
          <p className="text-sm text-slate-500">Vos missions terminées apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {completedMissions.map(mission => <MissionCard key={mission.id} mission={mission} />)}
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
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-blue-700"><TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" /></div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">Dépenses totales</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900">{totalSpent.toLocaleString('fr-FR')} FCFA</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg text-emerald-600"><Truck className="w-5 h-5 sm:w-6 sm:h-6" /></div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">Transports</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900">{completedMissions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg text-blue-600"><Package className="w-5 h-5 sm:w-6 sm:h-6" /></div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">Volume total</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900">{completedMissions.length * 2.5} Tonnes</p>
            </div>
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
            {user.companyName?.charAt(0) || user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{user.companyName || user.name}</h2>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-1"><Building2 className="w-3 h-3 sm:w-4 sm:h-4" /> Compte Entreprise</p>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Entreprise</label>
              <Input defaultValue={user.companyName || ''} className="text-sm" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Contact</label>
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
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2"><Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Sécurité</h2>
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
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2"><BellRing className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" /> Notifications</h2>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-medium text-slate-900">Nouveaux devis</p>
              <p className="text-xs text-slate-500">Email lors d'un devis</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-medium text-slate-900">Mises à jour</p>
              <p className="text-xs text-slate-500">Notifications de statut</p>
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
      case 'new-request': return <NewRequestView />;
      case 'orders': return <OrdersView />;
      case 'history': return <HistoryView />;
      case 'analytics': return <AnalyticsView />;
      case 'profile': return <ProfileView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardOverview />;
    }
  };

  // Menu items pour desktop
  const menuItems = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: 'Accueil' },
    { id: 'new-request', icon: <PlusCircle className="w-5 h-5" />, label: 'Nouvelle demande' },
    { id: 'orders', icon: <ListOrdered className="w-5 h-5" />, label: 'Commandes' },
    { id: 'history', icon: <History className="w-5 h-5" />, label: 'Historique' },
    { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Analyses' },
    { id: 'profile', icon: <UserCircle className="w-5 h-5" />, label: 'Profil' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' },
  ];

  const SidebarItem = ({ id, icon, label }: { id: string, icon: React.ReactNode, label: string }) => (
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
          placeholder="Rechercher..."
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
        {user.companyName?.charAt(0) || user.name.charAt(0)}
      </div>
    </div>

    {/* User info - desktop */}
    <div className="hidden md:flex items-center gap-3 flex-shrink-0">
      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">{user.companyName || user.name}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
      <div className="w-9 h-9 lg:w-10 lg:h-10 bg-blue-100 rounded-full flex items-center justify-center text-base lg:text-lg font-bold text-blue-700 flex-shrink-0">
        {user.companyName?.charAt(0) || user.name.charAt(0)}
      </div>
    </div>
  </div>
</header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex-col">
          <nav className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-1">
            {menuItems.map(item => (
              <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} />
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
                  <SidebarItem key={item.id} id={item.id} icon={item.icon} label={item.label} />
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

      {/* Logout Modal */}
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