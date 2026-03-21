'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Package, Clock, Calendar, 
  Truck, Filter, ArrowRight, Star, DollarSign
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { useAppContext } from '@/app/context/AppContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Mission, Quote } from '@/app/types';

interface AvailableMissionsProps {
  searchQuery?: string;
}

export function AvailableMissions({ searchQuery = '' }: AvailableMissionsProps) {
  const { user } = useAppContext();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'zone', 'capacity'

  // Extraire le poids du texte (ex: "2 tonnes" → 2)
  const extractWeight = (weightVolume: string): number => {
    const match = weightVolume?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!db || !user) return;

      try {
        // Charger toutes les missions disponibles (En attente ou Devis reçus)
        const missionsQuery = query(
          collection(db, 'missions'),
          where('status', 'in', ['En attente', 'Devis reçus']),
          orderBy('createdAt', 'desc')
        );
        const missionsSnapshot = await getDocs(missionsQuery);
        const allMissions = missionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Mission[];

        // Charger les devis déjà faits par ce chauffeur
        const quotesQuery = query(
          collection(db, 'quotes'),
          where('driverId', '==', user.id)
        );
        const quotesSnapshot = await getDocs(quotesQuery);
        const driverQuotes = quotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quote[];
        setQuotes(driverQuotes);

        // IDs des missions déjà devisées
        const quotedMissionIds = driverQuotes.map(q => q.missionId);
        
        // Filtrer pour ne garder que les missions NON déjà devisées
        let availableMissions = allMissions.filter(m => !quotedMissionIds.includes(m.id));
        
        setMissions(availableMissions);
      } catch (error) {
        console.error("❌ Erreur chargement missions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Appliquer les filtres selon la sélection
  const filteredMissions = useMemo(() => {
    let result = [...missions];

    // Appliquer le filtre "Ma zone uniquement"
    if (filter === 'zone') {
      result = result.filter(m => 
        m.departure === user?.zone || m.destination === user?.zone
      );
    }

    // Appliquer le filtre "Adaptées à mon camion"
    if (filter === 'capacity') {
      const userCapacity = user?.capacity || 0;
      result = result.filter(m => {
        const missionWeight = extractWeight(m.weightVolume);
        return missionWeight <= userCapacity;
      });
    }

    // Appliquer la recherche textuelle
    if (searchQuery) {
      result = result.filter(m => 
        m.merchandiseType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.departure?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.destination?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [missions, filter, searchQuery, user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* En-tête avec stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Missions disponibles</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {filteredMissions.length} mission{filteredMissions.length > 1 ? 's' : ''} 
            {filter === 'zone' && ' dans votre zone'}
            {filter === 'capacity' && ' adaptées à votre camion'}
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30">
          Zone: {user.zone}
        </Badge>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toutes les missions
        </Button>
        <Button 
          variant={filter === 'zone' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('zone')}
        >
          Ma zone uniquement
        </Button>
        <Button 
          variant={filter === 'capacity' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('capacity')}
        >
          Adaptées à mon camion
        </Button>
      </div>

      {/* Explication des filtres */}
      <div className="text-xs text-[var(--text-secondary)] bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
        {filter === 'all' && (
          <p>📦 Toutes les missions disponibles, où qu'elles partent ou arrivent.</p>
        )}
        {filter === 'zone' && (
          <p>📍 Missions dont le départ <span className="font-semibold text-blue-600 dark:text-blue-400">OU</span> la destination est dans <span className="font-semibold">{user.zone}</span>.</p>
        )}
        {filter === 'capacity' && (
          <p>🚛 Missions dont le poids est inférieur ou égal à votre capacité ({user.capacity} tonnes).</p>
        )}
      </div>

      {/* Liste des missions */}
      {filteredMissions.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-12 text-center">
          <Search className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Aucune mission disponible</h3>
          <p className="text-[var(--text-secondary)]">
            {filter === 'zone' && "Aucune mission ne passe par votre zone pour le moment."}
            {filter === 'capacity' && "Aucune mission ne correspond à la capacité de votre camion."}
            {filter === 'all' && "Aucune mission n'est disponible pour le moment. Revenez plus tard !"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMissions.map(mission => (
            <MissionCard 
              key={mission.id} 
              mission={mission} 
              user={user}
              isZoneMatch={mission.departure === user.zone || mission.destination === user.zone}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MissionCardProps {
  mission: Mission;
  user: any;
  isZoneMatch: boolean;
}

function MissionCard({ mission, user, isZoneMatch }: MissionCardProps) {
  const weight = parseInt(mission.weightVolume?.match(/(\d+)/)?.[0] || '0');
  const isCompatible = user.capacity ? weight <= user.capacity : true;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* Informations principales */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{mission.merchandiseType}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Publiée le {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="status" status="En attente">
                Nouveau
              </Badge>
              {isZoneMatch && (
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400">
                  Dans votre zone
                </Badge>
              )}
            </div>
          </div>

          {/* Détails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)]">Trajet</p>
                <p className="font-medium text-[var(--text-primary)]">
                  {mission.departure} → {mission.destination}
                </p>
                {mission.departure === user.zone && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Départ de votre zone
                  </p>
                )}
                {mission.destination === user.zone && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Arrivée dans votre zone
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)]">Chargement</p>
                <p className="font-medium text-[var(--text-primary)]">{mission.weightVolume}</p>
                {!isCompatible && user.capacity && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    ⚠️ Capacité insuffisante ({user.capacity}T max)
                  </p>
                )}
                {isCompatible && user.capacity && weight > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ Compatible avec votre camion ({user.capacity}T)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Note si disponible */}
          {mission.note && (
            <div className="text-sm text-[var(--text-secondary)] italic border-l-2 border-blue-300 dark:border-blue-500/50 pl-3">
              "{mission.note}"
            </div>
          )}
        </div>

        {/* Date et action */}
        <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end gap-4 lg:gap-0 lg:border-l lg:border-[var(--border-color)] lg:pl-6">
          <div className="lg:mb-4">
            <p className="text-xs text-[var(--text-secondary)]">Date souhaitée</p>
            <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
              <Calendar className="w-4 h-4 lg:hidden" />
              {new Date(mission.desiredDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <Link href={`/dashboard/chauffeur/mission/${mission.id}`}>
            <Button 
              disabled={!isCompatible}
              className="w-full gap-2"
              title={!isCompatible ? `Votre camion ne peut transporter que ${user.capacity}T` : "Proposer un devis"}
            >
              Proposer un devis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}