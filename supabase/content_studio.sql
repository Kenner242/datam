-- Content Studio: IA generates drafts; students only read reviewed materials.
create table if not exists public.lesson_generated_content (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  module_index integer not null,
  lesson_index integer not null,
  type text not null check (type in ('slides','mindmap','flashcards','summary')),
  content jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  reviewed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_slug, module_index, lesson_index, type)
);

alter table public.lesson_generated_content enable row level security;
drop policy if exists "generated_content_reviewed_read" on public.lesson_generated_content;
create policy "generated_content_reviewed_read" on public.lesson_generated_content for select to anon, authenticated using (reviewed = true);
drop policy if exists "generated_content_admin_write" on public.lesson_generated_content;
create policy "generated_content_admin_write" on public.lesson_generated_content for all to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
revoke all on public.lesson_generated_content from anon;
grant select on public.lesson_generated_content to anon, authenticated;
