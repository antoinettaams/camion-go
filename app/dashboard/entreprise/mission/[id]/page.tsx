// app/dashboard/entreprise/mission/[id]/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Package, Star, Phone, CheckCircle2, ArrowUpDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { useAppContext } from '@/app/context/AppContext';

type SortOption = 'price_asc' | 'price_desc' | 'time_asc' | 'time_desc';

const parseEstimatedTime = (timeStr: string): number => {
  const match = timeStr.match(/(\d+)\s*(heure|jour|semaine|minute|h|j)/i);
  if (!match) return 999999; 
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('minute')) return value / 60;
  if (unit.startsWith('heure') || unit === 'h') return value;
  if (unit.startsWith('jour') || unit === 'j') return value * 24;
  if (unit.startsWith('semaine')) return value * 24 * 7;
  return value;
};

export default function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { missions, quotes, users, acceptQuote, addRating, ratings } = useAppContext();
  
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');

  // Déballer params avec React.use()
  const { id: missionId } = React.use(params);
  
  const mission = missions.find(m => m.id === missionId);
  
  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <Package className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Mission introuvable</h2>
          <p className="text-[var(--text-secondary)] mb-4">ID: {missionId}</p>
          <Button variant="outline" onClick={() => router.back()}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const missionQuotes = quotes.filter(q => q.missionId === mission.id);
  const acceptedQuote = quotes.find(q => q.id === mission.acceptedQuoteId);
  const assignedDriver = users.find(u => u.id === mission.driverId);
  const existingRating = ratings.find(r => r.missionId === mission.id);

  const sortedQuotes = useMemo(() => {
    return [...missionQuotes].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'time_asc':
          return parseEstimatedTime(a.estimatedTime) - parseEstimatedTime(b.estimatedTime);
        case 'time_desc':
          return parseEstimatedTime(b.estimatedTime) - parseEstimatedTime(a.estimatedTime);
        default:
          return 0;
      }
    });
  }, [missionQuotes, sortBy]);

  const handleAcceptQuote = (quoteId: string) => {
    if (confirm("Êtes-vous sûr de vouloir accepter ce devis ?")) {
      acceptQuote(mission.id, quoteId);
    }
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedDriver) return;
    
    addRating({
      missionId: mission.id,
      fromUserId: mission.entrepriseId,
      toUserId: assignedDriver.id,
      stars: ratingStars,
      comment: ratingComment
    });
    
    setRatingStars(5);
    setRatingComment('');
  };

  const handleGoBack = () => {
    router.back();
  };

  // Fonction pour formater l'affichage du poids/volume
  const getWeightVolumeDisplay = () => {
    if (!mission.weightVolume) return "Non spécifié";
    const trimmed = mission.weightVolume.trim();
    if (trimmed === "" || trimmed === "tonnes") return "Non spécifié";
    return trimmed;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <Button variant="ghost" className="mb-6 -ml-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={handleGoBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Mission Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte de la mission */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{mission.merchandiseType || "Type non spécifié"}</h1>
                </div>
                <Badge variant="status" status={mission.status} className="text-sm px-3 py-1">
                  {mission.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Trajet</p>
                    <p className="font-semibold">{mission.departure || "?"} → {mission.destination || "?"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Date souhaitée</p>
                    <p className="font-semibold">
                      {mission.desiredDate ? new Date(mission.desiredDate).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : "Non spécifiée"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Poids / Volume</p>
                    <p className="font-semibold">{getWeightVolumeDisplay()}</p>
                  </div>
                </div>
              </div>

              {mission.note && (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Note pour le chauffeur :</p>
                  <p className="text-sm text-[var(--text-secondary)]">{mission.note}</p>
                </div>
              )}
            </div>

            {/* Quotes Section (if not accepted yet) */}
            {['En attente', 'Devis reçus'].includes(mission.status) && (
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                  <h2 className="text-lg font-bold">Devis reçus ({missionQuotes.length})</h2>
                  {missionQuotes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="w-4 h-4 text-[var(--text-secondary)]" />
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="text-sm border border-[var(--border-color)] rounded-md py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      >
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="time_asc">Délai le plus court</option>
                        <option value="time_desc">Délai le plus long</option>
                      </select>
                    </div>
                  )}
                </div>
                
                {missionQuotes.length === 0 ? (
                  <p className="text-[var(--text-secondary)] text-center py-8">Aucun devis reçu pour le moment.</p>
                ) : (
                  <div className="space-y-4">
                    {sortedQuotes.map(quote => {
                      const driver = users.find(u => u.id === quote.driverId);
                      return (
                        <div key={quote.id} className="border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md bg-[var(--bg-secondary)]">
                          <div className="p-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex items-start gap-4 w-full sm:w-auto">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-slate-400 dark:text-slate-400 shrink-0">
                                  {driver?.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <p className="font-bold text-lg">{driver?.name || 'Chauffeur'}</p>
                                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
                                    <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-medium">{driver?.truckType}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-medium"><Star className="w-4 h-4 fill-blue-500 text-blue-500" /> {driver?.rating || 'Nouveau'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:items-end w-full sm:w-auto bg-slate-50 dark:bg-slate-700/50 sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-[var(--border-color)]">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quote.price.toLocaleString('fr-FR')} FCFA</div>
                                <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">Délai estimé: <span className="text-[var(--text-primary)]">{quote.estimatedTime}</span></p>
                              </div>
                            </div>
                            
                            {quote.message && (
                              <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Message du chauffeur</p>
                                <p className="text-sm text-[var(--text-primary)] italic bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-[var(--border-color)]">"{quote.message}"</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-700/30 px-5 py-3 border-t border-[var(--border-color)] flex justify-between items-center">
                            <p className="text-xs text-[var(--text-secondary)]">
                              Reçu le {new Date(quote.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <Button size="sm" onClick={() => handleAcceptQuote(quote.id)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                              Accepter ce devis
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Rating Section (if delivered) */}
            {mission.status === 'Livrée' && !existingRating && (
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Évaluer la prestation</h2>
                <form onSubmit={handleSubmitRating} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Note (sur 5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingStars(star)}
                          className={`p-1 ${star <= ratingStars ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'}`}
                        >
                          <Star className={`w-8 h-8 ${star <= ratingStars ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Commentaire</label>
                    <textarea 
                      required
                      className="flex w-full rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 min-h-[80px]"
                      placeholder="Comment s'est passée la livraison ?"
                      value={ratingComment}
                      onChange={e => setRatingComment(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Envoyer l'évaluation</Button>
                </form>
              </div>
            )}

            {existingRating && (
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-bold">Évaluation envoyée</h2>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= existingRating.stars ? 'fill-blue-500 text-blue-500' : 'text-slate-300 dark:text-slate-600'}`} />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] italic">"{existingRating.comment}"</p>
              </div>
            )}
          </div>

          {/* Right Column: Driver Info & Payment (if accepted) */}
          {assignedDriver && acceptedQuote && (
            <div className="space-y-6">
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Chauffeur assigné</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {assignedDriver.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{assignedDriver.name}</p>
                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                      <Star className="w-4 h-4 fill-blue-500 text-blue-500" /> {assignedDriver.rating || 'Nouveau'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)]">Véhicule</span>
                    <span className="font-medium">{assignedDriver.truckType} ({assignedDriver.capacity}T)</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)]">Contact</span>
                    <span className="font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {assignedDriver.phone}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <a href={`tel:${assignedDriver.phone}`} className="block">
                    <Button className="w-full flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Appeler le chauffeur
                    </Button>
                  </a>
                </div>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Détails de la prestation</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)]">Montant convenu</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{acceptedQuote.price.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)]">Délai estimé</span>
                    <span className="font-medium">{acceptedQuote.estimatedTime}</span>
                  </div>
                </div>

                {acceptedQuote.message && (
                  <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-lg border border-blue-100 dark:border-blue-500/20 mb-6">
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-400 uppercase tracking-wider mb-2">Message du chauffeur</p>
                    <p className="text-sm text-blue-900 dark:text-blue-300 italic">"{acceptedQuote.message}"</p>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-[var(--border-color)]">
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Modes de paiement acceptés à la livraison</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-[var(--bg-secondary)]">MTN Mobile Money</Badge>
                    <Badge variant="outline" className="bg-[var(--bg-secondary)]">Moov Money</Badge>
                    <Badge variant="outline" className="bg-[var(--bg-secondary)]">Espèces</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}