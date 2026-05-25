-- Consultas del formulario de contacto (ejecutar en Supabase SQL Editor)
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  clinic text,
  email text not null,
  phone text,
  service_interest text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Solo admins leen; las inserciones las hace el servidor con service role
drop policy if exists "admins read contact submissions" on public.contact_submissions;
create policy "admins read contact submissions" on public.contact_submissions
for select using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
