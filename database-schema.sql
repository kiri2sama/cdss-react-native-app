-- Database schema for CDSS app using Neon PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (for users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('pharmacist', 'doctor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    conditions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medications table
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    pharmacist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    drps JSONB DEFAULT '[]',
    clinical_advice TEXT NOT NULL,
    justification TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_doctor' CHECK (status IN ('pending_doctor', 'approved', 'rejected', 'request_info')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID REFERENCES evaluations(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    decision TEXT NOT NULL CHECK (decision IN ('approve', 'reject', 'request_info')),
    comments TEXT NOT NULL,
    signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    recommendations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_evaluations_patient_id ON evaluations(patient_id);
CREATE INDEX idx_evaluations_pharmacist_id ON evaluations(pharmacist_id);
CREATE INDEX idx_evaluations_status ON evaluations(status);
CREATE INDEX idx_reviews_evaluation_id ON reviews(evaluation_id);
CREATE INDEX idx_reviews_doctor_id ON reviews(doctor_id);
CREATE INDEX idx_alerts_patient_id ON alerts(patient_id);
CREATE INDEX idx_medications_patient_id ON medications(patient_id);

-- Row Level Security (RLS) policies (if needed)
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- etc.

-- Sample data (optional)
-- INSERT INTO profiles (name, role) VALUES ('Dr. Smith', 'doctor'), ('Pharmacist Jane', 'pharmacist');