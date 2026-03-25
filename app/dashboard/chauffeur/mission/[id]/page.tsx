'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Package, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { Input } from '@/app/components/ui/Input';
import { useAppContext } from '@/app/context/AppContext';
import toast from 'react-hot-toast';

export default function ChauffeurMissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Déballer params avec React.use()
  const { id } = use(params);
  
  const router = useRouter();
  const { user, missions, users, addQuote, quotes, updateMissionStatus, appLoading } = useAppContext();
  
  const [price, setPrice] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Debug: Log pour voir ce qui est chargé
  useEffect(() => {
    console.log("=== Page Détail Mission Chauffeur ===");
    console.log("ID depuis l'URL:", id);
    console.log("Utilisateur connecté:", user);
    console.log("Toutes les missions:", missions.length);
    console.log("Missions complètes:", missions);
    console.log("Recherche de mission avec ID:", id);
    
    const foundMission = missions.find(m => m.id === id);
    console.log("Mission trouvée:", foundMission);
    
    if (foundMission) {
      console.log("Statut mission:", foundMission.status);
      console.log("DriverId mission:", foundMission.driverId);
      console.log("DriverId utilisateur:", user?.id);
      console.log("Est ma mission:", foundMission.driverId === user?.id);
    }
    
    setLoading(false);
  }, [id, missions, user]);

  // Attendre que les données soient chargées
  if (appLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Chargement de la mission...</p>
        </div>
      </div>
    );
  }

  const mission = missions.find(m => m.id === id);
  
  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center max-w-md mx-auto p-8">
          <Package className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Mission introuvable</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Aucune mission trouvée avec l'ID : {id}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {missions.length === 0 
              ? "Aucune mission n'est chargée dans le contexte." 
              : `${missions.length} mission(s) chargée(s) mais aucune ne correspond.`}
          </p>
          <Button variant="outline" onClick={() => router.push('/dashboard/chauffeur')}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Chargement de l'utilisateur...</p>
        </div>
      </div>
    );
  }

  const entreprise = users.find(u => u.id === mission.entrepriseId);
  const myQuote = quotes.find(q => q.missionId === mission.id && q.driverId === user.id);
  const isMyMission = mission.driverId === user.id;

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!price || !estimatedTime) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    addQuote({
      missionId: mission.id,
      driverId: user.id,
      price: Number(price),
      estimatedTime,
      message
    });

    toast.success('✅ Devis envoyé avec succès !', {
      duration: 3000,
      icon: '📄',
    });

    router.push('/dashboard/chauffeur');
  };

  const handleUpdateStatus = (newStatus: 'En cours' | 'Livrée') => {
    updateMissionStatus(mission.id, newStatus);
    
    const statusMessage = newStatus === 'En cours' 
      ? '🚚 Bonne route !' 
      : '✅ Livraison confirmée !';
    
    toast.success(statusMessage, {
      duration: 3000,
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" className="mb-6 -ml-4 text-slate-500" onClick={handleGoBack}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Button>

      {/* Carte de la mission */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {mission.merchandiseType || "Type non spécifié"}
            </h1>
            <div className="flex items-center gap-2 text-slate-500">
              <Building2 className="w-4 h-4" />
              <span>{entreprise?.companyName || entreprise?.name || "Entreprise"}</span>
            </div>
          </div>
          <Badge variant="status" status={mission.status} className="text-sm px-3 py-1">
            {mission.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Trajet</p>
              <p className="font-semibold text-slate-900">
                {mission.departure || "?"} → {mission.destination || "?"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Date souhaitée</p>
              <p className="font-semibold text-slate-900">
                {mission.desiredDate 
                  ? new Date(mission.desiredDate).toLocaleString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                  : "Non spécifiée"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-700 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Poids / Volume</p>
              <p className="font-semibold text-slate-900">
                {mission.weightVolume && mission.weightVolume !== "Non spécifié" 
                  ? mission.weightVolume 
                  : "Non spécifié"}
              </p>
            </div>
          </div>
        </div>

        {mission.note && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
            <p className="text-sm font-medium text-slate-700 mb-1">Note de l'entreprise :</p>
            <p className="text-sm text-slate-600">{mission.note}</p>
          </div>
        )}
      </div>

      {/* Section devis */}
      {!myQuote && ['En attente', 'Devis reçus'].includes(mission.status) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">Proposer un devis</h2>
            <p className="text-sm text-slate-500 mt-1">Détaillez votre offre pour augmenter vos chances d'être sélectionné.</p>
          </div>
          <form onSubmit={handleSubmitQuote} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Prix proposé (FCFA)</label>
                <div className="relative">
                  <Input 
                    type="number" 
                    required 
                    min="1000"
                    placeholder="ex: 45000"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="pl-4 pr-16 text-lg font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-slate-500 font-medium">FCFA</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Ce prix doit inclure tous vos frais (carburant, péages, etc.).</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Délai de livraison estimé</label>
                <Input 
                  required 
                  placeholder="ex: 4 heures, 1 jour"
                  value={estimatedTime}
                  onChange={e => setEstimatedTime(e.target.value)}
                  className="text-lg"
                />
                <p className="text-xs text-slate-500 mt-2">Soyez réaliste pour garantir la satisfaction du client.</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message pour l'entreprise (Optionnel)</label>
              <textarea 
                className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-700 resize-y"
                placeholder="Précisez vos conditions, votre disponibilité exacte ou tout autre détail rassurant..."
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-800">
                En soumettant ce devis, vous vous engagez à réaliser la mission aux conditions indiquées si l'entreprise l'accepte.
              </p>
            </div>

            <div className="pt-3 sm:pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-slate-100">
  <Button 
    type="button" 
    variant="outline" 
    onClick={handleGoBack}
    className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
  >
    Annuler
  </Button>
  <Button 
    type="submit" 
    className="bg-blue-700 hover:bg-blue-800 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
  >
    Envoyer ma proposition
  </Button>
</div>
          </form>
        </div>
      )}

      {/* Devis déjà envoyé */}
      {myQuote && !isMyMission && ['En attente', 'Devis reçus'].includes(mission.status) && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Proposition envoyée</h2>
                <p className="text-sm text-slate-500">L'entreprise étudie actuellement votre devis.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Prix proposé</p>
                  <p className="text-xl font-bold text-blue-700">{myQuote.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Délai estimé</p>
                  <p className="text-lg font-medium text-slate-900">{myQuote.estimatedTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Date d'envoi</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(myQuote.createdAt).toLocaleString('fr-FR', {
                      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {myQuote.message && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Votre message</p>
                  <p className="text-sm text-slate-700 italic">"{myQuote.message}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions si c'est ma mission */}
      {isMyMission && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Mettre à jour le statut</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {mission.status === 'Confirmée' && (
              <Button 
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
                onClick={() => handleUpdateStatus('En cours')}
              >
                J'ai démarré la livraison
              </Button>
            )}
            
            {mission.status === 'En cours' && (
              <Button 
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800"
                onClick={() => handleUpdateStatus('Livrée')}
              >
                Confirmer la livraison
              </Button>
            )}

            {mission.status === 'Payée' && (
              <Button 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={() => handleUpdateStatus('En cours')}
              >
                Démarrer la livraison
              </Button>
            )}

            {mission.status === 'Livrée' && (
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Mission terminée avec succès
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}