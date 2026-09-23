-- Flashcards estilo Quizlet por tema. Extiende el esquema existente sin reemplazarlo.
create table if not exists public.flashcard_sets (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  module_index int not null,
  lesson_index int not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_slug, module_index, lesson_index)
);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.flashcard_sets(id) on delete cascade,
  term text not null,
  definition text not null,
  sort_order int not null
);

create table if not exists public.flashcard_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id uuid not null references public.flashcards(id) on delete cascade,
  confidence text not null check (confidence in ('aprendiendo','dominado')) default 'aprendiendo',
  last_reviewed_at timestamptz not null default now(),
  primary key (user_id, flashcard_id)
);

create table if not exists public.flashcard_match_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  set_id uuid not null references public.flashcard_sets(id) on delete cascade,
  best_time_ms int not null,
  achieved_at timestamptz not null default now(),
  primary key (user_id, set_id)
);

alter table public.flashcard_sets enable row level security;
alter table public.flashcards enable row level security;
alter table public.flashcard_progress enable row level security;
alter table public.flashcard_match_scores enable row level security;

-- Estudiantes solo ven sets/tarjetas publicados; admins gestionan todo.
drop policy if exists "flashcard_sets_public_read" on public.flashcard_sets;
create policy "flashcard_sets_public_read" on public.flashcard_sets for select to anon, authenticated using (published = true);
drop policy if exists "flashcard_sets_admin_write" on public.flashcard_sets;
create policy "flashcard_sets_admin_write" on public.flashcard_sets for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "flashcards_public_read" on public.flashcards;
create policy "flashcards_public_read" on public.flashcards for select to anon, authenticated
using (exists (select 1 from public.flashcard_sets s where s.id = flashcards.set_id and s.published = true));
drop policy if exists "flashcards_admin_write" on public.flashcards;
create policy "flashcards_admin_write" on public.flashcards for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Cada usuario solo ve/edita su propio progreso.
drop policy if exists "flashcard_progress_owner" on public.flashcard_progress;
create policy "flashcard_progress_owner" on public.flashcard_progress for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "flashcard_match_scores_owner" on public.flashcard_match_scores;
create policy "flashcard_match_scores_owner" on public.flashcard_match_scores for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
