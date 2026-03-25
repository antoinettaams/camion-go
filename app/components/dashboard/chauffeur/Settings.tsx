'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight,
  ChevronLeft,
  CheckCircle2, 
  AlertCircle,
  Crown,
  Sparkles, 
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
  Bell as BellIcon,
  Moon,
  Settings as SettingsIcon,
  CreditCard,
  Download,
  HelpCircle,
  Trash2,
  Key,
  Save,
  Camera,
  Globe,
  Truck,
  MapPin,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '@/app/context/AppContext';
import { useFirebaseAuth } from '@/app/context/FirebaseAuthContext';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { cn } from '@/app/lib/utils';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  danger?: boolean;
}

interface MenuSection {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export function Settings() {
  const router = useRouter();
  const { notificationPreferences, updateNotificationPreferences } = useAppContext();
  const { user, deleteUserAccount } = useAppContext();
  const { logout: firebaseLogout } = useFirebaseAuth();
  const [activeMenu, setActiveMenu] = useState('profil');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileContent, setShowMobileContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  // États des formulaires
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    truckType: user?.truckType || '',
    capacity: user?.capacity || '',
    zone: user?.zone || '',
    avatar: user?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
  });

  // Charger la préférence de thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowMobileContent(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fonction pour basculer le mode sombre
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  // Upload d'avatar (simulé pour l'instant)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2MB');
      return;
    }

    setUploadingAvatar(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fakeUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, avatar: fakeUrl });
      setSuccessMessage('Photo de profil mise à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Sauvegarder le profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Profil mis à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Changer le mot de passe
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Mot de passe modifié');
      setTimeout(() => setSuccessMessage(''), 3000);
      toast.success('Mot de passe modifié avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les préférences
  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Préférences mises à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      toast.success('Préférences enregistrées !');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarder les notifications
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Notifications mises à jour');
      setTimeout(() => setSuccessMessage(''), 3000);
      toast.success('Paramètres de notification enregistrés !');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Gérer la suppression du compte
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setShowDeleteConfirm(false);
    setIsSaving(true);
    
    try {
      toast.loading('Suppression du compte en cours...', { id: 'delete-account' });
      
      await deleteUserAccount(user.id);
      
      const { deleteUser } = await import('firebase/auth');
      const { auth } = await import('@/app/lib/firebase');
      
      if (auth && auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      
      await firebaseLogout();
      
      toast.success('Compte supprimé avec succès', { id: 'delete-account' });
      router.push('/');
      
    } catch (error: any) {
      console.error("❌ Erreur suppression:", error);
      
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Veuillez vous reconnecter avant de supprimer votre compte');
      } else {
        toast.error('Erreur lors de la suppression du compte', { id: 'delete-account' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Structure du menu latéral
  const menuSections: MenuSection[] = [
    {
      title: user?.name || 'Chauffeur',
      subtitle: user?.email || '',
      items: [
        { id: 'profil', label: 'Profil', icon: User },
        { id: 'motdepasse', label: 'Mot de passe', icon: Key },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'mode', label: 'Mode sombre', icon: Moon }
      ]
    },
    {
      title: 'À propos',
      items: [
        { id: 'aide', label: 'Aide', icon: HelpCircle }
      ]
    },
    {
      title: '',
      items: [
        { id: 'desactiver', label: 'Désactiver mon compte', icon: Trash2, danger: true }
      ]
    }
  ];

  // Fonction pour obtenir le titre du menu actif
  const getActiveMenuTitle = () => {
    for (const section of menuSections) {
      const item = section.items.find(item => item.id === activeMenu);
      if (item) return item.label;
    }
    return 'Paramètres';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header avec titre et retour */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {isMobile && showMobileContent ? (
                <button
                  onClick={() => setShowMobileContent(false)}
                  className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <ChevronLeft size={20} />
                  <h1 className="text-xl font-bold">{getActiveMenuTitle()}</h1>
                </button>
              ) : (
                <h1 className="text-2xl font-bold">Paramètres</h1>
              )}
            </div>

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

          {/* Layout à 2 colonnes */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Menu latéral gauche */}
            <div className={cn(
              "md:w-80 shrink-0",
              isMobile && showMobileContent ? 'hidden' : 'block'
            )}>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
                {menuSections.map((section, idx) => (
                  <div key={idx} className={idx > 0 ? 'border-t border-[var(--border-color)]' : ''}>
                    {section.title && (
                      <div className="px-4 py-3">
                        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">{section.title}</h2>
                         {section.subtitle && (
                          <p className="text-xs text-[var(--text-secondary)] mt-1">{section.subtitle}</p>
                        )}
                      </div>
                    )}
                    <div className="px-2 pb-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (item.id === 'desactiver') {
                                setShowDeleteConfirm(true);
                              } else {
                                setActiveMenu(item.id);
                                if (isMobile) {
                                  setShowMobileContent(true);
                                }
                              }
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 mb-2 py-2.5 rounded-xl text-sm transition-all",
                              item.danger 
                                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300' 
                                : isActive
                                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                            )}
                          >
                            <Icon size={18} />
                            <span className="flex-1 text-left">{item.label}</span>
                            <ChevronRight size={16} className={isActive ? 'text-blue-700 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contenu droit */}
            <div className={cn(
              "flex-1",
              isMobile && !showMobileContent ? 'hidden' : 'block'
            )}>
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6">
                {/* Profil */}
                {activeMenu === 'profil' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Profil chauffeur</h2>
                    
                    {/* Avatar avec upload */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl overflow-hidden ring-4 ring-[#6C4DFF]/20">
                          {profileData.avatar ? (
                            <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={40} className="text-white" />
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#6C4DFF] rounded-full flex items-center justify-center hover:bg-[#6C4DFF]/90 transition-colors border-2 border-[var(--bg-secondary)] cursor-pointer">
                          {uploadingAvatar ? (
                            <Loader2 size={14} className="animate-spin text-white" />
                          ) : (
                            <Camera size={14} className="text-white" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarUpload} 
                            className="hidden" 
                            disabled={uploadingAvatar}
                          />
                        </label>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--text-secondary)] mb-1">Photo de profil</p>
                        <p className="text-xs text-[var(--text-secondary)]">JPG, PNG • Max 2MB</p>
                      </div>
                    </div>

                    {/* Formulaire */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
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
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
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
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
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
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
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
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                          Capacité (tonnes)
                        </label>
                        <Input
                          type="number"
                          value={profileData.capacity}
                          onChange={(e) => setProfileData({ ...profileData, capacity: e.target.value })}
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
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

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
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
                  </motion.div>
                )}

                {/* Mot de passe */}
                {activeMenu === 'motdepasse' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Changer le mot de passe</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                          Mot de passe actuel
                        </label>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] pr-10"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] pr-10"
                          />
                          <button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Minimum 6 caractères</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                          Confirmer le mot de passe
                        </label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
                        />
                      </div>

                      <Button
                        onClick={handlePasswordChange}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Mise à jour...
                          </>
                        ) : (
                          'Mettre à jour'
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Notifications */}
                {activeMenu === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Notifications</h2>
    
                    <div className="space-y-4">
                      {/* Notification par email */}
                      <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">
                            Notifications par email
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Recevoir les offres par email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationPreferences.email}
                            onChange={() => updateNotificationPreferences({
                              ...notificationPreferences,
                              email: !notificationPreferences.email
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                      </div>

                      {/* Notification push */}
                      <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">
                            Notifications push
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Notifications dans le navigateur
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationPreferences.push}
                            onChange={() => updateNotificationPreferences({
                              ...notificationPreferences,
                              push: !notificationPreferences.push
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mode sombre */}
                {activeMenu === 'mode' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-bold mb-6">Mode sombre</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-semibold">Mode sombre</p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Basculer entre le mode sombre et clair
                          </p>
                        </div>
                        <button
                          onClick={toggleDarkMode}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            darkMode ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              darkMode ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>
                      
                      <p className="text-xs text-[var(--text-secondary)] pt-2">
                        Actuellement : <span className="font-semibold">{darkMode ? 'Mode sombre' : 'Mode clair'}</span>
                      </p>
                    </div>
                  </motion.div>
                )}
{/* Aide */}
            {activeMenu === 'aide' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-bold mb-6">Aide</h2>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
                      Comment trouver des missions ?
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Consultez la page "Missions disponibles" et proposez vos devis aux entreprises.
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <h3 className="font-semibold mb-2 text-[var(--text-primary)]">
                      Comment sont calculés mes gains ?
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Vos gains correspondent au montant des devis acceptés pour les missions terminées.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

              </div>
            </div>
          </div>
        </div>
      </div>

     {/* Modal de confirmation suppression */}
<AnimatePresence>
  {showDeleteConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={() => setShowDeleteConfirm(false)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-center mb-2 text-[var(--text-primary)]">
          Désactiver le compte ?
        </h3>
        <p className="text-[var(--text-secondary)] text-center mb-6">
          Cette action est irréversible. Toutes vos données seront supprimées.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleDeleteAccount}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Désactiver
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}