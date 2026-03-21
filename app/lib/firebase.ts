// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Vérifier que toutes les variables sont présentes
const hasValidConfig = Object.values(firebaseConfig).every(value => value !== undefined);

// Initialiser Firebase seulement si la config est valide
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (hasValidConfig) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("✅ Firebase initialisé avec succès");
  } catch (error) {
    console.error("❌ Erreur initialisation Firebase:", error);
  }
} else {
  console.warn("⚠️ Firebase non initialisé - variables d'environnement manquantes");
}

// EXPORTER explicitement auth et db
export const auth = authInstance;
export const db = dbInstance;

// ==================== TYPES FIRESTORE (avec Timestamp) ====================

export interface FirestoreMission {
  id?: string;
  entrepriseId: string;
  merchandiseType: string;
  weightVolume: string;
  departure: string;
  destination: string;
  desiredDate: Timestamp;
  note?: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  acceptedQuoteId?: string | null;
  driverId?: string | null;
}

export interface FirestoreQuote {
  id?: string;
  missionId: string;
  driverId: string;
  price: number;
  estimatedTime: string;
  message?: string;
  status: string;
  createdAt: Timestamp;
}

export interface FirestoreRating {
  id?: string;
  missionId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment: string;
  createdAt: Timestamp;
}

// ==================== TYPES POUR LES DONNÉES D'ENTRÉE ====================

export interface CreateMissionData {
  entrepriseId: string;
  merchandiseType: string;
  weightVolume: string;
  departure: string;
  destination: string;
  desiredDate: string;  // ← string en entrée
  note?: string;
}

export interface CreateQuoteData {
  missionId: string;
  driverId: string;
  price: number;
  estimatedTime: string;
  message?: string;
}

export interface CreateRatingData {
  missionId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment: string;
}

// Types pour l'inscription
export interface EntrepriseData {
  email: string;
  password: string;
  name: string;
  companyName: string;
  phone: string;
}

export interface ChauffeurData {
  email: string;
  password: string;
  name: string;
  phone: string;
  truckType: string;
  capacity: number;
  zone: string;
}

// ==================== FONCTIONS D'AUTH ====================

// ✅ Inscription entreprise
export const registerEntreprise = async (userData: EntrepriseData) => {
  if (!authInstance || !dbInstance) throw new Error("Firebase non initialisé");
  
  try {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const userCredential = await createUserWithEmailAndPassword(
      authInstance, 
      userData.email, 
      userData.password
    );
    
    const userRef = doc(dbInstance, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      id: userCredential.user.uid,
      email: userData.email,
      name: userData.name,
      companyName: userData.companyName,
      phone: userData.phone,
      role: 'entreprise',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log("✅ Entreprise inscrite:", userCredential.user.uid);
    return { success: true, id: userCredential.user.uid };
  } catch (error) {
    console.error("❌ Erreur inscription:", error);
    throw error;
  }
};

// ✅ Inscription chauffeur
export const registerChauffeur = async (userData: ChauffeurData) => {
  if (!authInstance || !dbInstance) throw new Error("Firebase non initialisé");
  
  try {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const userCredential = await createUserWithEmailAndPassword(
      authInstance, 
      userData.email, 
      userData.password
    );
    
    const userRef = doc(dbInstance, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      id: userCredential.user.uid,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      truckType: userData.truckType,
      capacity: userData.capacity,
      zone: userData.zone,
      role: 'chauffeur',
      rating: 5.0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log("✅ Chauffeur inscrit:", userCredential.user.uid);
    return { success: true, id: userCredential.user.uid };
  } catch (error) {
    console.error("❌ Erreur inscription:", error);
    throw error;
  }
};

// ✅ Connexion
export const loginUser = async (email: string, password: string) => {
  if (!authInstance || !dbInstance) throw new Error("Firebase non initialisé");
  
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    
    const userDoc = await getDoc(doc(dbInstance, 'users', userCredential.user.uid));
    const userData = userDoc.data();
    
    return { 
      success: true, 
      user: {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        ...userData
      }
    };
  } catch (error) {
    console.error("❌ Erreur connexion:", error);
    throw error;
  }
};

// ✅ Déconnexion
export const logoutUser = async () => {
  if (!authInstance) throw new Error("Firebase non initialisé");
  const { signOut } = await import('firebase/auth');
  await signOut(authInstance);
};

// ✅ Récupérer les infos d'un utilisateur
export const getUserById = async (uid: string) => {
  if (!dbInstance) throw new Error("Firebase non initialisé");
  const userDoc = await getDoc(doc(dbInstance, 'users', uid));
  return userDoc.exists() ? { id: uid, ...userDoc.data() } : null;
};

// ==================== FONCTIONS MISSIONS ====================

// ✅ Créer une mission
export const createMission = async (missionData: CreateMissionData) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const missionsRef = collection(dbInstance, 'missions');
    const newMission = {
      entrepriseId: missionData.entrepriseId,
      merchandiseType: missionData.merchandiseType,
      weightVolume: missionData.weightVolume,
      departure: missionData.departure,
      destination: missionData.destination,
      desiredDate: Timestamp.fromDate(new Date(missionData.desiredDate)), // ← Conversion
      note: missionData.note,
      status: 'En attente',
      acceptedQuoteId: null,
      driverId: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(missionsRef, newMission);
    console.log("✅ Mission créée:", docRef.id);
    
    return { id: docRef.id, ...newMission };
  } catch (error) {
    console.error("❌ Erreur création mission:", error);
    throw error;
  }
};

