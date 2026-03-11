-- Beacon Organizational Hierarchy Extension
-- Run this in your Supabase SQL editor to add hierarchy support

-- Add hierarchy fields to clients table
alter table public.clients add column if not exists hierarchy_levels jsonb default '["division", "business_unit", "project"]';

-- Add hierarchy fields to employees table
alter table public.employees add column if not exists division text;
alter table public.employees add column if not exists business_unit text;
alter table public.employees add column if not exists project text;
alter table public.employees add column if not exists department text;
alter table public.employees add column if not exists manager_id uuid references public.employees(id);

-- Create a view for aggregated responses by hierarchy level
create or replace view public.hierarchy_aggregates as
select 
  r.client_id,
  e.division,
  e.business_unit,
  e.project,
  e.department,
  count(r.id) as response_count,
  avg(r.sentiment_5) as sentiment_avg,
  avg(r.clarity_5) as clarity_avg,
  avg(r.workload_5) as workload_avg,
  avg(r.safety_5) as safety_avg,
  avg(r.leadership_5) as leadership_avg,
  -- Calculate overall wellbeing score: Sentiment 30%, Workload 25%, Leadership 25%, Safety 20%
  (avg(r.sentiment_5) * 0.30 + avg(r.workload_5) * 0.25 + avg(r.leadership_5) * 0.25 + avg(r.safety_5) * 0.20) * 20 as wellbeing_score,
  max(r.submitted_at) as last_response_at
from public.responses_v3 r
left join public.employees e on r.employee_id = e.id
group by r.client_id, e.division, e.business_unit, e.project, e.department;

-- Grant access to the view
grant select on public.hierarchy_aggregates to authenticated, anon;

-- Create indexes for performance
create index if not exists idx_employees_division on public.employees(division);
create index if not exists idx_employees_business_unit on public.employees(business_unit);
create index if not exists idx_employees_project on public.employees(project);
create index if not exists idx_employees_department on public.employees(department);

