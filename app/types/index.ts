// src/types/index.ts
export type Role = 'entreprise' | 'chauffeur';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  // Entreprise specific
  companyName?: string;
  // Chauffeur specific
  truckType?: string;
  capacity?: number;
  zone?: string;
  rating?: number;
  // Champs supplémentaires pour le profil
  avatar?: string;        // ← AJOUTÉ
  address?: string;       // ← AJOUTÉ
  siret?: string;         // ← AJOUTÉ
  bio?: string;           // ← AJOUTÉ
  createdAt?: string;     // ← AJOUTÉ
}

export type MissionStatus = 
  | 'En attente'
  | 'Devis reçus'
  | 'Confirmée'
  | 'Payée'
  | 'En cours'      // Ajoutez ce statut
  | 'Livrée'
  | 'Annulée';
export interface Quote {
  id: string;
  missionId: string;
  driverId: string;
  price: number;
  estimatedTime: string;
  message?: string;
  createdAt: string;
}

export interface Mission {
  id: string;
  entrepriseId: string;
  merchandiseType: string;
  weightVolume: string;
  departure: string;
  destination: string;
  desiredDate: string;
  note?: string;
  status: MissionStatus;
  createdAt: string;
  acceptedQuoteId?: string | null;
  driverId?: string | null;
}

export interface Rating {
  id: string;
  missionId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  comment: string;
  createdAt: string;
}