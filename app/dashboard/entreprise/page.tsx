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
  BellRing, Lock, TrendingUp, Truck, LogOut
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:border-blue-300 transition-all hover:shadow-md group relative overflow-hidden">
        {hasNewQuotes && (
          <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
        )}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{mission.merchandiseType}</h3>
                    <Badge variant="status" status={mission.status}>{mission.status}</Badge>
                    {hasNewQuotes && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {missionQuotesCount} devis
                      </span>
                    )}
                  </div>
                  {['En attente', 'Devis reçus'].includes(mission.status) && (
                    <button 
                      onClick={(e) => handleDelete(mission.id, e)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-4"
                      title="Supprimer la demande"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  Créée le {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
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
            <div className="flex flex-col items-start sm:items-end gap-2 w-full">
              {acceptedQuote && (
                <div className="text-lg font-bold text-slate-900">
                  {acceptedQuote.price.toLocaleString('fr-FR')} FCFA
                </div>
              )}
              <Link href={`/dashboard/entreprise/mission/${mission.id}`} className="w-full sm:w-auto">
                <Button variant={hasNewQuotes ? 'default' : 'outline'} className="w-full sm:w-auto gap-2">
                  {hasNewQuotes ? 'Voir les devis' : 'Voir les détails'}
                  <ArrowRight className="w-4 h-4" />
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
            {user.companyName?.charAt(0) || user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bonjour, {user.companyName || user.name}</h1>
            <div className="flex items-center gap-2 text-slate-600 mt-1">
              <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Espace Entreprise</span>
              <span>•</span>
              <span className="flex items-center gap-1">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={() => setActiveTab('new-request')} className="w-full sm:w-auto gap-2 bg-blue-700 hover:bg-blue-800 text-white shadow-sm">
            <Plus className="w-4 h-4" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {missionsWithQuotes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-700">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-blue-900">Vous avez reçu de nouveaux devis !</p>
              <p className="text-sm text-blue-700 mt-0.5">
                {missionsWithQuotes.length} mission{missionsWithQuotes.length > 1 ? 's' : ''} en attente de votre validation.
              </p>
            </div>
          </div>
          <Button onClick={() => setActiveTab('orders')} variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50">
            Voir les devis
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700"><Package className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-slate-600">Missions actives</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeMissions.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Clock className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-slate-600">Devis à valider</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{missionsWithQuotes.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-slate-600">Missions terminées</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{completedMissions.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CreditCard className="w-5 h-5" /></div>
            <p className="text-sm font-medium text-slate-600">Dépenses totales</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalSpent.toLocaleString('fr-FR')} <span className="text-sm font-normal text-slate-500">FCFA</span></p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Demandes récentes</h2>
          <Button variant="ghost" className="text-blue-600" onClick={() => setActiveTab('orders')}>Voir tout</Button>
        </div>
        {myMissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune demande pour le moment</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">Créez votre première demande de transport pour recevoir des devis.</p>
            <Button onClick={() => setActiveTab('new-request')} className="gap-2"><Plus className="w-4 h-4" /> Créer une demande</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {myMissions.slice(0, 3).map(mission => <MissionCard key={mission.id} mission={mission} />)}
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h1 className="text-xl font-bold text-slate-900">Nouvelle demande de transport</h1>
            <p className="text-sm text-slate-500 mt-1">Remplissez les détails pour recevoir des devis de chauffeurs.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type de marchandise</label>
                <Select value={formData.merchandiseType} onChange={e => setFormData({...formData, merchandiseType: e.target.value})}>
                  {MARCHANDISES.map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Poids / Volume estimé</label>
                <Input required placeholder="ex: 2 tonnes, 15m³" value={formData.weightVolume} onChange={e => setFormData({...formData, weightVolume: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lieu de départ</label>
                <Select value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
                <Select value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})}>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date et heure souhaitées</label>
                <Input type="datetime-local" required value={formData.desiredDate} onChange={e => setFormData({...formData, desiredDate: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Note pour le chauffeur (optionnel)</label>
                <textarea 
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  placeholder="Instructions particulières de chargement/déchargement..."
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab('dashboard')}>Annuler</Button>
              <Button type="submit">Publier la demande</Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ✅ OrdersView
  const OrdersView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Commandes effectuées</h1>
        <Badge variant="outline" className="bg-white">{activeMissions.length} actives</Badge>
      </div>
      {activeMissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <ListOrdered className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune commande active</h3>
          <p className="text-slate-500 mb-6">Vous n'avez aucune mission en cours ou en attente.</p>
          <Button onClick={() => setActiveTab('new-request')}>Créer une demande</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeMissions.map(mission => <MissionCard key={mission.id} mission={mission} />)}
        </div>
      )}
    </div>
  );

  // ✅ HistoryView
  const HistoryView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Historique des livraisons</h1>
        <Badge variant="outline" className="bg-white">{completedMissions.length} terminées</Badge>
      </div>
      {completedMissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun historique</h3>
          <p className="text-slate-500">Vos missions terminées apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedMissions.map(mission => <MissionCard key={mission.id} mission={mission} />)}
        </div>
      )}
    </div>
  );

  // ✅ AnalyticsView
  const AnalyticsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Analyses et Rapports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-700"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Dépenses totales</p>
              <p className="text-2xl font-bold text-slate-900">{totalSpent.toLocaleString('fr-FR')} FCFA</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><Truck className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Transports effectués</p>
              <p className="text-2xl font-bold text-slate-900">{completedMissions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Package className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Volume total (est.)</p>
              <p className="text-2xl font-bold text-slate-900">{completedMissions.length * 2.5} Tonnes</p>
            </div>
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
      <h1 className="text-2xl font-bold text-slate-900">Profil de l'entreprise</h1>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center gap-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-700">
            {user.companyName?.charAt(0) || user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.companyName || user.name}</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1"><Building2 className="w-4 h-4" /> Compte Entreprise</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise</label>
              <Input defaultValue={user.companyName || ''} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du contact</label>
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
              <p className="font-medium text-slate-900">Nouveaux devis</p>
              <p className="text-sm text-slate-500">Recevoir un email lorsqu'un chauffeur propose un prix</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Mises à jour de statut</p>
              <p className="text-sm text-slate-500">Être notifié quand une mission passe en cours ou est livrée</p>
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
      case 'new-request': return <NewRequestView />;
      case 'orders': return <OrdersView />;
      case 'history': return <HistoryView />;
      case 'analytics': return <AnalyticsView />;
      case 'profile': return <ProfileView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardOverview />;
    }
  };

  const SidebarItem = ({ id, icon, label }: { id: string, icon: React.ReactNode, label: string }) => (
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

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 border-t border-slate-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <SidebarItem id="dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Tableau de bord" />
          <SidebarItem id="new-request" icon={<PlusCircle className="w-5 h-5" />} label="Nouvelle demande" />
          <SidebarItem id="orders" icon={<ListOrdered className="w-5 h-5" />} label="Commandes effectuées" />
          <SidebarItem id="history" icon={<History className="w-5 h-5" />} label="Historique des livraisons" />
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