// ✅ Récupérer les missions d'une entreprise
export const getEntrepriseMissions = async (entrepriseId: string) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const q = query(
      collection(dbInstance, 'missions'),
      where('entrepriseId', '==', entrepriseId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const missions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return missions;
  } catch (error) {
    console.error("❌ Erreur récupération missions:", error);
    throw error;
  }
};

// ✅ Récupérer les missions disponibles pour un chauffeur
export const getAvailableMissions = async () => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const q = query(
      collection(dbInstance, 'missions'),
      where('status', 'in', ['En attente', 'Devis reçus']),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const missions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return missions;
  } catch (error) {
    console.error("❌ Erreur récupération missions disponibles:", error);
    throw error;
  }
};

// ✅ Récupérer les missions d'un chauffeur
export const getChauffeurMissions = async (chauffeurId: string) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const q = query(
      collection(dbInstance, 'missions'),
      where('driverId', '==', chauffeurId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const missions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return missions;
  } catch (error) {
    console.error("❌ Erreur récupération missions chauffeur:", error);
    throw error;
  }
};

// ✅ Récupérer une mission spécifique
export const getMissionById = async (missionId: string) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const missionDoc = await getDoc(doc(dbInstance, 'missions', missionId));
    return missionDoc.exists() ? { id: missionDoc.id, ...missionDoc.data() } : null;
  } catch (error) {
    console.error("❌ Erreur récupération mission:", error);
    throw error;
  }
};

// ✅ Mettre à jour une mission
export const updateMission = async (missionId: string, updates: Partial<FirestoreMission>) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const missionRef = doc(dbInstance, 'missions', missionId);
    await updateDoc(missionRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    console.log("✅ Mission mise à jour:", missionId);
  } catch (error) {
    console.error("❌ Erreur mise à jour mission:", error);
    throw error;
  }
};

// ✅ Supprimer une mission
export const deleteMission = async (missionId: string) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const missionRef = doc(dbInstance, 'missions', missionId);
    const missionDoc = await getDoc(missionRef);
    
    if (!missionDoc.exists()) {
      throw new Error("Mission non trouvée");
    }
    
    const missionData = missionDoc.data();
    
    if (missionData.status !== 'En attente' && missionData.status !== 'Devis reçus') {
      throw new Error("Impossible de supprimer une mission déjà en cours ou terminée");
    }
    
    await deleteDoc(missionRef);
    console.log("✅ Mission supprimée:", missionId);
  } catch (error) {
    console.error("❌ Erreur suppression mission:", error);
    throw error;
  }
};

// ==================== FONCTIONS DEVIS ====================

// ✅ Récupérer les devis pour une mission
export const getQuotesByMission = async (missionId: string) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const q = query(
      collection(dbInstance, 'quotes'),
      where('missionId', '==', missionId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const quotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return quotes;
  } catch (error) {
    console.error("❌ Erreur récupération devis:", error);
    throw error;
  }
};

