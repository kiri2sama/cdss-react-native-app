// Type definitions for CDSS app

export type UserRole = 'clinical_pharmacist' | 'doctor' | 'pharmacy_staff' | 'admin';

export type CaseStatus = 'pending_pharmacist' | 'pending_doctor' | 'approved' | 'rejected' | 'more_info_needed';

export type DRPCategory =
  | 'dose_selection'
  | 'contraindication'
  | 'drug_interaction'
  | 'food_interaction'
  | 'adverse_reaction'
  | 'therapeutic_duplication'
  | 'drug_allergy'
  | 'incorrect_drug'
  | 'untreated_indication'
  | 'improper_administration'
  | 'monitoring_required'
  | 'cost_effectiveness'
  | 'patient_compliance'
  | 'renal_adjustment'
  | 'hepatic_adjustment';

export interface User {
  id: string;
  email: string;
  role: 'pharmacist' | 'doctor';
  name: string;
}

export interface PatientCase {
  id: string;
  fileNo: string;
  patientName: string;
  age: number;
  gender: 'male' | 'female';
  medicalConditions: string[];
  allergies: string[];
  currentMedications: string[];
  primaryPhysician: string;
  primaryPhysicianId?: string;
  admissionDate: string;
  status: CaseStatus;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface MedicationRecommendation {
  id: string;
  caseId: string;
  pharmacistId: string;
  pharmacistName: string;
  drpCategories: DRPCategory[];
  advice: string;
  justification: string;
  cdssAlerts: CDSSAlert[];
  state: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7' | 'S8';
  pharmacistSignature?: string;
  pharmacistSignatureDate?: string;
  doctorReview?: DoctorReview;
  createdAt: string;
  updatedAt: string;
}

export interface CDSSAlert {
  id: string;
  type: 'drug_interaction' | 'renal_adjustment' | 'contraindication' | 'allergy' | 'dose_warning';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
}

export interface DoctorReview {
  doctorId: string;
  doctorName: string;
  decision: 'approved' | 'rejected' | 'more_info_needed';
  comments?: string;
  doctorSignature?: string;
  reviewDate: string;
}

export interface PrescriptionOrder {
  date: string;
  time: string;
  instructions: string;
  doctorSignature: string;
}

export interface DigitalSignature {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  signatureData: string; // Base64 encoded signature image
  timestamp: string;
  caseId: string;
  recommendationId?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  conditions: string[];
  allergies: string[];
  medications: Medication[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface DRP {
  id: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface Evaluation {
  id: string;
  patientId: string;
  pharmacistId: string;
  drps: DRP[];
  clinicalAdvice: string;
  justification: string;
  status: 'pending_doctor' | 'approved' | 'rejected' | 'request_info';
  createdAt: Date;
}

export interface Review {
  id: string;
  evaluationId: string;
  doctorId: string;
  decision: 'approve' | 'reject' | 'request_info';
  comments: string;
  signature?: string;
  createdAt: Date;
}

export interface Alert {
  id: string;
  type: 'drug_interaction' | 'contraindication' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
}