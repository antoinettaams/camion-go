'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Select } from '@/app/components/ui/Select';
import { useAppContext } from '@/app/context/AppContext';
import toast from 'react-hot-toast';

const MARCHANDISES = ['Alimentaire', 'Électroménager', 'Matériaux de construction', 'Pièces détachées', 'Autre'];
const CITIES = ['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Bohicon', 'Natitingou', 'Lokossa', 'Ouidah', 'Kandi', 'Djougou'];

interface NewRequestProps {
  onBack: () => void; 
}

export function NewRequest({ onBack }: NewRequestProps) {
  const { user, addMission } = useAppContext();
  const router = useRouter();
  const [formData, setFormData] = useState({
    merchandiseType: MARCHANDISES[0],
    otherMerchandise: '',
    weightVolume: '',
    departure: CITIES[0],
    destination: CITIES[1],
    desiredDate: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validation du poids/volume
    if (!formData.weightVolume.trim()) {
      toast.error('Veuillez renseigner le poids/volume');
      return;
    }
    
    // Si "Autre" est sélectionné, utiliser la valeur personnalisée
    const finalMerchandiseType = formData.merchandiseType === 'Autre' 
      ? formData.otherMerchandise.trim() || 'Autre (non spécifié)'
      : formData.merchandiseType;
    
    // Nettoyer la valeur du poids/volume
    const cleanWeightVolume = formData.weightVolume.trim();
    
    addMission({ 
      entrepriseId: user.id, 
      merchandiseType: finalMerchandiseType,
      weightVolume: cleanWeightVolume,
      departure: formData.departure,
      destination: formData.destination,
      desiredDate: formData.desiredDate,
      note: formData.note
    });
    
    toast.success('✅ Demande publiée avec succès !', {
      duration: 3000,
      icon: '🚀',
    });
    
    onBack();
  };

  const isOtherSelected = formData.merchandiseType === 'Autre';

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </button>

      <div className="bg-[var(--bg-secondary)] rounded-lg sm:rounded-xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border-color)] bg-slate-50 dark:bg-slate-800/50">
          <h1 className="text-lg sm:text-xl font-bold">Nouvelle demande de transport</h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Remplissez les détails pour recevoir des devis de nos chauffeurs partenaires.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className={isOtherSelected ? "sm:col-span-2" : ""}>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Type de marchandise <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.merchandiseType} 
                onChange={e => setFormData({...formData, merchandiseType: e.target.value})}
                className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] w-full"
              >
                {MARCHANDISES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </Select>
            </div>

            {/* Champ supplémentaire pour "Autre" */}
            {isOtherSelected && (
              <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  Précisez le type de marchandise <span className="text-red-500">*</span>
                </label>
                <Input 
                  required
                  placeholder="Ex: Textiles, Produits pharmaceutiques, Matériel électronique..."
                  value={formData.otherMerchandise}
                  onChange={e => setFormData({...formData, otherMerchandise: e.target.value})}
                  className="text-sm bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Décrivez précisément le type de marchandise à transporter
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Poids / Volume <span className="text-red-500">*</span>
              </label>
              <Input 
                required 
                placeholder="ex: 2 tonnes" 
                value={formData.weightVolume} 
                onChange={e => setFormData({...formData, weightVolume: e.target.value})}
                className={`text-sm bg-[var(--input-bg)] border ${!formData.weightVolume.trim() && formData.weightVolume !== '' ? 'border-red-500' : 'border-[var(--border-color)]'} text-[var(--text-primary)]`}
              />
              {!formData.weightVolume.trim() && (
                <p className="text-xs text-red-500 mt-1">
                  Exemple: 2 tonnes, 500 kg, 3 m³
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Ville de départ <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.departure} 
                onChange={e => setFormData({...formData, departure: e.target.value})}
                className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Ville de destination <span className="text-red-500">*</span>
              </label>
              <Select 
                value={formData.destination} 
                onChange={e => setFormData({...formData, destination: e.target.value})}
                className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]"
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Date souhaitée <span className="text-red-500">*</span>
              </label>
              <Input 
                type="datetime-local" 
                required 
                value={formData.desiredDate} 
                onChange={e => setFormData({...formData, desiredDate: e.target.value})}
                className="text-sm bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Note (optionnelle)
              </label>
              <textarea 
                className="flex w-full rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] sm:min-h-[100px]"
                placeholder="Instructions particulières, points d'attention, etc."
                value={formData.note}
                onChange={e => setFormData({...formData, note: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-color)] flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onBack}>
              Annuler
            </Button>
            <Button type="submit" size="sm">
              Publier la demande
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}