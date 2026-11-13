-- ============================================================================
-- ClinicalConnect Database Schema Definition
-- Architecture: PostgreSQL 14+
-- Module: Doctors, Authentication, Profiles, Licensing Verification & Badges
-- Note: Uses fictional demonstration test accounts only.
-- ============================================================================

-- Enable pgcrypto for UUID generation and cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. DOCTORS (Authentication & Security)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Specialist' 
        CHECK (role IN ('Specialist', 'Consultant', 'Surgeon', 'Physician', 'Resident', 'Radiologist', 'Emergency Doctor', 'Hospital Admin', 'Medical Moderator')),
    account_status VARCHAR(30) NOT NULL DEFAULT 'pending_verification'
        CHECK (account_status IN ('pending_verification', 'under_review', 'verified', 'suspended', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_doctors_email ON doctors (email);
CREATE INDEX IF NOT EXISTS idx_doctors_role ON doctors (role);
CREATE INDEX IF NOT EXISTS idx_doctors_status ON doctors (account_status);

-- ----------------------------------------------------------------------------
-- 2. DOCTOR PROFILES (Clinical Credentials & Identity)
-- Rule: Exactly ONE profile per doctor via UNIQUE constraint on doctor_id
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL UNIQUE REFERENCES doctors(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    title VARCHAR(80) NOT NULL DEFAULT 'MD',
    specialty VARCHAR(80) NOT NULL,
    subspecialty VARCHAR(150),
    hospital_affiliation VARCHAR(200) NOT NULL,
    department VARCHAR(150),
    experience_years INTEGER NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
    reputation_score INTEGER NOT NULL DEFAULT 0,
    accepted_diagnoses_count INTEGER NOT NULL DEFAULT 0,
    helpful_answers_count INTEGER NOT NULL DEFAULT 0,
    peer_endorsements_count INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    areas_of_expertise JSONB NOT NULL DEFAULT '[]'::jsonb,
    research_stats JSONB NOT NULL DEFAULT '{"publicationsCount": 0, "hIndex": 0}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_doctor_id ON doctor_profiles (doctor_id);
CREATE INDEX IF NOT EXISTS idx_profiles_specialty ON doctor_profiles (specialty);
CREATE INDEX IF NOT EXISTS idx_profiles_reputation ON doctor_profiles (reputation_score DESC);

-- ----------------------------------------------------------------------------
-- 3. VERIFICATIONS (Medical Licensing & Admin Approval Queue)
-- Rule: Governs medical board license checks and manual approval workflows
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL UNIQUE REFERENCES doctors(id) ON DELETE CASCADE,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    licensing_board VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    document_url TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_by UUID REFERENCES doctors(id),
    reviewed_at TIMESTAMPTZ,
    rejection_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_verifications_doctor_id ON verifications (doctor_id);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications (status);
CREATE INDEX IF NOT EXISTS idx_verifications_license ON verifications (license_number);

-- ----------------------------------------------------------------------------
-- 4. BADGES (Professional Recognition Catalog)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('verified', 'gold', 'silver', 'bronze')),
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. DOCTOR_BADGES (Awarded Credentials Mapping)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctor_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (doctor_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_doctor_badges_doctor_id ON doctor_badges (doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_badges_badge_id ON doctor_badges (badge_id);

-- ----------------------------------------------------------------------------
-- 6. AUDIT_LOGS (Append-Only Cryptographic Access & Action Ledger)
-- Rule: Protected against unauthorized modification or deletion
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    compliance_flag VARCHAR(50) NOT NULL DEFAULT 'LOGGED_RECORD',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_doctor_id ON audit_logs (doctor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- Trigger Function: Block UPDATE or DELETE on audit_logs to guarantee tamper-resistance
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit log entries are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();
