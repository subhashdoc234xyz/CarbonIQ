-- CarbonIQ Supabase schema
-- Run this file in Supabase Dashboard -> SQL Editor -> New query.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  facility text,
  role text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.emission_factors (
  id uuid primary key default gen_random_uuid(),
  factor_name text not null,
  geography text,
  geography_type text,
  value numeric(18, 8) not null check (value >= 0),
  unit text not null,
  scope text check (scope in ('Scope 1', 'Scope 2', 'Scope 3')),
  sector text,
  source_document text,
  source_url text,
  reference_year text,
  methodology text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists emission_factors_sector_scope_idx
  on public.emission_factors (sector, scope);
create index if not exists emission_factors_name_idx
  on public.emission_factors (factor_name);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  emission_factor_id uuid references public.emission_factors(id) on delete set null,
  source_type text not null,
  activity_value numeric(18, 4) not null check (activity_value >= 0),
  unit text not null,
  factor_value numeric(18, 8) not null check (factor_value >= 0),
  calculated_emissions_kg numeric(18, 4) generated always as
    (round((activity_value * factor_value)::numeric, 4)) stored,
  scope text not null check (scope in ('Scope 1', 'Scope 2', 'Scope 3')),
  notes text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists activity_logs_user_occurred_idx
  on public.activity_logs (user_id, occurred_at desc);

create table if not exists public.reduction_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  action_name text not null,
  description text,
  category text,
  cost numeric(18, 2) not null check (cost >= 0),
  co2_saved_tons_per_year numeric(18, 4) not null check (co2_saved_tons_per_year >= 0),
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reduction_actions_user_active_idx
  on public.reduction_actions (user_id, is_active);

create table if not exists public.budget_optimizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  budget_amount numeric(18, 2) not null check (budget_amount >= 0),
  total_cost_used numeric(18, 2) not null check (total_cost_used >= 0),
  total_co2_saved_tons numeric(18, 4) not null check (total_co2_saved_tons >= 0),
  efficiency_per_ton numeric(18, 4),
  solver_status text,
  created_at timestamptz not null default now(),
  check (total_cost_used <= budget_amount)
);

create table if not exists public.budget_optimization_actions (
  optimization_id uuid not null references public.budget_optimizations(id) on delete cascade,
  action_id uuid not null references public.reduction_actions(id) on delete restrict,
  cost_at_run numeric(18, 2) not null check (cost_at_run >= 0),
  co2_saved_tons_at_run numeric(18, 4) not null check (co2_saved_tons_at_run >= 0),
  primary key (optimization_id, action_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists emission_factors_set_updated_at on public.emission_factors;
create trigger emission_factors_set_updated_at before update on public.emission_factors
for each row execute function public.set_updated_at();

drop trigger if exists reduction_actions_set_updated_at on public.reduction_actions;
create trigger reduction_actions_set_updated_at before update on public.reduction_actions
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.emission_factors enable row level security;
alter table public.activity_logs enable row level security;
alter table public.reduction_actions enable row level security;
alter table public.budget_optimizations enable row level security;
alter table public.budget_optimization_actions enable row level security;

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Authenticated users read emission factors" on public.emission_factors;
create policy "Authenticated users read emission factors" on public.emission_factors
  for select to authenticated using (true);

drop policy if exists "Users manage own activity logs" on public.activity_logs;
create policy "Users manage own activity logs" on public.activity_logs
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own reduction actions" on public.reduction_actions;
create policy "Users manage own reduction actions" on public.reduction_actions
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users manage own optimization runs" on public.budget_optimizations;
create policy "Users manage own optimization runs" on public.budget_optimizations
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users read actions from own optimization runs" on public.budget_optimization_actions;
create policy "Users read actions from own optimization runs" on public.budget_optimization_actions
  for select to authenticated using (
    exists (
      select 1 from public.budget_optimizations run
      where run.id = optimization_id and run.user_id = auth.uid()
    )
  );

drop policy if exists "Users add actions to own optimization runs" on public.budget_optimization_actions;
create policy "Users add actions to own optimization runs" on public.budget_optimization_actions
  for insert to authenticated with check (
    exists (
      select 1 from public.budget_optimizations run
      where run.id = optimization_id and run.user_id = auth.uid()
    )
  );

drop policy if exists "Users delete actions from own optimization runs" on public.budget_optimization_actions;
create policy "Users delete actions from own optimization runs" on public.budget_optimization_actions
  for delete to authenticated using (
    exists (
      select 1 from public.budget_optimizations run
      where run.id = optimization_id and run.user_id = auth.uid()
    )
  );

-- The service-role key bypasses RLS and is intended for src/seed_emission_factors.py.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in the React client.
