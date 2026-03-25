'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '@/app/context/AppContext';
import { collection, query, where, orderBy, limit, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

export function NotificationBell() {
  const { user, notificationPreferences } = useAppContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Vérifier que db et user sont disponibles
    if (!db || !user) {
      console.log("⚠️ NotificationBell: db ou user non disponible");
      return;
    }

    // 🔥 FIX: Ne pas bloquer si notificationPreferences est undefined
    // On charge toujours les notifications, la préférence push est pour les notifications push natives
    // Pas pour l'affichage dans l'interface
    
    console.log("🔔 Chargement des notifications pour:", user.id);

    const firestore = db as import('firebase/firestore').Firestore;
    
    const notificationsRef = collection(firestore, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(50) // Augmenté pour voir plus de notifications
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      console.log(`📬 ${notifs.length} notifications chargées pour ${user.id}`);
      if (notifs.length > 0) {
        console.log("Dernière notification:", notifs[0].title);
      }
      
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    }, (error) => {
      console.error("Erreur chargement notifications:", error);
    });

    return () => unsubscribe();
  }, [user]); // Retiré notificationPreferences pour ne pas bloquer

  const markAsRead = async (notificationId: string) => {
    if (!db) return;
    const firestore = db as import('firebase/firestore').Firestore;
    try {
      const notificationRef = doc(firestore, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!db) return;
    const firestore = db as import('firebase/firestore').Firestore;
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => {
          const notificationRef = doc(firestore, 'notifications', n.id);
          return updateDoc(notificationRef, { read: true });
        })
      );
      toast.success('Toutes les notifications marquées comme lues');
    } catch (error) {
      console.error('Erreur marquage tout lu:', error);
    }
  };

  const deleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!db) return;
    const firestore = db as import('firebase/firestore').Firestore;
    try {
      await deleteDoc(doc(firestore, 'notifications', notificationId));
      toast.success('Notification supprimée');
    } catch (error) {
      console.error('Erreur suppression notification:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteAllNotifications = async () => {
    if (!db) return;
    const firestore = db as import('firebase/firestore').Firestore;
    try {
      await Promise.all(
        notifications.map(n => deleteDoc(doc(firestore, 'notifications', n.id)))
      );
      toast.success('Toutes les notifications ont été supprimées');
    } catch (error) {
      console.error('Erreur suppression toutes notifications:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  // Si db n'est pas disponible, ne rien afficher
  if (!db) {
    return null;
  }

  return (
    <div className="relative">
  {/* Icône cloche */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="relative p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
  >
    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
    {unreadCount > 0 && (
      <span className="absolute -top-0.5 -right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    )}
  </button>

  {/* Menu déroulant des notifications - Centré sur mobile */}
  <AnimatePresence>
    {isOpen && (
      <>
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed sm:absolute left-1/2 top-1/2 sm:top-full sm:left-auto sm:right-0 sm:translate-x-0 -translate-x-1/2 -translate-y-1/2 sm:-translate-y-0
                     w-[90vw] sm:w-96 max-h-[80vh] sm:max-h-96
                     mt-0 sm:mt-2
                     bg-[var(--bg-secondary)] border border-[var(--border-color)] 
                     rounded-xl shadow-xl z-50 overflow-hidden
                     flex flex-col"
        >
          {/* En-tête */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-secondary)] z-10">
            <h3 className="font-semibold text-sm sm:text-base">
              Notifications
              {notifications.length > 0 && (
                <span className="ml-2 text-xs text-[var(--text-secondary)]">
                  ({notifications.length})
                </span>
              )}
            </h3>
            <div className="flex items-center gap-1 sm:gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={deleteAllNotifications}
                  className="text-xs text-red-500 hover:text-red-600 hover:underline flex items-center gap-0.5 sm:gap-1 px-1 sm:px-0"
                  title="Supprimer toutes"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Tout supprimer</span>
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 sm:gap-1 px-1 sm:px-0"
                >
                  <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Tout marquer lu</span>
                </button>
              )}
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-[var(--text-secondary)]">
                <Bell className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Aucune notification</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`group relative block hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-[var(--border-color)] last:border-0 ${
                    !notif.read ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''
                  }`}
                >
                  <Link
                    href={notif.link}
                    onClick={() => handleNotificationClick(notif)}
                    className="block p-3 sm:p-4 pr-10 sm:pr-12"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm ${!notif.read ? 'font-semibold' : 'font-normal'} text-[var(--text-primary)] break-words`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mt-1">
                          {formatRelativeTime(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </Link>
                  
                  {/* Bouton supprimer individuel */}
                  <button
                    onClick={(e) => deleteNotification(notif.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</div>
  );
}