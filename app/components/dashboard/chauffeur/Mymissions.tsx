'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, MapPin, Clock, CheckCircle2, XCircle, 
  AlertCircle, Truck, Calendar, DollarSign, ArrowRight 
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { useAppContext } from '@/app/context/AppContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Mission, Quote } from '@/app/types';

export function MyMissions() {
  const { user } = useAppContext();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      if (!db || !user) return;

      try {
        // Charger les missions du chauffeur
        const missionsQuery = query(
          collection(db, 'missions'),
          where('driverId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        const missionsSnapshot = await getDocs(missionsQuery);
        const userMissions = missionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Mission[];
        setMissions(userMissions);

        // Charger les devis du chauffeur
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

  const filteredMissions = missions.filter(mission => {
    if (filter === 'active') return ['Confirmée', 'En cours'].includes(mission.status);
    if (filter === 'completed') return mission.status === 'Livrée';
    return true;
  });

  if (loading || !user) {
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
          En cours
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Terminées
        </Button>
      </div>

      {/* Liste des missions */}
      {filteredMissions.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-12 text-center">
          <Package className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Aucune mission</h3>
          <p className="text-[var(--text-secondary)]">
            Vous n'avez pas encore de missions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMissions.map(mission => (
            <MissionItem key={mission.id} mission={mission} quotes={quotes} />
          ))}
        </div>
      )}
    </div>
  );
}

interface MissionItemProps {
  mission: Mission;
  quotes: Quote[];
}

function MissionItem({ mission, quotes }: MissionItemProps) {
  const missionQuote = mission.acceptedQuoteId 
    ? quotes.find(q => q.id === mission.acceptedQuoteId)
    : null;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{mission.merchandiseType}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {mission.departure} → {mission.destination}
              </p>
            </div>
            <Badge className={getStatusColorClass(mission.status)}>
              {mission.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Chargement</p>
              <p className="font-medium text-[var(--text-primary)]">{mission.weightVolume}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Date souhaitée</p>
              <p className="font-medium text-[var(--text-primary)]">
                {new Date(mission.desiredDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            {missionQuote && (
              <div>
                <p className="text-xs text-[var(--text-secondary)]">Prix convenu</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {missionQuote.price.toLocaleString()} FCFA
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end lg:border-l lg:border-[var(--border-color)] lg:pl-6">
          <Link href={`/dashboard/chauffeur/mission/${mission.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              Détails
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function getStatusColorClass(status: string): string {
  switch (status) {
    case 'Confirmée': return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
    case 'En cours': return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400';
    case 'Livrée': return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400';
    case 'Annulée': return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400';
    default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  }
}