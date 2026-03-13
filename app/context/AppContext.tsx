"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Mission, Quote, Rating, MissionStatus } from '../types';

interface AppContextType {
  user: User | null;
  login: (email: string, role?: string) => boolean;
  logout: () => void;
  register: (user: User) => void;
  users: User[];
  missions: Mission[];
  quotes: Quote[];
  ratings: Rating[];
  addMission: (mission: Omit<Mission, 'id' | 'createdAt' | 'status'>) => void;
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => void;
  acceptQuote: (missionId: string, quoteId: string) => void;
  updateMissionStatus: (missionId: string, status: MissionStatus) => void;
  deleteMission: (missionId: string) => void;
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
}

const mockUsers: User[] = [
  { id: 'e1', role: 'entreprise', name: 'Pharma Express', email: 'contact@pharma.bj', phone: '+229 90000001', companyName: 'Pharma Express Cotonou' },
  { id: 'e2', role: 'entreprise', name: 'BTP Matériaux', email: 'contact@btp.bj', phone: '+229 90000002', companyName: 'BTP Matériaux Parakou' },
  { id: 'e3', role: 'entreprise', name: 'Agro Commerce', email: 'contact@agro.bj', phone: '+229 90000003', companyName: 'Agro Commerce Bohicon' },
  { id: 'c1', role: 'chauffeur', name: 'Koffi Mensah', email: 'koffi@camion.bj', phone: '+229 90000004', truckType: 'Camion bâché', capacity: 5, zone: 'Cotonou', rating: 4.7 },
  { id: 'c2', role: 'chauffeur', name: 'Arouna Idrissou', email: 'arouna@camion.bj', phone: '+229 90000005', truckType: 'Camionnette', capacity: 2, zone: 'Parakou', rating: 4.4 },
  { id: 'c3', role: 'chauffeur', name: 'Jean-Pierre Dossou', email: 'jp@camion.bj', phone: '+229 90000006', truckType: 'Camion plateau', capacity: 10, zone: 'Cotonou', rating: 4.9 },
];

const mockMissions: Mission[] = [
  { id: 'm1', entrepriseId: 'e1', merchandiseType: 'Alimentaire', weightVolume: '2 tonnes', departure: 'Cotonou', destination: 'Porto-Novo', desiredDate: '2026-03-15T10:00', status: 'En attente', createdAt: new Date().toISOString() },
  { id: 'm2', entrepriseId: 'e2', merchandiseType: 'Matériaux de construction', weightVolume: '10 tonnes', departure: 'Parakou', destination: 'Djougou', desiredDate: '2026-03-16T08:00', status: 'Devis reçus', createdAt: new Date().toISOString() },
  { id: 'm3', entrepriseId: 'e3', merchandiseType: 'Autre', weightVolume: '5 tonnes', departure: 'Bohicon', destination: 'Cotonou', desiredDate: '2026-03-14T14:00', status: 'Confirmée', createdAt: new Date().toISOString(), acceptedQuoteId: 'q1', driverId: 'c1' },
  { id: 'm4', entrepriseId: 'e1', merchandiseType: 'Pièces détachées', weightVolume: '1 tonne', departure: 'Cotonou', destination: 'Abomey-Calavi', desiredDate: '2026-03-13T09:00', status: 'En cours', createdAt: new Date().toISOString(), acceptedQuoteId: 'q2', driverId: 'c2' },
  { id: 'm5', entrepriseId: 'e2', merchandiseType: 'Électroménager', weightVolume: '3 tonnes', departure: 'Parakou', destination: 'Kandi', desiredDate: '2026-03-10T11:00', status: 'Livrée', createdAt: new Date().toISOString(), acceptedQuoteId: 'q3', driverId: 'c3' },
];

const mockQuotes: Quote[] = [
  { id: 'q1', missionId: 'm3', driverId: 'c1', price: 45000, estimatedTime: '4 heures', message: 'Disponible immédiatement, camion en parfait état.', createdAt: new Date().toISOString() },
  { id: 'q2', missionId: 'm4', driverId: 'c2', price: 15000, estimatedTime: '1 heure', message: 'Je suis dans la zone, je peux m\'en charger rapidement.', createdAt: new Date().toISOString() },
  { id: 'q3', missionId: 'm5', driverId: 'c3', price: 85000, estimatedTime: '6 heures', message: 'Inclus l\'aide au chargement et déchargement.', createdAt: new Date().toISOString() },
  { id: 'q4', missionId: 'm2', driverId: 'c3', price: 120000, estimatedTime: '8 heures', message: 'Trajet direct sans arrêt, assurance marchandise incluse.', createdAt: new Date().toISOString() },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const login = (email: string, role?: string) => {
    const foundUser = users.find(u => u.email === email && (!role || u.role === role));
    if (foundUser) {
      setUser(foundUser);
      return true;
    } else {
      alert("Identifiants incorrects pour ce type de compte. Vérifiez l'email et le type de compte sélectionné.");
      return false;
    }
  };

  const logout = () => setUser(null);

  const register = (newUser: User) => {
    setUsers([...users, newUser]);
    setUser(newUser);
  };

  const addMission = (missionData: Omit<Mission, 'id' | 'createdAt' | 'status'>) => {
    const newMission: Mission = {
      ...missionData,
      id: `m${Date.now()}`,
      status: 'En attente',
      createdAt: new Date().toISOString(),
    };
    setMissions([newMission, ...missions]);
  };

  const addQuote = (quoteData: Omit<Quote, 'id' | 'createdAt'>) => {
    const newQuote: Quote = {
      ...quoteData,
      id: `q${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setQuotes([...quotes, newQuote]);
    
    // Update mission status if it was 'En attente'
    setMissions(missions.map(m => 
      m.id === quoteData.missionId && m.status === 'En attente' 
        ? { ...m, status: 'Devis reçus' } 
        : m
    ));
  };

  const acceptQuote = (missionId: string, quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    setMissions(missions.map(m => 
      m.id === missionId 
        ? { ...m, status: 'Confirmée', acceptedQuoteId: quoteId, driverId: quote.driverId } 
        : m
    ));
  };

  const updateMissionStatus = (missionId: string, status: MissionStatus) => {
    setMissions(missions.map(m => 
      m.id === missionId ? { ...m, status } : m
    ));
  };

  const deleteMission = (missionId: string) => {
    setMissions(missions.filter(m => m.id !== missionId));
    // Also delete associated quotes
    setQuotes(quotes.filter(q => q.missionId !== missionId));
  };

  const addRating = (ratingData: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...ratingData,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRatings([...ratings, newRating]);
    
    // Update driver rating
    if (ratingData.toUserId) {
      const driverRatings = [...ratings, newRating].filter(r => r.toUserId === ratingData.toUserId);
      const avgRating = driverRatings.reduce((acc, curr) => acc + curr.stars, 0) / driverRatings.length;
      setUsers(users.map(u => 
        u.id === ratingData.toUserId ? { ...u, rating: Number(avgRating.toFixed(1)) } : u
      ));
    }
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, register,
      users, missions, quotes, ratings,
      addMission, addQuote, acceptQuote, updateMissionStatus, deleteMission, addRating
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
