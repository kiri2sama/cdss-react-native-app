export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: 'pharmacist' | 'doctor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: 'pharmacist' | 'doctor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: 'pharmacist' | 'doctor'
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          name: string
          age: number
          conditions: string[]
          allergies: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          conditions: string[]
          allergies: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          conditions?: string[]
          allergies?: string[]
          created_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          patient_id: string
          name: string
          dosage: string
          frequency: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          name: string
          dosage: string
          frequency: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          dosage?: string
          frequency?: string
          created_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          patient_id: string
          pharmacist_id: string
          drps: Json
          clinical_advice: string
          justification: string
          status: 'pending_doctor' | 'approved' | 'rejected' | 'request_info'
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          pharmacist_id: string
          drps: Json
          clinical_advice: string
          justification: string
          status?: 'pending_doctor' | 'approved' | 'rejected' | 'request_info'
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          pharmacist_id?: string
          drps?: Json
          clinical_advice?: string
          justification?: string
          status?: 'pending_doctor' | 'approved' | 'rejected' | 'request_info'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          evaluation_id: string
          doctor_id: string
          decision: 'approve' | 'reject' | 'request_info'
          comments: string
          signature: string | null
          created_at: string
        }
        Insert: {
          id?: string
          evaluation_id: string
          doctor_id: string
          decision: 'approve' | 'reject' | 'request_info'
          comments: string
          signature?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          evaluation_id?: string
          doctor_id?: string
          decision?: 'approve' | 'reject' | 'request_info'
          comments?: string
          signature?: string | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          patient_id: string
          type: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          message: string
          recommendations: string[]
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          type: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          message: string
          recommendations: string[]
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          type?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          message?: string
          recommendations?: string[]
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}