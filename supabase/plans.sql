-- Fase 1 del modelo de negocio: planes y suscripciones.
-- Ejecutar una sola vez en el SQL Editor de Supabase.

alter table public.profiles
  add column if not exists plan text not null default 'free'
  check (plan in ('free', 'premium', 'institutional'));

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'premium', 'institutional')),
  status text not null default 'active' check (status in ('active', 'canceled', 'expired')),
  provider text,
  provider_reference text,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "Users read own subscriptions" on public.subscriptions;
create policy "Users read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Solicitudes de demostración institucional (Fase 1).
create table if not exists public.institution_requests (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  contact_name text not null,
  email text not null,
  students_count int,
  message text,
  created_at timestamptz not null default now()
);

alter table public.institution_requests enable row level security;

drop policy if exists "Anyone can request a demo" on public.institution_requests;
create policy "Anyone can request a demo"
  on public.institution_requests for insert
  with check (true);

-- Solicitudes de patrocinio educativo (DataM Impacto).
create table if not exists public.sponsorship_requests (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  contact_name text not null,
  email text not null,
  seats_count int,
  program text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.sponsorship_requests enable row level security;

drop policy if exists "Anyone can request sponsorship" on public.sponsorship_requests;
create policy "Anyone can request sponsorship"
  on public.sponsorship_requests for insert
  with check (true);
