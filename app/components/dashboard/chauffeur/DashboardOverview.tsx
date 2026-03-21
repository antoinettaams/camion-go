'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, Clock, CheckCircle2, Wallet, Star, MapPin, 
  Truck, Bell, TrendingUp, Calendar, DollarSign, Search
} from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { useAppContext } from '@/app/context/AppContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Mission, Quote } from '@/app/types';

interface DashboardOverviewProps {
  onViewAvailable: () => void;
}

export function DashboardOverview({ onViewAvailable }: DashboardOverviewProps) {
  const { user } = useAppContext();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableMissions: 0,
    activeMissions: 0,
    pendingQuotes: 0,
    totalEarnings: 0,
    completedMissions: 0,
    rating: user?.rating || 0
  });

  useEffect(() => {
    const loadData = async () => {
      if (!db || !user) return;

      try {
        // Charger toutes les missions
        const missionsQuery = query(
          collection(db, 'missions'),
          orderBy('createdAt', 'desc')
        );
        const missionsSnapshot = await getDocs(missionsQuery);
        const allMissions = missionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Mission[];

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

        // Missions disponibles
        const available = allMissions.filter(m => 
          ['En attente', 'Devis reçus'].includes(m.status) &&
          !driverQuotes.some(q => q.missionId === m.id) &&
          (m.departure === user.zone || m.destination === user.zone)
        );

        // Missions actives du chauffeur
        const active = allMissions.filter(m => 
          m.driverId === user.id && 
          ['Confirmée', 'En cours'].includes(m.status)
        );

        // Missions terminées
        const completed = allMissions.filter(m => 
          m.driverId === user.id && m.status === 'Livrée'
        );

        // Devis en attente
        const pendingQuotes = driverQuotes.filter(q => {
          const mission = allMissions.find(m => m.id === q.missionId);
          return mission?.status === 'Devis reçus';
        });

        // Calculer les gains
        const earnings = completed.reduce((sum, mission) => {
          const quote = driverQuotes.find(q => q.id === mission.acceptedQuoteId);
          return sum + (quote?.price || 0);
        }, 0);

        setStats({
          availableMissions: available.length,
          activeMissions: active.length,
          pendingQuotes: pendingQuotes.length,
          totalEarnings: earnings,
          completedMissions: completed.length,
          rating: user.rating || 0
        });

        setMissions(available.slice(0, 3));
      } catch (error) {
        console.error("❌ Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Carte de bienvenue */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Bonjour, {user.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-[var(--text-secondary)]">
              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-700/50">
                {user.truckType}
              </Badge>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {user.zone}
              </span>
            </div>
          </div>
          <Button onClick={onViewAvailable} className="bg-blue-600 hover:bg-blue-700">
            Voir les missions
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Search className="w-5 h-5" />}
          label="Disponibles"
          value={stats.availableMissions}
          bgColor="bg-blue-50 dark:bg-blue-500/10"
          textColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={<Truck className="w-5 h-5" />}
          label="En cours"
          value={stats.activeMissions}
          bgColor="bg-green-50 dark:bg-green-500/10"
          textColor="text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Devis en attente"
          value={stats.pendingQuotes}
          bgColor="bg-yellow-50 dark:bg-yellow-500/10"
          textColor="text-yellow-600 dark:text-yellow-400"
        />
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="Gains totaux"
          value={`${stats.totalEarnings.toLocaleString()} FCFA`}
          bgColor="bg-purple-50 dark:bg-purple-500/10"
          textColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Missions disponibles récentes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Missions disponibles</h2>
          <Button variant="ghost" size="sm" onClick={onViewAvailable}>
            Voir tout
          </Button>
        </div>

        {missions.length === 0 ? (
          <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] p-8 text-center">
            <Package className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3" />
            <h3 className="font-semibold text-[var(--text-primary)]">Aucune mission disponible</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Revenez plus tard ou élargissez votre zone
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {missions.map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

function StatCard({ icon, label, value, bgColor, textColor }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4">
      <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center mb-3`}>
        <div className={textColor}>{icon}</div>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{value}</p>
    </div>
  );
}

interface MissionCardProps {
  mission: Mission;
}

function MissionCard({ mission }: MissionCardProps) {
  return (
    <Link href={`/dashboard/chauffeur/mission/${mission.id}`}>
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4 hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)]">{mission.merchandiseType}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {mission.departure} → {mission.destination}
            </p>
          </div>
          <Badge variant="status" status="En attente">Nouveau</Badge>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Package className="w-4 h-4" />
            {mission.weightVolume}
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4" />
            {new Date(mission.desiredDate).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
    </Link>
  );
}