-- DataM study sets MVP. Run after security.sql.
create table if not exists public.study_sets (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  module_id bigint references public.course_modules(id) on delete set null,
  lesson_id bigint references public.course_lessons(id) on delete set null,
  title text not null,
  description text,
  author_id uuid references auth.users(id) on delete set null,
  visibility text not null default 'private' check (visibility in ('private','public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.study_cards (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.study_sets(id) on delete cascade,
  term text not null,
  definition text not null,
  image_url text,
  audio_url text,
  position integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.study_card_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id uuid not null references public.study_cards(id) on delete cascade,
  box integer not null default 1 check (box between 1 and 5),
  repetitions integer not null default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  unique (user_id, card_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  set_id uuid not null references public.study_sets(id) on delete cascade,
  cards_reviewed integer not null default 0,
  xp_earned integer not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

alter table public.study_sets enable row level security;
alter table public.study_cards enable row level security;
alter table public.study_card_progress enable row level security;
alter table public.study_sessions enable row level security;

create policy "study_sets_public_or_owner_read" on public.study_sets for select to anon, authenticated using (visibility = 'public' or author_id = auth.uid());
create policy "study_sets_author_write" on public.study_sets for all to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "study_cards_visible_set_read" on public.study_cards for select to anon, authenticated using (exists (select 1 from public.study_sets s where s.id = set_id and (s.visibility = 'public' or s.author_id = auth.uid())));
create policy "study_cards_author_write" on public.study_cards for all to authenticated using (exists (select 1 from public.study_sets s where s.id = set_id and s.author_id = auth.uid())) with check (exists (select 1 from public.study_sets s where s.id = set_id and s.author_id = auth.uid()));
create policy "study_progress_own" on public.study_card_progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "study_sessions_own" on public.study_sessions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists study_sets_course_idx on public.study_sets(course_slug);
create index if not exists study_cards_set_position_idx on public.study_cards(set_id, position);
create index if not exists study_progress_due_idx on public.study_card_progress(user_id, next_review_at);
