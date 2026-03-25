'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Package, MapPin, ArrowRight 
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { useAppContext } from '@/app/context/AppContext';

export function MyMissions() {
  const { user, missions, quotes } = useAppContext();
  const [filter, setFilter] = useState('all');

  // Filtrer les missions du chauffeur connecté
  const driverMissions = useMemo(() => {
    if (!user) return [];
    return missions.filter(mission => mission.driverId === user.id);
  }, [missions, user]);

  // Filtrer selon l'onglet sélectionné
  const filteredMissions = useMemo(() => {
    if (filter === 'active') {
      // Missions actives: Confirmée, Payée, En cours
      return driverMissions.filter(mission => 
        mission.status === 'Confirmée' || 
        mission.status === 'Payée' || 
        mission.status === 'En cours'
      );
    }
    if (filter === 'completed') {
      // Missions terminées: Livrée
      return driverMissions.filter(mission => mission.status === 'Livrée');
    }
    // Toutes les missions
    return driverMissions;
  }, [driverMissions, filter]);

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Mes missions</h1>
        <Badge variant="outline" className="bg-[var(--bg-secondary)]">
          {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toutes
        </Button>
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('active')}
        >
          En cours ({driverMissions.filter(m => m.status === 'Confirmée' || m.status === 'Payée' || m.status === 'En cours').length})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Terminées ({driverMissions.filter(m => m.status === 'Livrée').length})
        </Button>
      </div>

      {/* Liste des missions */}
      {filteredMissions.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-12 text-center">
          <Package className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Aucune mission</h3>
          <p className="text-[var(--text-secondary)]">
            {filter === 'active' 
              ? "Vous n'avez pas de mission en cours actuellement."
              : filter === 'completed'
              ? "Vous n'avez pas encore de missions terminées."
              : "Vous n'avez pas encore de missions. Consultez les missions disponibles pour postuler."}
          </p>
          {filter === 'all' && (
            <Link href="/dashboard/chauffeur?tab=available">
              <Button variant="outline" className="mt-4">
                Voir les missions disponibles
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMissions.map(mission => (
            <MissionItem 
              key={mission.id} 
              mission={mission} 
              quotes={quotes} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MissionItemProps {
  mission: any; // Type Mission
  quotes: any[]; // Type Quote[]
}

function MissionItem({ mission, quotes }: MissionItemProps) {
  // Trouver le devis accepté pour cette mission
  const missionQuote = mission.acceptedQuoteId 
    ? quotes.find(q => q.id === mission.acceptedQuoteId)
    : null;

  // Fonction pour obtenir la couleur du badge selon le statut
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Confirmée':
        return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
      case 'Payée':
        return 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400';
      case 'En cours':
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'Livrée':
        return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400';
      case 'Annulée':
        return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  // Fonction pour obtenir le texte du statut en français
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Confirmée':
        return 'Confirmée - En attente de paiement';
      case 'Payée':
        return 'Payée - Contact débloqué';
      case 'En cours':
        return 'En cours de livraison';
      case 'Livrée':
        return 'Livrée';
      default:
        return status;
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {mission.merchandiseType || "Type non spécifié"}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {mission.departure || "?"} → {mission.destination || "?"}
              </p>
            </div>
            <Badge className={getStatusColorClass(mission.status)}>
              {getStatusText(mission.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Chargement</p>
              <p className="font-medium text-[var(--text-primary)]">
                {mission.weightVolume && mission.weightVolume !== "Non spécifié" 
                  ? mission.weightVolume 
                  : "Non spécifié"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Date souhaitée</p>
              <p className="font-medium text-[var(--text-primary)]">
                {mission.desiredDate 
                  ? new Date(mission.desiredDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : "Non spécifiée"}
              </p>
            </div>
            {missionQuote && (
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Prix convenu</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {missionQuote.price.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            )}
          </div>

          {/* Afficher des informations supplémentaires selon le statut */}
          {mission.status === 'Confirmée' && (
            <div className="bg-amber-50 dark:bg-amber-500/10 p-3 rounded-lg border border-amber-200 dark:border-amber-500/20">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                ⏳ En attente de paiement de la commission pour débloquer le contact client.
              </p>
            </div>
          )}
          {mission.status === 'En cours' && (
            <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-lg border border-blue-200 dark:border-blue-500/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                🚚 Livraison en cours. Mettez à jour le statut une fois la livraison terminée.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end lg:border-l lg:border-[var(--border-color)] lg:pl-6">
          <Link href={`/dashboard/chauffeur/mission/${mission.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              Voir détails
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}