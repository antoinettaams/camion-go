'use client';

import React from 'react';
import Link from 'next/link';
import { History as HistoryIcon, Package, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/app/components/ui/Badge';
import { useAppContext } from '@/app/context/AppContext';

export function History() {
  const { user, missions, quotes } = useAppContext();
 
  const completedMissions = missions.filter( 
    m => m.entrepriseId === user?.id && m.status === 'Livrée'
  );

  if (completedMissions.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--border-color)] shadow-sm p-8 sm:p-12 text-center">
        <HistoryIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-secondary)] mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-bold mb-2">Aucun historique</h3>
        <p className="text-sm text-[var(--text-secondary)]">Vos missions terminées apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold">Historique des missions</h1>
        <Badge variant="outline" className="bg-[var(--bg-secondary)]">
          {completedMissions.length} terminée{completedMissions.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {completedMissions.map(mission => (
          <HistoryCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ mission }: any) {
  const { quotes } = useAppContext();
  const acceptedQuote = mission.acceptedQuoteId 
    ? quotes.find(q => q.id === mission.acceptedQuoteId) 
    : null;

  return (
    <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-4 sm:p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{mission.merchandiseType}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {mission.departure} → {mission.destination}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
                <Calendar className="w-3 h-3" />
                {new Date(mission.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center border-l border-[var(--border-color)] pl-6">
          {acceptedQuote && (
            <p className="text-lg font-bold">
              {acceptedQuote.price.toLocaleString('fr-FR')} FCFA
            </p>
          )}
          <Link href={`/dashboard/entreprise/mission/${mission.id}`}>
            <span className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Voir détails →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}