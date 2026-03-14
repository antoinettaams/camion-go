// src/pages/Landing.tsx
'use client';

import { ArrowRight, ShieldCheck, MapPin, Package, Clock, Star, Navigation, CheckCircle2, Truck, BarChart3, Shield, Zap, TrendingDown, TrendingUp, Calendar, Wallet, Building2, UserCircle } from 'lucide-react';
import Link from 'next/link';  // ← Changé: import de next/link au lieu de react-router-dom
import { Button } from '../components/ui/Button';

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Uber Style */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Transportez tout, partout, rapidement et en toute sécurité avec CamionGo.
              </h1>
              <p className="text-xl text-slate-300 mb-10 max-w-lg">
                La plateforme numéro 1 au Bénin qui connecte instantanément expéditeurs et transporteurs professionnels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up?role=entreprise" className="w-full sm:w-auto">  {/* ← href au lieu de to */}
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg h-14 px-8 rounded-lg">
                    Réserver un transport
                  </Button>
                </Link>
                <Link href="/sign-up?role=chauffeur" className="w-full sm:w-auto">  {/* ← href au lieu de to */}
                  <Button size="lg" variant="outline" className="w-full bg-transparent border-2 border-slate-700 text-white hover:bg-slate-800 hover:text-white hover:border-slate-600 font-semibold text-lg h-14 px-8 rounded-lg">
                    Devenir conducteur CamionGo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Interactive Map Illustration */}
            <div className="relative w-full aspect-square max-w-lg mx-auto lg:ml-auto bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mt-12 lg:mt-0">
              <style>{`
                @keyframes moveRight { 0% { left: -10%; transform: translateX(-50%) translateY(-50%); } 100% { left: 110%; transform: translateX(-50%) translateY(-50%); } }
                @keyframes moveLeft { 0% { left: 110%; transform: translateX(-50%) translateY(-50%) rotate(180deg); } 100% { left: -10%; transform: translateX(-50%) translateY(-50%) rotate(180deg); } }
                @keyframes moveDown { 0% { top: -10%; transform: translateX(-50%) translateY(-50%) rotate(90deg); } 100% { top: 110%; transform: translateX(-50%) translateY(-50%) rotate(90deg); } }
                @keyframes moveUp { 0% { top: 110%; transform: translateX(-50%) translateY(-50%) rotate(-90deg); } 100% { top: -10%; transform: translateX(-50%) translateY(-50%) rotate(-90deg); } }
                @keyframes dashAnim { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
              `}</style>

              {/* Abstract roads grid */}
              <svg className="absolute inset-0 w-full h-full text-slate-800/80" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M20,0 L20,100 M50,0 L50,100 M80,0 L80,100" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M0,20 L100,20 M0,50 L100,50 M0,80 L100,80" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Active Route line */}
              <svg className="absolute inset-0 w-full h-full text-blue-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M20,80 L50,80 L50,50 L80,50" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 6" style={{ animation: 'dashAnim 3s linear infinite' }} />
              </svg>

              {/* Background Moving Trucks */}
              <div className="absolute top-[20%] w-8 h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveRight 12s linear infinite' }}>
                <Truck className="w-4 h-4" />
              </div>
              <div className="absolute top-[80%] w-8 h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveLeft 15s linear infinite 2s' }}>
                <Truck className="w-4 h-4" />
              </div>
              <div className="absolute left-[20%] w-8 h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveDown 18s linear infinite 5s' }}>
                <Truck className="w-4 h-4" />
              </div>
              <div className="absolute left-[80%] w-8 h-8 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-400 shadow-lg z-0" style={{ animation: 'moveUp 14s linear infinite 1s' }}>
                <Truck className="w-4 h-4" />
              </div>

              {/* Nodes / Cities */}
              <div className="absolute top-[20%] left-[20%] w-3 h-3 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[20%] left-[50%] w-3 h-3 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[20%] left-[80%] w-3 h-3 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[50%] left-[20%] w-3 h-3 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-[80%] left-[80%] w-3 h-3 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Main Route Nodes */}
              <div className="absolute top-[80%] left-[20%] w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 ring-4 ring-blue-500/30 flex items-center justify-center z-10">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
              </div>
              <div className="absolute top-[50%] left-[50%] w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 ring-4 ring-blue-500/20 z-10"></div>
              
              {/* Main Highlighted Truck */}
              <div className="absolute top-[50%] left-[80%] w-14 h-14 bg-blue-600 rounded-2xl -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.5)] z-20 border-2 border-blue-400">
                <Truck className="w-7 h-7" />
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-60"></div>
              </div>

              {/* Floating Status Card */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-6 sm:right-6 bg-slate-950/90 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-slate-800 flex items-center justify-between z-30 shadow-2xl">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-400">
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] sm:text-sm font-bold text-white leading-tight">Mise en relation en cours...</p>
                    <p className="text-[9px] sm:text-xs text-slate-400 leading-tight mt-0.5">Recherche du meilleur chauffeur à proximité</p>
                  </div>
                </div>
                <div className="w-4 h-4 sm:w-6 sm:h-6 shrink-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir CamionGo ? */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Pourquoi choisir CamionGo ?</h2>
            <p className="text-xl text-slate-600">Une plateforme gagnant-gagnant conçue pour optimiser la logistique des entreprises et maximiser les revenus des transporteurs.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Pour les PME */}
            <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-100 flex flex-col">
              <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Pour les PME & Expéditeurs</h3>
              </div>
              
              <div className="space-y-8 flex-grow">
                <div className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Réduction des coûts logistiques</h4>
                    <p className="text-slate-600 leading-relaxed">Économisez jusqu'à 30% sur vos frais de transport grâce à notre système d'enchères inversées et la mise en concurrence transparente des transporteurs.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Efficacité et Gain de temps</h4>
                    <p className="text-slate-600 leading-relaxed">Fini les appels téléphoniques interminables pour trouver un camion. Publiez votre besoin en 2 minutes et recevez des devis instantanément.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Suivi et Sécurité garantis</h4>
                    <p className="text-slate-600 leading-relaxed">Suivez l'acheminement de vos marchandises en temps réel. Tous nos chauffeurs sont vérifiés et chaque trajet est couvert par notre assurance partenaire.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200">
                <Link href="/register?role=entreprise" className="inline-block w-full sm:w-auto">  {/* ← href */}
                  <Button className="w-full gap-2 bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 text-base rounded-xl">
                    Créer un compte entreprise <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pour les Chauffeurs */}
            <div className="bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-800 text-white flex flex-col">
              <div className="flex items-center gap-4 mb-10 border-b border-slate-800 pb-6">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
                  <UserCircle className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-white">Pour les Chauffeurs</h3>
              </div>
              
              <div className="space-y-8 flex-grow">
                <div className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Revenus maximisés</h4>
                    <p className="text-slate-400 leading-relaxed">Fini les retours à vide coûteux. Rentabilisez chaque kilomètre parcouru en trouvant facilement des chargements sur votre trajet de retour.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Flexibilité totale</h4>
                    <p className="text-slate-400 leading-relaxed">Soyez votre propre patron. Choisissez uniquement les missions qui vous intéressent, proposez vos propres tarifs et travaillez selon vos horaires.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Paiements rapides et garantis</h4>
                    <p className="text-slate-400 leading-relaxed">Ne courez plus après vos factures impayées. Notre système sécurise les fonds à l'avance et garantit un paiement rapide dès la confirmation de livraison.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800">
                <Link href="/register?role=chauffeur" className="inline-block w-full sm:w-auto">  {/* ← href */}
                  <Button className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base rounded-xl">
                    Devenir chauffeur <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche ? */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">Comment ça marche ?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-blue-200 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-100 flex items-center justify-center mb-6 shadow-sm">
                <Package className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Demandez</h3>
              <p className="text-slate-600 text-lg">Indiquez ce que vous souhaitez transporter, d'où et vers où.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-blue-100 flex items-center justify-center mb-6 shadow-sm">
                <BarChart3 className="w-10 h-10 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">2. Comparez</h3>
              <p className="text-slate-600 text-lg">Recevez des offres de chauffeurs qualifiés et choisissez la meilleure.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-8 md:mt-0">
              <div className="w-24 h-24 bg-blue-700 rounded-full border-4 border-blue-100 flex items-center justify-center mb-6 shadow-md">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Expédiez</h3>
              <p className="text-slate-600 text-lg">Le chauffeur récupère et livre votre marchandise en toute sécurité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types de véhicules disponibles */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Types de véhicules disponibles</h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl">Une flotte diversifiée pour répondre à tous vos besoins logistiques, du petit colis au chargement exceptionnel.</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Camionnette', desc: 'Jusqu\'à 3.5 tonnes. Idéal pour les livraisons urbaines rapides.', icon: Truck },
              { title: 'Camion bâché', desc: 'Protection contre les intempéries pour marchandises générales.', icon: Truck },
              { title: 'Camion frigorifique', desc: 'Transport sous température dirigée pour denrées périssables.', icon: Truck },
              { title: 'Semi-remorque', desc: 'Pour les très gros volumes et le transport industriel lourd.', icon: Truck },
            ].map((vehicle, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <vehicle.icon className="w-10 h-10 text-blue-700 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{vehicle.title}</h3>
                <p className="text-slate-600">{vehicle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité & Assurance */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-8" />
          <h2 className="text-4xl font-bold mb-6">Sécurité & Assurance : Notre priorité absolue</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
            Nous mettons tout en œuvre pour que vos expéditions se déroulent sans le moindre accroc. La confiance est le moteur de CamionGo.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-3 text-white">Vérification stricte</h3>
              <p className="text-slate-400">Identité, permis de conduire, et documents du véhicule contrôlés pour chaque chauffeur inscrit.</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-3 text-white">Assistance 24/7</h3>
              <p className="text-slate-400">Une équipe de support dédiée disponible à tout moment pour résoudre le moindre problème durant le transport.</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl">
              <h3 className="text-xl font-bold mb-3 text-white">Évaluations transparentes</h3>
              <p className="text-slate-400">Un système de notation mutuelle qui garantit le maintien des plus hauts standards de qualité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Ils font confiance à CamionGo</h2>
            <p className="text-xl text-slate-600">Découvrez comment notre plateforme transforme le quotidien des entreprises et des transporteurs à travers tout le Bénin.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Témoignage 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-blue-600 text-blue-600" />)}
              </div>
              <p className="text-lg text-slate-700 italic mb-8 flex-grow">
                "Avant CamionGo, trouver un camion pour livrer nos matériaux à Parakou prenait des jours. Aujourd'hui, en 30 minutes j'ai 3 devis. C'est une révolution pour notre entreprise."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 shrink-0">BM</div>
                <div>
                  <p className="font-bold text-slate-900">BTP Matériaux</p>
                  <p className="text-sm text-slate-500">Expéditeur régulier</p>
                </div>
              </div>
            </div>
            
            {/* Témoignage 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-blue-600 text-blue-600" />)}
              </div>
              <p className="text-lg text-slate-700 italic mb-8 flex-grow">
                "Grâce à l'application, je ne rentre presque plus jamais à vide après une livraison. Mon chiffre d'affaires a augmenté de 40% en seulement quelques mois d'utilisation."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 shrink-0">JP</div>
                <div>
                  <p className="font-bold text-slate-900">Jean-Pierre D.</p>
                  <p className="text-sm text-slate-500">Chauffeur indépendant</p>
                </div>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-blue-600 text-blue-600" />)}
              </div>
              <p className="text-lg text-slate-700 italic mb-8 flex-grow">
                "Pour l'expédition de nos récoltes d'ananas vers Cotonou, la ponctualité est vitale. Les chauffeurs CamionGo sont toujours à l'heure et très professionnels."
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 shrink-0">CA</div>
                <div>
                  <p className="font-bold text-slate-900">Coopérative Agricole</p>
                  <p className="text-sm text-slate-500">Producteur local</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section pour recueillir des avis */}
          <div className="bg-blue-50 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between border border-blue-100">
            <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Vous utilisez déjà CamionGo ?</h3>
              <p className="text-slate-600 text-lg">Partagez votre expérience avec la communauté et aidez-nous à améliorer nos services.</p>
            </div>
            <Button size="lg" variant="outline" className="shrink-0 bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors font-semibold">
              Laisser un avis
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-blue-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Prêt à transformer votre logistique ?</h2>
          <p className="text-xl text-blue-100 mb-10">Rejoignez des milliers d'entreprises et de chauffeurs qui font confiance à CamionGo chaque jour.</p>
          <Link href="/register">  {/* ← href */}
            <Button size="lg" className="bg-white text-blue-700 hover:bg-slate-100 font-bold text-lg h-14 px-10 rounded-full shadow-xl">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}