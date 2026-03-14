// src/app/contact/page.tsx
'use client';

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '../components/ui/Input';    
import { Button } from '../components/ui/Button';
export default function ContactPage() { 
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Aide et support</h1>
          <p className="mt-4 text-lg text-slate-600">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou assistance.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Contactez-nous</h2>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-5 w-5 text-blue-700" />
              <span>+229 90 00 00 00</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-5 w-5 text-blue-700" />
              <span>support@camiongo.bj</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="h-5 w-5 text-blue-700" />
              <span>Cotonou, Bénin</span>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
              <Input placeholder="Votre nom" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <Input type="email" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea 
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                placeholder="Comment pouvons-nous vous aider ?"
              ></textarea>
            </div>
            <Button type="submit" className="w-full">Envoyer le message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}