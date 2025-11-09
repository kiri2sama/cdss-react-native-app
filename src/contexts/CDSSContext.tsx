import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PatientCase, MedicationRecommendation } from '../types';
import { mockPatientCases, mockRecommendations } from '../data/mockData';
import { useAuth } from './AuthContext';

interface CDSSContextType {
  // Data
  patientCases: PatientCase[];
  recommendations: MedicationRecommendation[];
  addRecommendation: (recommendation: MedicationRecommendation) => void;
  updateCaseStatus: (caseId: string, status: PatientCase['status']) => void;
  getCase: (caseId: string) => PatientCase | undefined;
  getRecommendation: (caseId: string) => MedicationRecommendation | undefined;

  // Filtered data by user
  getUserCases: () => PatientCase[];
  getUserRecommendations: () => MedicationRecommendation[];
}

const CDSSContext = createContext<CDSSContextType | undefined>(undefined);

export function CDSSProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [patientCases, setPatientCases] = useState<PatientCase[]>(mockPatientCases);
  const [recommendations, setRecommendations] = useState<MedicationRecommendation[]>(mockRecommendations);

  const addRecommendation = (recommendation: MedicationRecommendation) => {
    setRecommendations(prev => [...prev, recommendation]);
    updateCaseStatus(recommendation.caseId, 'pending_doctor');
  };

  const updateCaseStatus = (caseId: string, status: PatientCase['status']) => {
    setPatientCases(prev =>
      prev.map(c => (c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );
  };

  const getCase = (caseId: string) => {
    return patientCases.find(c => c.id === caseId);
  };

  const getRecommendation = (caseId: string) => {
    return recommendations.find(r => r.caseId === caseId);
  };

  // Get cases relevant to the current user
  const getUserCases = () => {
    if (!user) return [];

    if (user.role === 'pharmacist') {
      // Pharmacists see cases pending their evaluation or cases they've worked on
      return patientCases.filter(c =>
        c.status === 'pending_pharmacist' ||
        recommendations.some(r => r.caseId === c.id && r.pharmacistId === user.id)
      );
    } else if (user.role === 'doctor') {
      // Doctors see cases pending their review or cases assigned to them
      return patientCases.filter(c =>
        c.status === 'pending_doctor' ||
        c.primaryPhysician === user.name ||
        c.primaryPhysician.includes(user.name.replace('Dr. ', ''))
      );
    }

    return patientCases;
  };

  // Get recommendations relevant to the current user
  const getUserRecommendations = () => {
    if (!user) return [];

    if (user.role === 'pharmacist') {
      return recommendations.filter(r => r.pharmacistId === user.id);
    } else if (user.role === 'doctor') {
      // Get recommendations for cases assigned to this doctor
      const doctorCases = getUserCases();
      return recommendations.filter(r =>
        doctorCases.some(c => c.id === r.caseId)
      );
    }

    return recommendations;
  };

  return (
    <CDSSContext.Provider
      value={{
        patientCases,
        recommendations,
        addRecommendation,
        updateCaseStatus,
        getCase,
        getRecommendation,
        getUserCases,
        getUserRecommendations,
      }}
    >
      {children}
    </CDSSContext.Provider>
  );
}

export function useCDSS() {
  const context = useContext(CDSSContext);
  if (context === undefined) {
    throw new Error('useCDSS must be used within a CDSSProvider');
  }
  return context;
}