alter table public.media_assets
add column if not exists gallery_group text not null default 'general';

alter table public.media_assets
add column if not exists is_featured boolean not null default false;

alter table public.media_assets
add column if not exists sort_order int not null default 99;

update public.media_assets
set gallery_group = 'laboratorio',
    is_featured = case when title ilike 'Laboratorio%' then true else is_featured end,
    sort_order = 1
where title = 'Laboratorio' or url like '%lab-1%';

insert into public.media_assets (title, alt, url, path, bucket, kind, gallery_group, is_featured, sort_order)
values
('Laboratorio 2','Laboratorio dental digital','/assets/lab-2.png',null,'public','image','laboratorio',false,2),
('Laboratorio 3','Laboratorio dental digital','/assets/lab-3.png',null,'public','image','laboratorio',false,3),
('Prótesis fija 2','Detalle de prótesis dental','/assets/protesis-2.png',null,'public','image','protesis',false,2),
('Prótesis fija 3','Detalle de prótesis dental','/assets/protesis-3.png',null,'public','image','protesis',false,3),
('Prótesis fija 4','Detalle de prótesis dental','/assets/protesis-4.png',null,'public','image','protesis',false,4),
('Prótesis fija 5','Detalle de prótesis dental','/assets/protesis-5.png',null,'public','image','protesis',false,5),
('Prótesis fija 6','Detalle de prótesis dental','/assets/protesis-6.png',null,'public','image','protesis',false,6)
on conflict do nothing;

update public.media_assets
set gallery_group = 'protesis',
    is_featured = true,
    sort_order = 1
where title = 'Prótesis fija' or url like '%protesis-1%';

update public.media_assets
set gallery_group = 'diseno-3d',
    is_featured = true,
    sort_order = 1
where title = 'Diseño 3D';

update public.media_assets
set gallery_group = 'estetica-dental',
    is_featured = true,
    sort_order = 1
where title = 'Estética dental';
