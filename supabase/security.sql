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

-- Evaluacion final y proyecto: ambos son requisitos para emitir un certificado.
create table if not exists public.exam_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  score integer not null check (score >= 0 and score <= 100),
  passed boolean not null,
  submitted_at timestamptz not null default now()
);

create index if not exists exam_attempts_user_course_submitted_idx
on public.exam_attempts (user_id, course_slug, submitted_at desc);

alter table public.exam_attempts enable row level security;
drop policy if exists "exam_attempts_own_rows" on public.exam_attempts;
create policy "exam_attempts_own_rows"
on public.exam_attempts for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "exam_attempts_own_insert" on public.exam_attempts;
create policy "exam_attempts_own_insert"
on public.exam_attempts for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "exam_attempts_admin_read" on public.exam_attempts;
create policy "exam_attempts_admin_read"
on public.exam_attempts for select
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.project_submissions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  project_url text not null check (char_length(project_url) <= 2048),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes_requested')),
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.project_submissions enable row level security;
drop policy if exists "project_submissions_own_read" on public.project_submissions;
create policy "project_submissions_own_read"
on public.project_submissions for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "project_submissions_own_insert" on public.project_submissions;
create policy "project_submissions_own_insert"
on public.project_submissions for insert
to authenticated
with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "project_submissions_own_update" on public.project_submissions;
create policy "project_submissions_own_update"
on public.project_submissions for update
to authenticated
using (user_id = auth.uid() and status in ('pending', 'changes_requested'))
with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "project_submissions_admin_all" on public.project_submissions;
create policy "project_submissions_admin_all"
on public.project_submissions for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

revoke all on public.exam_attempts from anon;
revoke all on public.project_submissions from anon;
