// src/app/dashboard/chauffeur/mes-missions/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';  // ← Changé: Link de next/link
import { MapPin, Package, Wallet, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAppContext } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { cn } from '@/app/lib/utils';

export default function MesMissionsPage() {  // ← Changé: export default
  const { user, missions, quotes } = useAppContext();
  const [activeTab, setActiveTab] = useState<'en_cours' | 'historique' | 'mes_devis'>('en_cours');

  if (!user || user.role !== 'chauffeur') return null;

  const myMissions = missions.filter(m => m.driverId === user.id);
  const activeMissions = myMissions.filter(m => m.status !== 'Livrée' && m.status !== 'Annulée');
  const historyMissions = myMissions.filter(m => m.status === 'Livrée' || m.status === 'Annulée');
  
  const myQuotes = quotes.filter(q => q.driverId === user.id);

  const totalEarnings = historyMissions.reduce((acc, mission) => {
    if (mission.status === 'Livrée') {
      const quote = quotes.find(q => q.id === mission.acceptedQuoteId);
      return acc + (quote?.price || 0);
    }
    return acc;
  }, 0);

  const displayedMissions = activeTab === 'en_cours' ? activeMissions : historyMissions;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mes missions</h1>
        <p className="text-slate-600">Gérez vos livraisons et consultez votre historique</p>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-slate-100 p-1 rounded-lg mb-6 max-w-2xl">
        <button
          onClick={() => setActiveTab('en_cours')}
          className={cn(
            "flex-1 py-2.5 text-sm font-medium rounded-md transition-all",
            activeTab === 'en_cours' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          En cours ({activeMissions.length})
        </button>
        <button
          onClick={() => setActiveTab('mes_devis')}
          className={cn(
            "flex-1 py-2.5 text-sm font-medium rounded-md transition-all",
            activeTab === 'mes_devis' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Mes devis ({myQuotes.length})
        </button>
        <button
          onClick={() => setActiveTab('historique')}
          className={cn(
            "flex-1 py-2.5 text-sm font-medium rounded-md transition-all",
            activeTab === 'historique' ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
          )}
        >
          Historique ({historyMissions.length})
        </button>
      </div>

      {activeTab === 'historique' && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Gains totaux (Missions livrées)</p>
              <p className="text-2xl font-bold text-emerald-700">{totalEarnings.toLocaleString('fr-FR')} FCFA</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mes_devis' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {myQuotes.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Vous n'avez soumis aucun devis pour le moment.
              <div className="mt-4">
                <Link href="/dashboard/chauffeur">  {/* ← Changé: href au lieu de to */}
                  <Button variant="outline">Trouver des missions</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {myQuotes.map(quote => {
                const mission = missions.find(m => m.id === quote.missionId);
                if (!mission) return null;
                
                let quoteStatus = 'En attente';
                let statusClasses = 'bg-yellow-100 text-yellow-800';
                let StatusIcon = Clock;
                
                if (mission.acceptedQuoteId === quote.id) {
                  quoteStatus = 'Accepté';
                  statusClasses = 'bg-emerald-100 text-emerald-800';
                  StatusIcon = CheckCircle2;
                } else if (mission.acceptedQuoteId && mission.acceptedQuoteId !== quote.id) {
                  quoteStatus = 'Refusé';
                  statusClasses = 'bg-red-100 text-red-800';
                  StatusIcon = XCircle;
                }

                return (
                  <div key={quote.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-slate-900 text-lg">{mission.merchandiseType}</h3>
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", statusClasses)}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {quoteStatus}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{mission.departure} &rarr; {mission.destination}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">
                          Soumis le : {new Date(quote.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:items-end w-full sm:w-auto gap-2">
                        <div className="text-xl font-bold text-slate-900">{quote.price.toLocaleString('fr-FR')} FCFA</div>
                        <Link href={`/dashboard/chauffeur/mission/${mission.id}`}>  {/* ← Changé: href */}
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">Voir la mission</Button>
                        </Link>
                      </div>
                    </div>
                    {quote.message && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Votre message</p>
                        <p className="text-sm text-slate-600 italic">"{quote.message}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab !== 'mes_devis' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {displayedMissions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              {activeTab === 'en_cours' 
                ? "Vous n'avez pas de missions en cours." 
                : "Votre historique est vide."}
              {activeTab === 'en_cours' && (
                <div className="mt-4">
                  <Link href="/dashboard/chauffeur">  {/* ← Changé: href */}
                    <Button variant="outline">Trouver des missions</Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {displayedMissions.map(mission => {
                const quote = quotes.find(q => q.id === mission.acceptedQuoteId);
                return (
                  <div key={mission.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-slate-900 text-lg">{mission.merchandiseType}</h3>
                          <Badge variant="status" status={mission.status}>{mission.status}</Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{mission.departure} &rarr; {mission.destination}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span>{mission.weightVolume}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end w-full sm:w-auto gap-2">
                        <div className="text-xl font-bold text-blue-700">{quote?.price.toLocaleString('fr-FR')} FCFA</div>
                        <Link href={`/dashboard/chauffeur/mission/${mission.id}`}>  {/* ← Changé: href */}
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">Voir les détails</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}