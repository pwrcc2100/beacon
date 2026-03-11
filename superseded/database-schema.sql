-- Beacon Database Schema
-- Run this in your Supabase SQL editor

-- clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- employees (optional email for admins/notifications)
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  external_ref text,
  email text,
  team_id uuid,
  created_at timestamptz default now()
);

-- token lifecycle
create type token_status as enum ('issued','consumed','expired');

create table public.tokens (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  employee_id uuid references public.employees(id) on delete set null,
  valid_until timestamptz not null,
  status token_status not null default 'issued',
  channel text not null default 'web', -- 'web'|'sms'|'email'
  created_at timestamptz default now(),
  consumed_at timestamptz
);

-- responses v3 (3→5 mapping stored)
create table public.responses_v3 (
  id uuid primary key default gen_random_uuid(),
  token_id uuid not null references public.tokens(id),
  client_id uuid not null references public.clients(id),
  employee_id uuid references public.employees(id),

  sentiment_3 smallint,  sentiment_5 smallint,
  clarity_3 smallint,    clarity_5 smallint,
  workload_3 smallint,   workload_5 smallint,
  safety_3 smallint,     safety_5 smallint,
  leadership_3 smallint, leadership_5 smallint,

  comment_text text,
  meta jsonb default '{}',
  source text default 'beacon_v3',
  submitted_at timestamptz default now()
);

-- fast read model for dashboards
create materialized view public.wellbeing_responses as
select
  client_id,
  date_trunc('week', submitted_at) as wk,
  avg(sentiment_5)   as sentiment_avg,
  avg(clarity_5)     as clarity_avg,
  avg(workload_5)    as workload_avg,
  avg(safety_5)      as safety_avg,
  avg(leadership_5)  as leadership_avg
from public.responses_v3
group by 1,2;

-- Enable RLS
alter table public.clients        enable row level security;
alter table public.employees      enable row level security;
alter table public.tokens         enable row level security;
alter table public.responses_v3   enable row level security;

-- RLS Policies
-- service role bypasses RLS (server inserts/consumes)
-- admins are Supabase users with metadata: { role: 'admin', client_id: '<uuid>' }

create policy "admins read their client data" on public.responses_v3
for select using (
  auth.jwt() ->> 'role' = 'admin'
  and (auth.jwt() ->> 'client_id')::uuid = client_id
);

create policy "no direct writes by clients" on public.responses_v3
for insert to authenticated with check (false);

-- tokens readable only by service role (API server), so no select policy for authed users
create policy "no token reads" on public.tokens
for select using (false);

-- Create indexes for performance
create index idx_tokens_client_id on public.tokens(client_id);
create index idx_tokens_status on public.tokens(status);
create index idx_responses_client_id on public.responses_v3(client_id);
create index idx_responses_submitted_at on public.responses_v3(submitted_at);
create index idx_wellbeing_responses_client_wk on public.wellbeing_responses(client_id, wk);

