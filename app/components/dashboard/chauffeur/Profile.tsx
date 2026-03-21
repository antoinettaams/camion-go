'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Camera,
  Mail,
  User,
  LogOut,
  Save,
  Key,
  Moon,
  Bell as BellIcon,
  Loader2,
  CheckCircle2,
  Crown,
  Truck,
  Phone,
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  AlertTriangle,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Badge } from '@/app/components/ui/Badge';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';

export function Profile() {
  const router = useRouter();
  const { user, missions, quotes, updateUserProfile, updateUserAvatar } = useAppContext();
  const { logout: firebaseLogout } = useFirebaseAuth();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // Données du profil chauffeur
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jean Dupont',
    email: user?.email || 'chauffeur@email.com',
    phone: user?.phone || '+229 01 23 45 67',
    truckType: user?.truckType || 'Camion bâché',
    capacity: user?.capacity || '5',
    zone: user?.zone || 'Cotonou',
    avatar: user?.avatar || '',
    rating: user?.rating || 4.8,
    createdAt: user?.createdAt || '2024-01-15'
  });

  // Statistiques du chauffeur
  const driverMissions = missions.filter(m => m.driverId === user?.id);
  const completedMissions = driverMissions.filter(m => m.status === 'Livrée');
  const pendingQuotes = quotes.filter(q => q.driverId === user?.id).length;
  
  const stats = {
    completedMissions: completedMissions.length,
    pendingQuotes: pendingQuotes,
    totalMissions: driverMissions.length,
    rating: profileData.rating
  };

  // Charger la préférence de thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme !== 'light');
  }, []);

  // Upload d'avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2MB');
      return;
    }

    setUploadingAvatar(true);
    
    try {
      const avatarUrl = await updateUserAvatar(user.id, file);
      setProfileData({ ...profileData, avatar: avatarUrl });
      setSuccessMessage('Photo mise à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      toast.success('Photo mise à jour avec succès !');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Sauvegarder le profil
  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateUserProfile(user.id, {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        truckType: profileData.truckType,
        capacity: Number(profileData.capacity),
        zone: profileData.zone,
      });
      
      setSuccessMessage('Profil mis à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      toast.success('Informations enregistrées !');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Se déconnecter
  const handleLogout = async () => {
    try {
      await firebaseLogout();
      toast.success('👋 Déconnexion réussie');
      router.push('/');
    } catch (error) {
      toast.error('❌ Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header avec retour */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
              >
                <ArrowLeft size={20} className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
              </button>
              <h1 className="text-2xl font-bold">Mon profil chauffeur</h1>
            </div>

            {/* Message de succès */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg"
                >
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Carte de profil principale */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden mb-6">
            {/* Section avatar et infos principales */}
            <div className="mt-5 px-6 pb-6">
              <div className="flex flex-col items-center text-center mb-6">
                {/* Avatar avec upload */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-white font-bold text-3xl overflow-hidden ring-4 ring-[#6C4DFF]/20">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400">{profileData.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-1 right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center hover:bg-[#6C4DFF]/90 transition-colors border-2 border-[var(--bg-secondary)] cursor-pointer">
                      {uploadingAvatar ? (
                        <Loader2 size={14} className="animate-spin text-white" />
                      ) : (
                        <Camera size={14} className="text-white" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                        disabled={uploadingAvatar}
                      />
                    </label>
                  )}
                </div>

                {/* Nom du chauffeur */}
                <h2 className="text-2xl font-bold mb-1">
                  {profileData.name}
                </h2>
                <p className="text-[var(--text-secondary)]">
                  {profileData.truckType} • {profileData.zone}
                </p>
              </div>

              {/* Mode édition ou visualisation */}
              {isEditing ? (
                // Formulaire d'édition
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">
                        Nom complet
                      </label>
                      <Input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Téléphone
                      </label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Type de camion
                      </label>
                      <Input
                        type="text"
                        value={profileData.truckType}
                        onChange={(e) => setProfileData({ ...profileData, truckType: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Capacité (tonnes)
                      </label>
                      <Input
                        type="number"
                        value={profileData.capacity}
                        onChange={(e) => setProfileData({ ...profileData, capacity: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">
                        Zone d'activité
                      </label>
                      <Input
                        type="text"
                        value={profileData.zone}
                        onChange={(e) => setProfileData({ ...profileData, zone: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          name: user?.name || 'Jean Dupont',
                          email: user?.email || 'chauffeur@email.com',
                          phone: user?.phone || '+229 01 23 45 67',
                          truckType: user?.truckType || 'Camion bâché',
                          capacity: user?.capacity || '5',
                          zone: user?.zone || 'Cotonou',
                          avatar: user?.avatar || '',
                          rating: user?.rating || 4.8,
                          createdAt: user?.createdAt || '2024-01-15'
                        });
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-[#6C4DFF] hover:bg-[#6C4DFF]/90 text-white"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                // Affichage des informations
                <div className="space-y-6">
                  {/* Informations de contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <Mail size={18} className="text-[#6C4DFF]" />
                      <div className="text-left">
                        <p className="text-xs text-[var(--text-secondary)]">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <Phone size={18} className="text-[#6C4DFF]" />
                      <div className="text-left">
                        <p className="text-xs text-[var(--text-secondary)]">Téléphone</p>
                        <p className="font-medium">{profileData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <Truck size={18} className="text-[#6C4DFF]" />
                      <div className="text-left">
                        <p className="text-xs text-[var(--text-secondary)]">Véhicule</p>
                        <p className="font-medium">{profileData.truckType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <Package size={18} className="text-[#6C4DFF]" />
                      <div className="text-left">
                        <p className="text-xs text-[var(--text-secondary)]">Capacité</p>
                        <p className="font-medium">{profileData.capacity} tonnes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg md:col-span-2">
                      <MapPin size={18} className="text-[#6C4DFF]" />
                      <div className="text-left">
                        <p className="text-xs text-[var(--text-secondary)]">Zone d'activité</p>
                        <p className="font-medium">{profileData.zone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton modifier */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-[#6C4DFF]/10 text-[#6C4DFF] py-3 rounded-xl font-semibold hover:bg-[#6C4DFF]/20 transition-colors"
                  >
                    Modifier le profil
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Liens rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/chauffeur/settings?tab=motdepasse"
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3"
            >
              <Key size={20} className="text-[var(--text-secondary)]" />
              <span className="flex-1 text-sm font-semibold">Mot de passe</span>
              <ChevronRight size={16} className="text-[var(--text-secondary)]" />
            </Link>

            <Link
              href="/dashboard/chauffeur/settings?tab=notifications"
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3"
            >
              <BellIcon size={20} className="text-[var(--text-secondary)]" />
              <span className="flex-1 text-sm font-semibold">Notifications</span>
              <ChevronRight size={16} className="text-[var(--text-secondary)]" />
            </Link>

            <button
              onClick={() => {
                setDarkMode(!darkMode);
                localStorage.setItem('theme', darkMode ? 'light' : 'dark');
                document.documentElement.classList.toggle('dark');
              }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3"
            >
              <Moon size={20} className="text-[var(--text-secondary)]" />
              <span className="flex-1 text-sm font-semibold">
                Mode {darkMode ? 'sombre' : 'clair'}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                {darkMode ? 'Activé' : 'Désactivé'}
              </span>
            </button>
          </div>

          {/* Bouton déconnexion */}
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 py-3 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Modal de confirmation déconnexion */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setLogoutModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mx-auto mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Déconnexion</h3>
              <p className="text-[var(--text-secondary)] text-center mb-6">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setLogoutModalOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Se déconnecter
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}