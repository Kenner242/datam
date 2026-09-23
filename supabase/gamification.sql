-- Sistema de juego formal: XP, rachas, logros por módulo y trofeos por curso.
-- "badges" sigue siendo el certificado verificado de curso completo; esto es una capa de motivación aparte.
create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  xp_awarded int not null,
  bloom_level text,
  created_at timestamptz not null default now()
);

create table if not exists public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  module_index int not null,
  earned_at timestamptz not null default now(),
  unique (user_id, course_slug, module_index)
);

-- Trofeo por aprobar el examen final de un curso; el certificado PDF sigue siendo el logro verificable.
create table if not exists public.trophies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.xp_events enable row level security;
alter table public.streaks enable row level security;
alter table public.achievements enable row level security;
alter table public.trophies enable row level security;

drop policy if exists "xp_events_owner" on public.xp_events;
create policy "xp_events_owner" on public.xp_events for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "streaks_owner" on public.streaks;
create policy "streaks_owner" on public.streaks for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "achievements_owner" on public.achievements;
create policy "achievements_owner" on public.achievements for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "trophies_owner" on public.trophies;
create policy "trophies_owner" on public.trophies for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on public.xp_events from anon;
revoke all on public.streaks from anon;
revoke all on public.achievements from anon;
revoke all on public.trophies from anon;

-- Tabla de posiciones opcional: el estudiante decide si aparece y con qué nombre (opt-in explícito, nunca por defecto).
alter table if exists public.profiles
  add column if not exists leaderboard_opt_in boolean not null default false,
  add column if not exists leaderboard_display_name text;

-- La vista se ejecuta con privilegios del propietario (no invoker) para poder sumar xp_events de todos los
-- usuarios sin exponer RLS por fila; solo expone agregados de quienes activaron leaderboard_opt_in.
create or replace view public.leaderboard_view
with (security_invoker = false) as
select
  p.id as user_id,
  coalesce(p.leaderboard_display_name, 'Anónimo') as display_name,
  p.region,
  coalesce(sum(x.xp_awarded), 0)::int as xp_total
from public.profiles p
join public.xp_events x on x.user_id = p.id
where p.leaderboard_opt_in = true
group by p.id, p.leaderboard_display_name, p.region;

grant select on public.leaderboard_view to authenticated;
