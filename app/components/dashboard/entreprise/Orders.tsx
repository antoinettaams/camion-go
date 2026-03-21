'use client';

import React from 'react';
import Link from 'next/link';
import { Package, MapPin, Clock, ArrowRight, ListOrdered } from 'lucide-react';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { useAppContext } from '@/app/context/AppContext';

export function Orders() {
  const { user, missions, quotes } = useAppContext();
 
  const myMissions = missions.filter(m => m.entrepriseId === user?.id);
  const activeMissions = myMissions.filter(m => !['Livrée', 'Annulée'].includes(m.status));

  if (activeMissions.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--border-color)] shadow-sm p-8 sm:p-12 text-center">
        <ListOrdered className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-secondary)] mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-bold mb-2">Aucune commande active</h3>
        <p className="text-sm text-[var(--text-secondary)]">Vous n'avez aucune mission en cours.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold">Commandes en cours</h1>
        <Badge variant="outline" className="bg-[var(--bg-secondary)]">
          {activeMissions.length} active{activeMissions.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {activeMissions.map(mission => (
          <OrderCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ mission }: any) {
  const { quotes } = useAppContext();
  const hasQuotes = mission.status === 'Devis reçus';
  const quotesCount = quotes.filter(q => q.missionId === mission.id).length;

  // Formater l'affichage du poids/volume
  const getWeightVolumeDisplay = () => {
    if (!mission.weightVolume) return "Non spécifié";
    const trimmed = mission.weightVolume.trim();
    if (trimmed === "" || trimmed === "tonnes") return "Non spécifié";
    return trimmed;
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-4 sm:p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {mission.merchandiseType || "Type non spécifié"}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                Créée le {mission.createdAt ? new Date(mission.createdAt).toLocaleDateString('fr-FR') : "Date inconnue"}
              </p>
            </div>
            <Badge variant="status" status={mission.status}>
              {mission.status || "En attente"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)]">Trajet</p>
                <p className="font-medium text-sm">
                  {mission.departure || "?"} → {mission.destination || "?"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)]">Chargement</p>
                <p className="font-medium text-sm">
                  {getWeightVolumeDisplay()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-[var(--border-color)] pt-3 sm:pt-0 sm:pl-6">
          <div className="sm:mb-4">
            <p className="text-xs text-[var(--text-secondary)]">Date souhaitée</p>
            <p className="font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 sm:hidden" />
              {mission.desiredDate ? new Date(mission.desiredDate).toLocaleDateString('fr-FR') : "Non spécifiée"}
            </p>
          </div>
          
          {hasQuotes && (
            <div className="mb-2">
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">
                {quotesCount} devis reçu{quotesCount > 1 ? 's' : ''}
              </Badge>
            </div>
          )}

          <Link href={`/dashboard/entreprise/mission/${mission.id}`}>
            <Button variant={hasQuotes ? 'default' : 'outline'} size="sm" className="gap-2">
              {hasQuotes ? 'Voir les devis' : 'Détails'}
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}