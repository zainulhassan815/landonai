-- Contact form submissions. Public visitors (anon role) can INSERT only.
-- Read/update/delete is reserved for admins and is enforced once the
-- profiles.role = 'admin' flow lands; until then nothing else can read.

create table if not exists public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  name          text        not null,
  email         text        not null,
  message       text        not null,
  consultation  boolean     not null default false,
  user_agent    text,
  created_at    timestamptz not null default now(),

  constraint contact_submissions_name_length    check (char_length(name) between 2 and 80),
  constraint contact_submissions_email_length   check (char_length(email) between 3 and 254),
  constraint contact_submissions_message_length check (char_length(message) between 10 and 4000)
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

-- Anonymous and authenticated users can submit the form.
drop policy if exists "contact_submissions_insert_public"
  on public.contact_submissions;
create policy "contact_submissions_insert_public"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Reads are admin-only. The admin role check will be tightened once the
-- profiles table + role column exist; for now no policy grants SELECT,
-- so RLS blocks reads from anon/authenticated by default.
