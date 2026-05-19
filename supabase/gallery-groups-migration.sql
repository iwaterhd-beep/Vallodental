-- Apartados de la galería (ejecutar en Supabase SQL Editor)

create table if not exists public.gallery_groups (
  id text primary key,
  label text not null,
  sort_order int not null default 99,
  layout text not null default 'normal',
  created_at timestamptz not null default now()
);

alter table public.gallery_groups enable row level security;

drop policy if exists "public read gallery groups" on public.gallery_groups;
create policy "public read gallery groups" on public.gallery_groups
for select using (true);

drop policy if exists "admins manage gallery groups" on public.gallery_groups;
create policy "admins manage gallery groups" on public.gallery_groups
for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

insert into public.gallery_groups (id, label, sort_order, layout)
values
  ('laboratorio', 'Laboratorio', 1, 'tall'),
  ('protesis', 'Prótesis fija', 2, 'normal'),
  ('diseno-3d', 'Diseño 3D', 3, 'normal'),
  ('estetica-dental', 'Estética dental', 4, 'wide'),
  ('general', 'General', 99, 'normal')
on conflict (id) do update set
  label = excluded.label,
  sort_order = excluded.sort_order,
  layout = excluded.layout;

-- Reclasificar imágenes que estaban en "general"
update public.media_assets
set gallery_group = 'diseno-3d'
where title ilike '%diseño 3d%' or title ilike '%diseno 3d%';

update public.media_assets
set gallery_group = 'estetica-dental'
where title ilike '%estética dental%' or title ilike '%estetica dental%';
