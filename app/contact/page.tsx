// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/Input';    
import { Button } from '../components/ui/Button';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Remplacez par votre endpoint Formspree
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgaegyr';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          _subject: `Nouveau message de ${formState.name} via le formulaire de contact`,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormState({ name: '', email: '', message: '' });
        
        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Une erreur est survenue lors de l\'envoi');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erreur lors de l\'envoi du message');
      
      // Réinitialiser le message d'erreur après 5 secondes
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-primary)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Aide et support</h1>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou assistance.
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-sm border border-[var(--border-color)] grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Contactez-nous</h2>
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>+229 93 36 19 42</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>antoinettaams@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Cotonou, Bénin</span>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Nom
              </label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                disabled={submitStatus === 'loading'}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                disabled={submitStatus === 'loading'}
                className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                className="w-full rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Comment pouvons-nous vous aider ?"
                required
                disabled={submitStatus === 'loading'}
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 p-3 rounded-md border border-green-200 dark:border-green-500/20">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-3 rounded-md border border-red-200 dark:border-red-500/20">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{errorMessage || 'Erreur lors de l\'envoi du message. Veuillez réessayer.'}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={submitStatus === 'loading'}
            >
              {submitStatus === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}