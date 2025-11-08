export interface User {
  id: string;
  email: string;
  role: 'pharmacist' | 'doctor';
  name: string;
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