// ✅ Récupérer les devis d'un chauffeur
export const getDriverQuotes = async (driverId: string) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const q = query(
      collection(dbInstance, 'quotes'),
      where('driverId', '==', driverId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const quotes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return quotes;
  } catch (error) {
    console.error("❌ Erreur récupération devis chauffeur:", error);
    throw error;
  }
};

// ✅ Ajouter un devis
export const addQuote = async (quoteData: CreateQuoteData) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const quotesRef = collection(dbInstance, 'quotes');
    const newQuote = {
      missionId: quoteData.missionId,
      driverId: quoteData.driverId,
      price: quoteData.price,
      estimatedTime: quoteData.estimatedTime,
      message: quoteData.message,
      status: 'En attente',
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(quotesRef, newQuote);
    
    // Mettre à jour le statut de la mission si nécessaire
    const missionRef = doc(dbInstance, 'missions', quoteData.missionId);
    const missionDoc = await getDoc(missionRef);
    if (missionDoc.exists() && missionDoc.data().status === 'En attente') {
      await updateDoc(missionRef, {
        status: 'Devis reçus',
        updatedAt: Timestamp.now()
      });
    }
    
    console.log("✅ Devis ajouté:", docRef.id);
    return { id: docRef.id, ...newQuote };
  } catch (error) {
    console.error("❌ Erreur ajout devis:", error);
    throw error;
  }
};

// ✅ Accepter un devis
export const acceptQuote = async (missionId: string, quoteId: string, driverId: string) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    // 1. Mettre à jour la mission
    const missionRef = doc(dbInstance, 'missions', missionId);
    await updateDoc(missionRef, {
      status: 'Confirmée',
      acceptedQuoteId: quoteId,
      driverId: driverId,
      updatedAt: Timestamp.now()
    });
    
    // 2. Mettre à jour le devis accepté
    const quoteRef = doc(dbInstance, 'quotes', quoteId);
    await updateDoc(quoteRef, {
      status: 'Accepté'
    });
    
    // 3. Refuser les autres devis
    const quotesQuery = query(
      collection(dbInstance, 'quotes'),
      where('missionId', '==', missionId),
      where('__name__', '!=', quoteId)
    );
    
    const otherQuotes = await getDocs(quotesQuery);
    const updatePromises = otherQuotes.docs.map(doc => 
      updateDoc(doc.ref, { status: 'Refusé' })
    );
    
    await Promise.all(updatePromises);
    
    console.log("✅ Devis accepté pour mission:", missionId);
  } catch (error) {
    console.error("❌ Erreur acceptation devis:", error);
    throw error;
  }
};

// ==================== FONCTIONS ÉVALUATIONS ====================

// ✅ Ajouter une évaluation
export const addRating = async (ratingData: CreateRatingData) => {
  if (!dbInstance) throw new Error("Firestore non initialisé");
  
  try {
    const ratingsRef = collection(dbInstance, 'ratings');
    const newRating = {
      missionId: ratingData.missionId,
      fromUserId: ratingData.fromUserId,
      toUserId: ratingData.toUserId,
      stars: ratingData.stars,
      comment: ratingData.comment,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(ratingsRef, newRating);
    
    // Mettre à jour la note du chauffeur
    const driverRatingsQuery = query(
      collection(dbInstance, 'ratings'),
      where('toUserId', '==', ratingData.toUserId)
    );
    
    const ratingsSnapshot = await getDocs(driverRatingsQuery);
    const totalStars = ratingsSnapshot.docs.reduce((sum, doc) => sum + doc.data().stars, 0) + ratingData.stars;
    const avgRating = totalStars / (ratingsSnapshot.docs.length + 1);
    
    const driverRef = doc(dbInstance, 'users', ratingData.toUserId);
    await updateDoc(driverRef, {
      rating: Number(avgRating.toFixed(1))
    });
    
    console.log("✅ Évaluation ajoutée:", docRef.id);
    return { id: docRef.id, ...newRating };
  } catch (error) {
    console.error("❌ Erreur ajout évaluation:", error);
    throw error;
  }
};