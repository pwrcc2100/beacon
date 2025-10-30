-- Create divisions, departments, and teams tables
-- Run this in your Supabase SQL editor if these tables don't exist

-- Divisions table
CREATE TABLE IF NOT EXISTS public.divisions (
  division_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  division_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS public.departments (
  department_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  division_id UUID NOT NULL REFERENCES public.divisions(division_id) ON DELETE CASCADE,
  department_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  team_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(department_id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW retinopathy()
);

-- Add division_id, department_id, team_id to employees table if they don't exist
ALTER TABLE public.employees 
  ADD COLUMN IF NOT EXISTS division_id UUID REFERENCES public.divisions(division_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES public.departments(department_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(team_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS employee_id UUID;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_divisions_client_id ON public.divisions(client_id);
CREATE INDEX IF NOT EXISTS idx_departments_division_id ON public.departments(division_id);
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON public.teams(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_division_id ON public.employees(division_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_team_id ON public.employees(team_id);


