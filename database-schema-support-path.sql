-- Support Path Database Schema Updates
-- Run this in your Supabase SQL editor after running database-schema.sql

-- Add support request fields to responses_v3 table
ALTER TABLE public.responses_v3
ADD COLUMN IF NOT EXISTS support_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS support_contacts TEXT[],
ADD COLUMN IF NOT EXISTS support_contact_method TEXT,
ADD COLUMN IF NOT EXISTS support_contact_value TEXT,
ADD COLUMN IF NOT EXISTS support_timeframe TEXT,
ADD COLUMN IF NOT EXISTS support_other_details TEXT,
ADD COLUMN IF NOT EXISTS high_risk_flag BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS risk_factors TEXT[];

-- Create support_requests table
CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  response_id UUID REFERENCES public.responses_v3(id) ON DELETE CASCADE,
  
  contact_types TEXT[] NOT NULL, -- ['HR', 'EAP', etc.]
  contact_method TEXT NOT NULL,
  contact_value TEXT,
  preferred_timeframe TEXT NOT NULL,
  other_details TEXT,
  
  status TEXT NOT NULL DEFAULT 'pending', -- pending, assigned, contacted, resolved
  assigned_to TEXT,
  assigned_at TIMESTAMPTZ,
  contacted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for support_requests
CREATE INDEX IF NOT EXISTS idx_support_requests_client_id ON public.support_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON public.support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_response_id ON public.support_requests(response_id);
CREATE INDEX IF NOT EXISTS idx_responses_high_risk ON public.responses_v3(high_risk_flag);

-- Enable RLS on support_requests
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy for support_requests - admins can read their client's support requests
CREATE POLICY "admins read their client's support requests" ON public.support_requests
FOR SELECT USING (
  auth.jwt() ->> 'role' = 'admin'
  AND (auth.jwt() ->> 'client_id')::uuid = client_id
);

-- Helper function to automatically create support request when response has support_requested = true
CREATE OR REPLACE FUNCTION create_support_request_from_response()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.support_requested = TRUE AND NEW.support_contacts IS NOT NULL THEN
    INSERT INTO public.support_requests (
      client_id,
      employee_id,
      response_id,
      contact_types,
      contact_method,
      contact_value,
      preferred_timeframe,
      other_details,
      status
    ) VALUES (
      NEW.client_id,
      NEW.employee_id,
      NEW.id,
      NEW.support_contacts,
      NEW.support_contact_method,
      NEW.support_contact_value,
      NEW.support_timeframe,
      NEW.support_other_details,
      'pending'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create support request
DROP TRIGGER IF EXISTS trigger_create_support_request ON public.responses_v3;
CREATE TRIGGER trigger_create_support_request
AFTER INSERT ON public.responses_v3
FOR EACH ROW
WHEN (NEW.support_requested = TRUE)
EXECUTE FUNCTION create_support_request_from_response();


