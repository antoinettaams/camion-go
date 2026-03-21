'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Mission, Quote, Rating, MissionStatus } from '../types';
import { db } from '@/app/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc,  
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { useFirebaseAuth } from './FirebaseAuthContext';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  appLoading: boolean;
  login: (email: string, role?: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<void>;
  users: User[];
  missions: Mission[];
  quotes: Quote[];
  ratings: Rating[];
  addMission: (mission: Omit<Mission, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => Promise<void>;
  acceptQuote: (missionId: string, quoteId: string) => Promise<void>;
  updateMissionStatus: (missionId: string, status: MissionStatus) => Promise<void>;
  deleteMission: (missionId: string) => Promise<void>;
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => Promise<void>;
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  updateUserAvatar: (userId: string, file: File) => Promise<string>;
  fetchUserMissions: (userId: string) => Promise<Mission[]>;
  fetchUserQuotes: (driverId: string) => Promise<Quote[]>;
  deleteUserAccount: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  
  const { user: firebaseUser } = useFirebaseAuth();

  // Vérifier si Firestore est disponible
  const isFirestoreAvailable = db !== null;

  // Fonction utilitaire pour obtenir db avec assertion de type
  const getDb = (): Firestore => {
    if (!db) throw new Error("Firestore non disponible");
    return db;
  };

  // Charger les données depuis Firestore au démarrage
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isFirestoreAvailable) {
        console.warn("⚠️ Firestore non disponible, utilisation des données mockées");
        setAppLoading(false);
        return;
      }

      try {
        const firestore = getDb();
        
        // Charger les utilisateurs
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersList);

        // Charger les missions
        const missionsSnapshot = await getDocs(collection(firestore, 'missions'));
        const missionsList = missionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Mission[];
        setMissions(missionsList);

        // Charger les devis
        const quotesSnapshot = await getDocs(collection(firestore, 'quotes'));
        const quotesList = quotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quote[];
        setQuotes(quotesList);

        // Charger les évaluations
        const ratingsSnapshot = await getDocs(collection(firestore, 'ratings'));
        const ratingsList = ratingsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Rating[];
        setRatings(ratingsList);

      } catch (error) {
        console.error("❌ Erreur chargement données:", error);
      } finally {
        setAppLoading(false);
      }
    };

    loadInitialData();

    // Écouter les changements en temps réel (seulement si Firestore disponible)
    if (isFirestoreAvailable) {
      const firestore = getDb();
      
      const unsubscribeMissions = onSnapshot(collection(firestore, 'missions'), (snapshot) => {
        const missionsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Mission[];
        setMissions(missionsList);
      });

      const unsubscribeQuotes = onSnapshot(collection(firestore, 'quotes'), (snapshot) => {
        const quotesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quote[];
        setQuotes(quotesList);
      });

      return () => {
        unsubscribeMissions();
        unsubscribeQuotes();
      };
    }
  }, [isFirestoreAvailable]);

  // Mettre à jour l'utilisateur quand firebaseUser change
  useEffect(() => {
    const loadUserData = async () => {
      if (firebaseUser && isFirestoreAvailable) {
        try {
          const firestore = getDb();
          const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as User);
          }
        } catch (error) {
          console.error("❌ Erreur chargement utilisateur:", error);
        }
      } else {
        setUser(null);
      }
    };

    loadUserData();
  }, [firebaseUser, isFirestoreAvailable]);

  const login = async (email: string, role?: string) => {
    if (!isFirestoreAvailable) return false;
    
    try {
      const firestore = getDb();
      const q = query(
        collection(firestore, 'users'), 
        where('email', '==', email),
        ...(role ? [where('role', '==', role)] : [])
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUser({ id: userDoc.id, ...userDoc.data() } as User);
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Erreur login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: Partial<User>) => {
    if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
    
    try {
      const firestore = getDb();
      const docRef = await addDoc(collection(firestore, 'users'), {
        ...userData,
        createdAt: new Date().toISOString()
      });
      const newUser = { id: docRef.id, ...userData } as User;
      setUsers([...users, newUser]);
      setUser(newUser);
    } catch (error) {
      console.error("❌ Erreur register:", error);
      throw error;
    }
  };

  const addMission = async (missionData: Omit<Mission, 'id' | 'createdAt' | 'status'>) => {
  if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
  
  try {
    console.log("📦 addMission - Données reçues:", missionData);
    
    const firestore = getDb();
    const newMission = {
      ...missionData,
      status: 'En attente',
      createdAt: new Date().toISOString()
    };
    
    // S'assurer que weightVolume est bien une chaîne non vide
    if (!newMission.weightVolume || newMission.weightVolume.trim() === "") {
      newMission.weightVolume = "Non spécifié";
    }
    
    console.log("📦 addMission - Données à sauvegarder:", newMission);
    
    const docRef = await addDoc(collection(firestore, 'missions'), newMission);
    const missionWithId = { id: docRef.id, ...newMission } as Mission;
    
    console.log("✅ Mission créée avec ID:", docRef.id);
    
    setMissions([missionWithId, ...missions]);
  } catch (error) {
    console.error("❌ Erreur ajout mission:", error);
    throw error;
  }
};

  const addQuote = async (quoteData: Omit<Quote, 'id' | 'createdAt'>) => {
    if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
    
    try {
      const firestore = getDb();
      const newQuote = {
        ...quoteData,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(firestore, 'quotes'), newQuote);
      const quoteWithId = { id: docRef.id, ...newQuote } as Quote;
      
      setQuotes([...quotes, quoteWithId]);

      // Mettre à jour le statut de la mission
      const missionRef = doc(firestore, 'missions', quoteData.missionId);
      await updateDoc(missionRef, { status: 'Devis reçus' });
      
      setMissions(missions.map(m => 
        m.id === quoteData.missionId && m.status === 'En attente' 
          ? { ...m, status: 'Devis reçus' } 
          : m
      ));
    } catch (error) {
      console.error("❌ Erreur ajout devis:", error);
      throw error;
    }
  };

  const acceptQuote = async (missionId: string, quoteId: string) => {
    if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
    
    try {
      const firestore = getDb();
      const quote = quotes.find(q => q.id === quoteId);
      if (!quote) throw new Error("Devis non trouvé");

      const missionRef = doc(firestore, 'missions', missionId);
      await updateDoc(missionRef, { 
        status: 'Confirmée', 
        acceptedQuoteId: quoteId, 
        driverId: quote.driverId 
      });

      setMissions(missions.map(m => 
        m.id === missionId 
          ? { ...m, status: 'Confirmée', acceptedQuoteId: quoteId, driverId: quote.driverId } 
          : m
      ));
    } catch (error) {
      console.error("❌ Erreur acceptation devis:", error);
      throw error;
    }
  };

  const updateMissionStatus = async (missionId: string, status: MissionStatus) => {
    if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
    
    try {
      const firestore = getDb();
      const missionRef = doc(firestore, 'missions', missionId);
      await updateDoc(missionRef, { status });

      setMissions(missions.map(m => 
        m.id === missionId ? { ...m, status } : m
      ));
    } catch (error) {
      console.error("❌ Erreur mise à jour statut:", error);
      throw error;
    }
  };

  const deleteMission = async (missionId: string) => {
    if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
    
    try {
      const firestore = getDb();
      await deleteDoc(doc(firestore, 'missions', missionId));
      
      // Supprimer aussi les devis associés
      const quotesQuery = query(collection(firestore, 'quotes'), where('missionId', '==', missionId));
      const quotesSnapshot = await getDocs(quotesQuery);
      quotesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      setMissions(missions.filter(m => m.id !== missionId));
      setQuotes(quotes.filter(q => q.missionId !== missionId));
    } catch (error) {
      console.error("❌ Erreur suppression mission:", error);
      throw error;
    }
  };

  const addRating = async (ratingData: Omit<Rating, 'id' | 'createdAt'>) => {
    if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
    
    try {
      const firestore = getDb();
      const newRating = {
        ...ratingData,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(firestore, 'ratings'), newRating);
      const ratingWithId = { id: docRef.id, ...newRating } as Rating;
      
      setRatings([...ratings, ratingWithId]);

      // Mettre à jour la note du chauffeur
      if (ratingData.toUserId) {
        const driverRatings = [...ratings, ratingWithId].filter(r => r.toUserId === ratingData.toUserId);
        const avgRating = driverRatings.reduce((acc, curr) => acc + curr.stars, 0) / driverRatings.length;
        
        const userRef = doc(firestore, 'users', ratingData.toUserId);
        await updateDoc(userRef, { rating: Number(avgRating.toFixed(1)) });

        setUsers(users.map(u => 
          u.id === ratingData.toUserId ? { ...u, rating: Number(avgRating.toFixed(1)) } : u
        ));
      }
    } catch (error) {
      console.error("❌ Erreur ajout évaluation:", error);
      throw error;
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
    
    try {
      const firestore = getDb();
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, updates);

      setUsers(prevUsers => 
        prevUsers.map(u => u.id === userId ? { ...u, ...updates } : u)
      );

      if (user && user.id === userId) {
        setUser({ ...user, ...updates });
      }
    } catch (error) {
      console.error("❌ Erreur mise à jour profil:", error);
      throw error;
    }
  };

  const updateUserAvatar = async (userId: string, file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const avatarUrl = reader.result as string;
        
        try {
          if (isFirestoreAvailable) {
            const firestore = getDb();
            const userRef = doc(firestore, 'users', userId);
            await updateDoc(userRef, { avatar: avatarUrl });
          }

          setUsers(prevUsers => 
            prevUsers.map(u => u.id === userId ? { ...u, avatar: avatarUrl } : u)
          );

          if (user && user.id === userId) {
            setUser({ ...user, avatar: avatarUrl });
          }

          resolve(avatarUrl);
        } catch (error) {
          console.error("❌ Erreur mise à jour avatar:", error);
          throw error;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const fetchUserMissions = async (userId: string): Promise<Mission[]> => {
    if (!isFirestoreAvailable) return [];
    
    try {
      const firestore = getDb();
      const q = query(
        collection(firestore, 'missions'), 
        where('entrepriseId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
    } catch (error) {
      console.error("❌ Erreur chargement missions:", error);
      return [];
    }
  };

  const fetchUserQuotes = async (driverId: string): Promise<Quote[]> => {
    if (!isFirestoreAvailable) return [];
    
    try {
      const firestore = getDb();
      const q = query(
        collection(firestore, 'quotes'), 
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
    } catch (error) {
      console.error("❌ Erreur chargement devis:", error);
      return [];
    }
  };

  const deleteUserAccount = async (userId: string) => {
  if (!isFirestoreAvailable) throw new Error("Firestore non disponible");
  
    try {
      const firestore = getDb();
      
      // 1. Supprimer le document utilisateur
      await deleteDoc(doc(firestore, 'users', userId));
      
      // 2. Supprimer tous les devis de l'utilisateur
      const quotesQuery = query(
        collection(firestore, 'quotes'),
        where('driverId', '==', userId)
      );
      const quotesSnapshot = await getDocs(quotesQuery);
      quotesSnapshot.forEach(async (quoteDoc) => {
        await deleteDoc(quoteDoc.ref);
      });
      
      // 3. Supprimer les missions où l'utilisateur est chauffeur
      const missionsQuery = query(
        collection(firestore, 'missions'),
        where('driverId', '==', userId)
      );
      const missionsSnapshot = await getDocs(missionsQuery);
      missionsSnapshot.forEach(async (missionDoc) => {
        await deleteDoc(missionDoc.ref);
      });
      
      // 4. Supprimer les missions où l'utilisateur est entreprise
      const entrepriseMissionsQuery = query(
        collection(firestore, 'missions'),
        where('entrepriseId', '==', userId)
      );
      const entrepriseMissionsSnapshot = await getDocs(entrepriseMissionsQuery);
      entrepriseMissionsSnapshot.forEach(async (missionDoc) => {
        await deleteDoc(missionDoc.ref);
      });
      
      console.log("✅ Compte utilisateur supprimé:", userId);
    } catch (error) {
      console.error("❌ Erreur suppression compte:", error);
      throw error;
    }
  };


  return (
    <AppContext.Provider value={{
      user,
      setUser,
      appLoading,
      login,
      logout,
      register,
      users,
      missions,
      quotes,
      ratings,
      addMission,
      addQuote,
      acceptQuote,
      updateMissionStatus,
      deleteMission,
      addRating,
      updateUserProfile,
      updateUserAvatar,
      fetchUserMissions,
      fetchUserQuotes,
      deleteUserAccount
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}