-- Quick verification query to check how many demo records exist
-- Run this in Supabase SQL Editor

-- Replace YOUR_CLIENT_ID with your actual client_id (or remove the filter to see all)
-- Your client ID: 036802fb-215b-4a54-9d6e-9826043a6645

-- Count total responses for your client
SELECT 
  COUNT(*) as total_responses,
  COUNT(DISTINCT employee_id) as unique_employees
FROM public.responses_v3
WHERE client_id = '036802fb-215b-4a54-9d6e-9826043a6645'
  AND source = 'demo_seed_with_departments';

-- Check how many employees have division_id set
SELECT 
  COUNT(*) as employees_with_division,
  COUNT(*) FILTER (WHERE division_id IS NOT NULL) as has_division_id
FROM public.employees
WHERE client_id = '036802fb-215b-4a54-9d6e-9826043a664 community5';

-- Check responses by date (to see if period filter is the issue)
SELECT 
  DATE(submitted_at) as response_date,
  COUNT(*) as count
FROM public.responses_v3
WHERE client_id = '036802fb-215b-4a54-9d6e-9826043a6645'
  AND source = 'demo_seed_with_departments'
GROUP BY DATE(submitted_at)
ORDER BY response_date DESC
LIMIT 30;

-- Check if divisions exist
SELECT COUNT(*) as total_divisions
FROM public.divisions
WHERE client_id = '036802fb-215b-4a54-9d6e-9826043a6645';


