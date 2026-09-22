-- DataM / Trampolin: extension of the existing learning model.
-- Run after security.sql in the Supabase SQL editor.

alter table if exists public.profiles
  add column if not exists region text,
  add column if not exists role text default 'estudiante';

alter table if exists public.courses
  add column if not exists categoria text,
  add column if not exists respaldado_por text,
  add column if not exists region_demanda text;

alter table if exists public.progress
  add column if not exists sincronizado_offline boolean not null default true,
  add column if not exists last_synced_at timestamptz default now();

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  fecha timestamptz not null default now(),
  puntaje integer not null check (puntaje between 0 and 100),
  habilidades text[] not null default '{}',
  unique (user_id, course_slug)
);

alter table public.badges enable row level security;
drop policy if exists "badges_own_read" on public.badges;
create policy "badges_own_read" on public.badges for select to authenticated using (user_id = auth.uid());
drop policy if exists "badges_own_insert" on public.badges;
create policy "badges_own_insert" on public.badges for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "badges_admin_all" on public.badges;
create policy "badges_admin_all" on public.badges for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.learning_activity (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  activity_date date not null default current_date,
  lessons_completed integer not null default 0,
  unique (user_id, activity_date)
);

alter table public.learning_activity enable row level security;
drop policy if exists "learning_activity_own_rows" on public.learning_activity;
create policy "learning_activity_own_rows" on public.learning_activity for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());

-- TODO(retos-reales): add a relation from completed skills to employer challenges later.
-- TODO(radar-empleabilidad): add a read-only employability projection by skill and region later.

create table if not exists public.course_lessons (
  id bigint generated always as identity primary key,
  course_slug text not null,
  module_id bigint references public.course_modules(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null,
  duration_minutes integer not null default 6 check (duration_minutes between 5 and 8),
  content text,
  transcript text,
  audio_url text,
  image_url text,
  quiz jsonb not null default '[]'::jsonb,
  unique (course_slug, module_id, position)
);

alter table public.course_lessons enable row level security;
drop policy if exists "course_lessons_public_read" on public.course_lessons;
create policy "course_lessons_public_read" on public.course_lessons for select to anon, authenticated using (true);
drop policy if exists "course_lessons_admin_write" on public.course_lessons;
create policy "course_lessons_admin_write" on public.course_lessons for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

revoke all on public.badges from anon;
revoke all on public.learning_activity from anon;
revoke all on public.course_lessons from anon;
grant select on public.course_lessons to anon, authenticated;
