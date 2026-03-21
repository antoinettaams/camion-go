'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle2, CreditCard, Plus, Bell, Building2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { useAppContext } from '@/app/context/AppContext';

interface DashboardOverviewProps {
  onNewRequest: () => void;
}

export function DashboardOverview({ onNewRequest }: DashboardOverviewProps) {
  const { user, missions, quotes } = useAppContext();

  const myMissions = missions.filter(m => m.entrepriseId === user?.id);
  const activeMissions = myMissions.filter(m => !['Livrée', 'Annulée'].includes(m.status));
  const completedMissions = myMissions.filter(m => m.status === 'Livrée');
  const missionsWithQuotes = myMissions.filter(m => m.status === 'Devis reçus');

  const totalSpent = completedMissions.reduce((acc, mission) => {
    const quote = quotes.find(q => q.id === mission.acceptedQuoteId);
    return acc + (quote?.price || 0);
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Carte de bienvenue */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-secondary)] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400 flex-shrink-0">
            {user?.companyName?.charAt(0) || user?.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              Bonjour, {user?.companyName || user?.name}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> 
                Espace Entreprise
              </span>
              <span className="hidden sm:inline text-[var(--text-secondary)]">•</span>
              <span className="flex items-center gap-1 text-xs sm:text-sm truncate text-[var(--text-secondary)]">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={onNewRequest} size="sm" className="w-full sm:w-auto gap-2 bg-blue-700 hover:bg-blue-800 text-white">
          <Plus className="w-4 h-4" />
          <span>Nouvelle demande</span>
        </Button>
      </div>

      {/* Notification nouveaux devis */}
      {missionsWithQuotes.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg sm:rounded-xl p-3 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-500/20 rounded-full text-blue-700 dark:text-blue-400 flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-300">Nouveaux devis !</p>
              <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 mt-0.5">
                {missionsWithQuotes.length} mission{missionsWithQuotes.length > 1 ? 's' : ''} en attente
              </p>
            </div>
          </div>
          <Link href="/dashboard/entreprise?tab=orders" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto bg-white dark:bg-transparent border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/20"
            >
              Voir les devis
            </Button>
          </Link>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<Package className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Actives"
          value={activeMissions.length}
          bgColor="bg-blue-50 dark:bg-blue-500/10"
          textColor="text-blue-700 dark:text-blue-400"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Devis"
          value={missionsWithQuotes.length}
          bgColor="bg-yellow-50 dark:bg-yellow-500/10"
          textColor="text-yellow-600 dark:text-yellow-400"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Terminées"
          value={completedMissions.length}
          bgColor="bg-emerald-50 dark:bg-emerald-500/10"
          textColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={<CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />}
          label="Dépenses"
          value={`${totalSpent.toLocaleString('fr-FR')} FCFA`}
          bgColor="bg-blue-50 dark:bg-blue-500/10"
          textColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Demandes récentes */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold">Demandes récentes</h2>
        {myMissions.length === 0 ? (
          <EmptyState
            icon={<Package className="w-6 h-6 sm:w-8 sm:h-8" />}
            title="Aucune demande"
            description="Créez votre première demande de transport."
            actionLabel="Créer une demande"
            onAction={onNewRequest}
          />
        ) : (
          <div className="space-y-3">
            {myMissions.slice(0, 3).map(mission => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Composants internes
function StatCard({ icon, label, value, bgColor, textColor }: any) {
  return (
    <div className="bg-[var(--bg-secondary)] p-3 sm:p-5 rounded-lg sm:rounded-xl border border-[var(--border-color)] shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
        <div className={`p-1.5 sm:p-2 ${bgColor} rounded-lg ${textColor}`}>
          {icon}
        </div>
        <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">{label}</p>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function EmptyState({ icon, title, description, actionLabel, onAction }: any) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--border-color)] shadow-sm p-8 sm:p-12 text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> {actionLabel}
        </Button>
      )}
    </div>
  );
}

function MissionCard({ mission }: any) {
  return (
    <Link href={`/dashboard/entreprise/mission/${mission.id}`}>
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-4 sm:p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{mission.merchandiseType}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{mission.departure} → {mission.destination}</p>
          </div>
          <Badge variant="status" status={mission.status}>{mission.status}</Badge>
        </div>
      </div>
    </Link>
  );
}