// src/components/Landing.tsx
'use client';

import { ArrowRight, ShieldCheck, MapPin, Package, Clock, Star, Navigation, CheckCircle2, Truck, BarChart3, Shield, Zap, TrendingDown, TrendingUp, Calendar, Wallet, Building2, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export function Landing() {
  return ( 
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section - Uber Style */}
      <section className="relative bg-slate-950 dark:bg-slate-900 text-white overflow-hidden min-h-[600px] sm:min-h-[650px] md:min-h-[700px] lg:min-h-[800px] flex items-center">
        {/* Fond avec motif */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] xs:bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]"></div>
        </div>
        
        {/* Overlay gradient pour meilleure lisibilité sur mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/50 lg:hidden"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center py-8 sm:py-10 md:py-12 lg:py-0">
            
            {/* Colonne gauche - Contenu texte */}
            <div className="text-center sm:text-left space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
              
              {/* Badge "Nouveau" pour attirer l'attention sur mobile */}
              <div className="inline-flex mx-auto sm:mx-0 bg-blue-600/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/30">
                <span className="text-xs sm:text-sm font-medium text-blue-300">
                  🚀 Plateforme #1 au Bénin
                </span>
              </div>
              
              {/* Titre principal */}
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                <span className="block">Transportez tout,</span>
                <span className="block text-blue-400">partout, rapidement</span>
                <span className="block text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl text-slate-300 mt-2 sm:mt-3 font-normal">
                  et en toute sécurité avec CamionGo.
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-300 max-w-lg mx-auto sm:mx-0 leading-relaxed">
                La plateforme numéro 1 au Bénin qui connecte instantanément expéditeurs et transporteurs professionnels.
              </p>
              
              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto sm:mx-0 pt-2 sm:pt-4">
                <Link href="/sign-up?role=entreprise" className="w-full sm:w-1/2">
                  <Button 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                      text-sm xs:text-base sm:text-base md:text-lg 
                      h-11 xs:h-12 sm:h-12 md:h-14 
                      px-4 xs:px-4 sm:px-5 md:px-6 lg:px-8 
                      rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300
                      border-2 border-blue-500/50 hover:border-blue-400"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>🚚</span>
                      Réserver un transport
                    </span>
                  </Button>
                </Link>
                
                <Link href="/sign-up?role=chauffeur" className="w-full sm:w-1/2">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full bg-transparent border-2 border-slate-600 
                      hover:bg-slate-800 hover:text-white hover:border-blue-500 
                      text-white font-semibold text-sm xs:text-base sm:text-base md:text-lg 
                      h-11 xs:h-12 sm:h-12 md:h-14 
                      px-5 xs:px-4 sm:px-5 md:px-6 lg:px-8 
                      rounded-xl backdrop-blur-sm hover:scale-105 transition-all duration-300
                      shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>👤</span>
                      Devenir conducteur
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Colonne droite - Illustration de la carte (reste identique) */}
            <div className="relative w-full aspect-square max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg mx-auto lg:ml-auto 
              bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 shadow-2xl 
              mt-4 sm:mt-6 md:mt-8 lg:mt-0
              transform hover:scale-105 transition-transform duration-500">
              
              {/* Style pour les animations */}
              <style>{`
                @keyframes moveRight { 0% { left: -10%; transform: translateX(-50%) translateY(-50%); } 100% { left: 110%; transform: translateX(-50%) translateY(-50%); } }
                @keyframes moveLeft { 0% { left: 110%; transform: translateX(-50%) translateY(-50%) rotate(180deg); } 100% { left: -10%; transform: translateX(-50%) translateY(-50%) rotate(180deg); } }
                @keyframes moveDown { 0% { top: -10%; transform: translateX(-50%) translateY(-50%) rotate(90deg); } 100% { top: 110%; transform: translateX(-50%) translateY(-50%) rotate(90deg); } }
                @keyframes moveUp { 0% { top: 110%; transform: translateX(-50%) translateY(-50%) rotate(-90deg); } 100% { top: -10%; transform: translateX(-50%) translateY(-50%) rotate(-90deg); } }
                @keyframes dashAnim { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                }
              `}</style>

              {/* Grille de routes abstraite */}
              <svg className="absolute inset-0 w-full h-full text-slate-800/80" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M20,0 L20,100 M50,0 L50,100 M80,0 L80,100" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M0,20 L100,20 M0,50 L100,50 M0,80 L100,80" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Ligne de route active */}
              <svg className="absolute inset-0 w-full h-full text-blue-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M20,80 L50,80 L50,50 L80,50" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" style={{ animation: 'dashAnim 3s linear infinite' }} />
              </svg>

              {/* Camions en mouvement */}
              <div className="absolute top-[20%] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveRight 12s linear infinite' }}>
                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="absolute top-[80%] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveLeft 15s linear infinite 2s' }}>
                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="absolute left-[20%] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveDown 18s linear infinite 5s' }}>
                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className="absolute left-[80%] w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveUp 14s linear infinite 1s' }}>
                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>

              {/* Nœuds / Villes */}
              <div className="absolute top-[20%] left-[20%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[20%] left-[50%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[20%] left-[80%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[50%] left-[20%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[80%] left-[80%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Nœuds principaux */}
              <div className="absolute top-[80%] left-[20%] w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 ring-4 ring-blue-500/30 flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
              </div>
              <div className="absolute top-[50%] left-[50%] w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 ring-4 ring-blue-500/20 z-10"></div>
              
              {/* Camion principal mis en évidence */}
              <div className="absolute top-[50%] left-[80%] w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-600 rounded-xl md:rounded-2xl -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.5)] z-20 border-2 border-blue-400" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-blue-400 animate-ping opacity-60"></div>
              </div>

              {/* Carte de statut flottante */}
              <div className="absolute bottom-1 left-1 right-1 sm:bottom-2 sm:left-3 sm:right-3 md:bottom-3 md:left-4 md:right-4 lg:bottom-4 lg:left-6 lg:right-6 bg-slate-950/90 backdrop-blur-md p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-slate-800 flex items-center justify-between z-30 shadow-2xl">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 shrink-0 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400">
                    <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] xs:text-xs sm:text-xs md:text-sm font-bold text-white leading-tight truncate">Mise en relation en cours...</p>
                    <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-slate-400 leading-tight mt-0.5 truncate">Recherche du meilleur chauffeur à proximité</p>
                  </div>
                </div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 shrink-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir CamionGo ? */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">Pourquoi choisir CamionGo ?</h2>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] px-4 sm:px-0">Une plateforme gagnant-gagnant conçue pour optimiser la logistique des entreprises et maximiser les revenus des transporteurs.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Pour les PME */}
            <div className="bg-slate-50 dark:bg-slate-800 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 border-b border-slate-200 dark:border-slate-700 pb-4 sm:pb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Pour les PME & Expéditeurs</h3>
              </div>
              
              <div className="space-y-6 sm:space-y-8 flex-grow">
                {[
                  { icon: TrendingDown, title: 'Réduction des coûts logistiques', desc: 'Économisez jusqu\'à 30% sur vos frais de transport grâce à notre système d\'enchères inversées et la mise en concurrence transparente des transporteurs.' },
                  { icon: Clock, title: 'Efficacité et Gain de temps', desc: 'Fini les appels téléphoniques interminables pour trouver un camion. Publiez votre besoin en 2 minutes et recevez des devis instantanément.' },
                  { icon: ShieldCheck, title: 'Suivi et Sécurité garantis', desc: 'Suivez l\'acheminement de vos marchandises en temps réel. Tous nos chauffeurs sont vérifiés et chaque trajet est couvert par notre assurance partenaire.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 sm:gap-5">
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">{item.title}</h4>
                      <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-700">
                <Link href="/sign-up?role=entreprise" className="inline-block w-full sm:w-auto">
                  <Button className="w-full gap-2 bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base rounded-xl">
                    Créer un compte entreprise <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pour les Chauffeurs */}
            <div className="bg-slate-900 dark:bg-slate-950 p-6 sm:p-8 lg:p-10 rounded-3xl border border-slate-800 text-white flex flex-col">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 border-b border-slate-800 pb-4 sm:pb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
                  <UserCircle className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Pour les Chauffeurs</h3>
              </div>
              
              <div className="space-y-6 sm:space-y-8 flex-grow">
                {[
                  { icon: TrendingUp, title: 'Revenus maximisés', desc: 'Fini les retours à vide coûteux. Rentabilisez chaque kilomètre parcouru en trouvant facilement des chargements sur votre trajet de retour.' },
                  { icon: Calendar, title: 'Flexibilité totale', desc: 'Soyez votre propre patron. Choisissez uniquement les missions qui vous intéressent, proposez vos propres tarifs et travaillez selon vos horaires.' },
                  { icon: Wallet, title: 'Paiements rapides et garantis', desc: 'Ne courez plus après vos factures impayées. Notre système sécurise les fonds à l\'avance et garantit un paiement rapide dès la confirmation de livraison.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 sm:gap-5">
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 flex items-center justify-center">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{item.title}</h4>
                      <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-slate-800">
                <Link href="/sign-up?role=chauffeur" className="inline-block w-full sm:w-auto">
                  <Button className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700 h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base rounded-xl">
                    Devenir chauffeur <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche ? */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[var(--text-primary)] mb-10 sm:mb-12 lg:mb-16">Comment ça marche ?</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-blue-200 dark:bg-blue-500/30 z-0"></div>
            
            {[
              { icon: Package, title: '1. Demandez', desc: 'Indiquez ce que vous souhaitez transporter, d\'où et vers où.' },
              { icon: BarChart3, title: '2. Comparez', desc: 'Recevez des offres de chauffeurs qualifiés et choisissez la meilleure.' },
              { icon: Truck, title: '3. Expédiez', desc: 'Le chauffeur récupère et livre votre marchandise en toute sécurité.' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center px-4">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-100 dark:border-blue-500/20 flex items-center justify-center mb-4 sm:mb-6 shadow-sm ${idx === 2 ? 'bg-blue-700' : 'bg-white dark:bg-slate-800'}`}>
                  <item.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${idx === 2 ? 'text-white' : 'text-blue-700 dark:text-blue-400'}`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-base sm:text-lg text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types de véhicules disponibles */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2 sm:mb-4">Types de véhicules disponibles</h2>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8 sm:mb-10 lg:mb-12 max-w-2xl">Une flotte diversifiée pour répondre à tous vos besoins logistiques, du petit colis au chargement exceptionnel.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: 'Camionnette', desc: 'Jusqu\'à 3.5 tonnes. Idéal pour les livraisons urbaines rapides.', icon: Truck },
              { title: 'Camion bâché', desc: 'Protection contre les intempéries pour marchandises générales.', icon: Truck },
              { title: 'Camion frigorifique', desc: 'Transport sous température dirigée pour denrées périssables.', icon: Truck },
              { title: 'Semi-remorque', desc: 'Pour les très gros volumes et le transport industriel lourd.', icon: Truck },
            ].map((vehicle, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-5 sm:p-6 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 transition-colors">
                <vehicle.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-700 dark:text-blue-400 mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1 sm:mb-2">{vehicle.title}</h3>
                <p className="text-sm sm:text-base text-[var(--text-secondary)]">{vehicle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité & Assurance */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-blue-500 mx-auto mb-6 sm:mb-8" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Sécurité & Assurance : Notre priorité absolue</h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12 px-4">
            Nous mettons tout en œuvre pour que vos expéditions se déroulent sans le moindre accroc. La confiance est le moteur de CamionGo.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-left">
            {[
              { title: 'Vérification stricte', desc: 'Identité, permis de conduire, et documents du véhicule contrôlés pour chaque chauffeur inscrit.' },
              { title: 'Assistance 24/7', desc: 'Une équipe de support dédiée disponible à tout moment pour résoudre le moindre problème durant le transport.' },
              { title: 'Évaluations transparentes', desc: 'Un système de notation mutuelle qui garantit le maintien des plus hauts standards de qualité.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-800 dark:bg-slate-800/80 p-5 sm:p-6 lg:p-8 rounded-2xl">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">Ils font confiance à CamionGo</h2>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] px-4">Découvrez comment notre plateforme transforme le quotidien des entreprises et des transporteurs à travers tout le Bénin.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {/* Témoignages - les couleurs restent adaptables */}
            {[
              { name: 'BTP Matériaux', role: 'Expéditeur régulier', content: '"Avant CamionGo, trouver un camion pour livrer nos matériaux à Parakou prenait des jours. Aujourd\'hui, en 30 minutes j\'ai 3 devis. C\'est une révolution pour notre entreprise."', initial: 'BM' },
              { name: 'Jean-Pierre D.', role: 'Chauffeur indépendant', content: '"Grâce à l\'application, je ne rentre presque plus jamais à vide après une livraison. Mon chiffre d\'affaires a augmenté de 40% en seulement quelques mois d\'utilisation."', initial: 'JP' },
              { name: 'Coopérative Agricole', role: 'Producteur local', content: '"Pour l\'expédition de nos récoltes d\'ananas vers Cotonou, la ponctualité est vitale. Les chauffeurs CamionGo sont toujours à l\'heure et très professionnels."', initial: 'CA' }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex gap-1 mb-4 sm:mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600 text-blue-600" />)}
                </div>
                <p className="text-base sm:text-lg text-[var(--text-primary)] italic mb-6 sm:mb-8 flex-grow">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 shrink-0">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text-primary)] text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section pour recueillir des avis */}
          <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between border border-blue-100 dark:border-blue-500/20 gap-4 sm:gap-6">
            <div className="mb-4 md:mb-0 md:mr-8 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">Vous utilisez déjà CamionGo ?</h3>
              <p className="text-base sm:text-lg text-[var(--text-secondary)]">Partagez votre expérience avec la communauté et aidez-nous à améliorer nos services.</p>
            </div>
            <Button size="lg" variant="outline" className="shrink-0 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-semibold text-sm sm:text-base px-6 sm:px-8">
              Laisser un avis
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-blue-700 dark:bg-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Prêt à transformer votre logistique ?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 lg:mb-10 px-4">Rejoignez des milliers d'entreprises et de chauffeurs qui font confiance à CamionGo chaque jour.</p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 font-bold text-base sm:text-lg h-12 sm:h-14 px-8 sm:px-10 rounded-full shadow-xl">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}