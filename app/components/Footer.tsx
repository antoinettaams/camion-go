// src/components/Footer.tsx
'use client';

import { Truck, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import Link from 'next/link';  // ← Changé: import de next/link

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-2xl text-white">CamionGo</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              La première plateforme de mise en relation entre expéditeurs et transporteurs au Bénin. Transportez tout, partout, rapidement.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Produits</h3>
            <ul className="space-y-4">
              <li><Link href="/sign-up?role=entreprise" className="hover:text-blue-400 transition-colors">Pour les expéditeurs</Link></li>  {/* ← href */}
              <li><Link href="/sign-up?role=chauffeur" className="hover:text-blue-400 transition-colors">Pour les transporteurs</Link></li>  {/* ← href */}
              <li><Link href="/#" className="hover:text-blue-400 transition-colors">CamionGo Entreprise</Link></li>  {/* ← href */}
              <li><Link href="/#" className="hover:text-blue-400 transition-colors">Tarification</Link></li>  {/* ← href */}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Ressources</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Centre d'aide</Link></li>  {/* ← href */}
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>  {/* ← href */}
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Guide d'utilisation</Link></li>  {/* ← href */}
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contactez-nous</Link></li>  {/* ← href */}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Légal</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Conditions générales</Link></li>  {/* ← href */}
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Politique de confidentialité</Link></li>  {/* ← href */}
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Mentions légales</Link></li>  {/* ← href */}
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Assurance & Sécurité</Link></li>  {/* ← href */}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CamionGo Technologies Inc. Tous droits réservés.
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>Bénin</span>
            <span>Français</span>
          </div>
        </div>
      </div>
    </footer>
  );
}