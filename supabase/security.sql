-- DataM: seguridad base para ejecutar en Supabase SQL Editor.
-- Ejecuta este archivo despues de confirmar que las tablas public.users y
-- public.courses existen. Nunca incluyas una service_role key en Next.js.

alter table public.users enable row level security;
alter table public.courses enable row level security;

-- Los cursos pueden leerse desde la plataforma, pero solo un administrador
-- puede crearlos, modificarlos o eliminarlos.
drop policy if exists "courses_public_read" on public.courses;
create policy "courses_public_read"
on public.courses for select
to anon, authenticated
using (true);

drop policy if exists "courses_admin_write" on public.courses;
create policy "courses_admin_write"
on public.courses for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Cada estudiante solo puede consultar o editar su propio perfil.
drop policy if exists "users_own_profile_read" on public.users;
create policy "users_own_profile_read"
on public.users for select
to authenticated
using (auth_user_id = auth.uid());

drop policy if exists "users_own_profile_update" on public.users;
create policy "users_own_profile_update"
on public.users for update
to authenticated
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists "users_admin_all" on public.users;
create policy "users_admin_all"
on public.users for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- El progreso y los certificados deben pertenecer siempre al usuario autenticado.
create table if not exists public.progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  unique (user_id, course_slug, lesson_id)
);

alter table public.progress enable row level security;
drop policy if exists "progress_own_rows" on public.progress;
create policy "progress_own_rows"
on public.progress for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create table if not exists public.certificates (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  issued_at timestamptz not null default now(),
  certificate_url text,
  unique (user_id, course_slug)
);

alter table public.certificates enable row level security;
drop policy if exists "certificates_own_read" on public.certificates;
create policy "certificates_own_read"
on public.certificates for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "certificates_admin_all" on public.certificates;
create policy "certificates_admin_all"
on public.certificates for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- No expongas el correo o nombre de otros estudiantes mediante una API publica.
revoke all on public.users from anon;
revoke all on public.progress from anon;
revoke all on public.certificates from anon;

create table if not exists public.enrollments (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.enrollments enable row level security;
drop policy if exists "enrollments_own_rows" on public.enrollments;
create policy "enrollments_own_rows"
on public.enrollments for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "enrollments_admin_read" on public.enrollments;
create policy "enrollments_admin_read"
on public.enrollments for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

revoke all on public.enrollments from anon;
