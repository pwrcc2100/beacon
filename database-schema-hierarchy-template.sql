-- ============================================
-- Beacon Hierarchy Schema Template
-- ============================================
-- This creates the organizational hierarchy tables
-- Run this ONCE per Supabase project (not per client)
-- These tables are shared across all clients
-- ============================================

-- Divisions table (e.g., Regions, Business Units)
CREATE TABLE IF NOT EXISTS public.divisions (
  division_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  division_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, division_name) -- Prevent duplicate division names per client
);

-- Departments table (e.g., Functions, Programs)
CREATE TABLE IF NOT EXISTS public.departments (
  department_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id UUID NOT NULL REFERENCES public.divisions(division_id) ON DELETE CASCADE,
  department_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(division_id, department_name) -- Prevent duplicate department names per division
);

-- Teams table (e.g., Work Teams, Projects)
CREATE TABLE IF NOT EXISTS public.teams (
  team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(department_id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, team_name) -- Prevent duplicate team names per department
);

-- Add hierarchy columns to employees table if they don't exist
ALTER TABLE public.employees 
  ADD COLUMN IF NOT EXISTS division_id UUID REFERENCES public.divisions(division_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(department_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(team_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS employee_id UUID;

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_divisions_client_id ON public.divisions(client_id);
CREATE INDEX IF NOT EXISTS idx_divisions_active ON public.divisions(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_departments_division_id ON public.departments(division_id);
CREATE INDEX IF NOT EXISTS idx_departments_active ON public.departments(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON public.teams(department_id);
CREATE INDEX IF NOT EXISTS idx_teams_active ON public.teams(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_employees_division_id ON public.employees(division_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_team_id ON public.employees(team_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON public.employees(active) WHERE active = true;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
-- Enable RLS on hierarchy tables (if using RLS)
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Allow service role to access all (for admin operations)
CREATE POLICY IF NOT EXISTS "Service role can manage all divisions"
  ON public.divisions FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Service role can manage all departments"
  ON public.departments FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Service role can manage all teams"
  ON public.teams FOR ALL USING (true);

-- ============================================
-- Verification Query
-- ============================================
-- Run this after the migration to verify tables were created:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('divisions', 'departments', 'teams');

