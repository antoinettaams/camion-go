// src/app/forgot-password/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, ArrowLeft, Loader2, MailCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useFirebaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("📧 Envoi demande pour:", email);
      await resetPassword(email);
      
      setIsSent(true);
      toast.success('✅ Email de réinitialisation envoyé !', {
        duration: 5000,
        icon: '📧',
        style: {
          background: '#10b981',
          color: 'white',
        },
      });
      
    } catch (err: any) {
      console.error('❌ Erreur reset password:', err);
      
      let errorMessage = '❌ Une erreur est survenue';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = '❌ Aucun compte trouvé avec cet email';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '❌ Adresse email invalide';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = '❌ Trop de tentatives. Réessayez plus tard.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = '❌ Email non trouvé. Vérifiez votre adresse.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center">
          <Truck className="mx-auto h-12 w-12 text-blue-700" />
          <h2 className="mt-6 text-3xl font-bold text-slate-900">Mot de passe oublié ?</h2>
          <p className="mt-2 text-sm text-slate-600">
            {!isSent 
              ? "Saisissez votre email pour recevoir un lien de réinitialisation"
              : "Vérifiez votre boîte de réception"
            }
          </p>
        </div>

        {error && !isSent && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!isSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adresse email
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien'
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/sign-in" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour à la connexion
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <MailCheck className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Email envoyé !
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Nous avons envoyé un lien de réinitialisation à :<br />
                <strong className="font-medium">{email}</strong>
              </p>
              <p className="text-xs text-green-600">
                Si vous ne recevez pas d'email dans les minutes qui suivent, 
                vérifiez vos spams ou réessayez.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSent(false);
                  setError('');
                }}
                className="w-full"
              >
                Réessayer avec un autre email
              </Button>
              
              <Link href="/sign-in">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}