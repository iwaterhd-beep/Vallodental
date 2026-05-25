create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  key text not null,
  label text not null,
  type text not null default 'text',
  draft_value jsonb,
  published_value jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique(section, key)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_url text,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt text not null default '',
  url text not null,
  path text,
  bucket text not null default 'site-media',
  kind text not null default 'image',
  gallery_group text not null default 'general',
  is_featured boolean not null default false,
  sort_order int not null default 99,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_groups (
  id text primary key,
  label text not null,
  sort_order int not null default 99,
  layout text not null default 'normal',
  created_at timestamptz not null default now()
);

create table if not exists public.change_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_label text not null,
  action text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.content_entries enable row level security;
alter table public.services enable row level security;
alter table public.media_assets enable row level security;
alter table public.gallery_groups enable row level security;
alter table public.change_logs enable row level security;

drop policy if exists "admins read admin users" on public.admin_users;
create policy "admins read admin users" on public.admin_users
for select using (auth.uid() = user_id);

drop policy if exists "public read published content" on public.content_entries;
create policy "public read published content" on public.content_entries
for select using (true);

drop policy if exists "admins manage content" on public.content_entries;
create policy "admins manage content" on public.content_entries
for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services
for select using (true);

drop policy if exists "admins manage services" on public.services;
create policy "admins manage services" on public.services
for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "public read media" on public.media_assets;
create policy "public read media" on public.media_assets
for select using (true);

drop policy if exists "admins manage media" on public.media_assets;
create policy "admins manage media" on public.media_assets
for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "public read gallery groups" on public.gallery_groups;
create policy "public read gallery groups" on public.gallery_groups
for select using (true);

drop policy if exists "admins manage gallery groups" on public.gallery_groups;
create policy "admins manage gallery groups" on public.gallery_groups
for all using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "admins read logs" on public.change_logs;
create policy "admins read logs" on public.change_logs
for select using (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

drop policy if exists "admins insert logs" on public.change_logs;
create policy "admins insert logs" on public.change_logs
for insert with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid()));

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public read site media" on storage.objects;
create policy "public read site media" on storage.objects
for select using (bucket_id = 'site-media');

drop policy if exists "admins manage site media" on storage.objects;
create policy "admins manage site media" on storage.objects
for all using (
  bucket_id = 'site-media'
  and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'site-media'
  and exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

insert into public.content_entries (section, key, label, type, draft_value, published_value, sort_order, published_at)
values
('brand','name','Nombre de marca','text','"Alfredo Vallo Dental"','"Alfredo Vallo Dental"',1,now()),
('brand','tagline','Subtítulo de marca','text','"Laboratorio dental · Implantes"','"Laboratorio dental · Implantes"',2,now()),
('nav','cta','CTA navegación','text','"Consultar"','"Consultar"',3,now()),
('nav','services','Nav servicios','text','"Servicios"','"Servicios"',4,now()),
('nav','technology','Nav tecnología','text','"Tecnología"','"Tecnología"',5,now()),
('nav','work','Nav trabajos','text','"Trabajos"','"Trabajos"',6,now()),
('nav','contact','Nav contacto','text','"Contacto"','"Contacto"',7,now()),
('seo','title','Título SEO','text','"Alfredo Vallo Dental — Laboratorio Dental Sevilla"','"Alfredo Vallo Dental — Laboratorio Dental Sevilla"',4,now()),
('seo','description','Descripción SEO','textarea','"Laboratorio dental especializado en prótesis, implantes, CAD 3D e inteligencia artificial en Sevilla."','"Laboratorio dental especializado en prótesis, implantes, CAD 3D e inteligencia artificial en Sevilla."',5,now()),
('hero','eyebrow','Hero eyebrow','text','"Laboratorio dental especializado"','"Laboratorio dental especializado"',10,now()),
('hero','title','Hero título','richtext','"Pequeños detalles,<br><em>grandes sonrisas.</em>"','"Pequeños detalles,<br><em>grandes sonrisas.</em>"',11,now()),
('hero','subtitle','Hero subtítulo','textarea','"Fusionamos técnicas analógicas clásicas con diseño biofuncional CAD 3D e Inteligencia Artificial. Prótesis de precisión excepcional, creadas en Sevilla."','"Fusionamos técnicas analógicas clásicas con diseño biofuncional CAD 3D e Inteligencia Artificial. Prótesis de precisión excepcional, creadas en Sevilla."',12,now()),
('hero','primary_button','Botón primario','text','"Ver trabajos"','"Ver trabajos"',13,now()),
('hero','secondary_button','Botón secundario','text','"Contactar"','"Contactar"',14,now()),
('hero','image','Imagen hero','image','"https://static.wixstatic.com/media/aca030_c3d4df8430f040f9a2e65c4b80077a66~mv2.jpg"','"https://static.wixstatic.com/media/aca030_c3d4df8430f040f9a2e65c4b80077a66~mv2.jpg"',15,now()),
('hero','image_alt','Alt hero','text','"Laboratorio Alfredo Vallo Dental — trabajo de prótesis"','"Laboratorio Alfredo Vallo Dental — trabajo de prótesis"',16,now()),
('stats','1_number','Estadística 1 número','text','"+20"','"+20"',20,now()),
('stats','1_label','Estadística 1 texto','text','"Años de experiencia"','"Años de experiencia"',21,now()),
('stats','2_number','Estadística 2 número','text','"100%"','"100%"',22,now()),
('stats','2_label','Estadística 2 texto','text','"Imágenes reales, sin filtros"','"Imágenes reales, sin filtros"',23,now()),
('stats','3_number','Estadística 3 número','text','"CAD-CAM · IA"','"CAD-CAM · IA"',24,now()),
('stats','3_label','Estadística 3 texto','text','"Tecnología de vanguardia"','"Tecnología de vanguardia"',25,now()),
('services','eyebrow','Servicios eyebrow','text','"Nuestras soluciones"','"Nuestras soluciones"',30,now()),
('services','title','Servicios título','richtext','"¿En qué podemos<br><em>ayudarte?</em>"','"¿En qué podemos<br><em>ayudarte?</em>"',31,now()),
('services','link','Servicios enlace','text','"Consultar sin compromiso"','"Consultar sin compromiso"',32,now()),
('marquee','enabled','Activar marquesina','boolean','true','true',40,now()),
('marquee','items','Items marquesina separados por coma','textarea','"Laboratorio dental, Prótesis fija, Óxido de circonio, Metal-cerámica, Diseño CAD 3D, Inteligencia artificial, Implantes, Cursos y formaciones, Estética dental, Laboratorio Sevilla"','"Laboratorio dental, Prótesis fija, Óxido de circonio, Metal-cerámica, Diseño CAD 3D, Inteligencia artificial, Implantes, Cursos y formaciones, Estética dental, Laboratorio Sevilla"',41,now()),
('tech','quote','Cita tecnología','richtext','"Trabajo real,<br>precisión visible.<br><em>Cada pieza cuenta.</em>"','"Trabajo real,<br>precisión visible.<br><em>Cada pieza cuenta.</em>"',50,now()),
('tech','body','Texto tecnología','textarea','"Todas las imágenes que ves en esta web corresponden a trabajos realizados en nuestro laboratorio. No usamos bancos de imágenes ni resultados ficticios: mostramos casos reales, acabados reales y el nivel de detalle que entregamos a cada clínica."','"Todas las imágenes que ves en esta web corresponden a trabajos realizados en nuestro laboratorio. No usamos bancos de imágenes ni resultados ficticios: mostramos casos reales, acabados reales y el nivel de detalle que entregamos a cada clínica."',51,now()),
('tech','avatar','Iniciales firma','text','"AV"','"AV"',52,now()),
('tech','name','Nombre firma','text','"Alfredo Vallo"','"Alfredo Vallo"',53,now()),
('tech','role','Cargo firma','text','"Protésico dental · Sevilla"','"Protésico dental · Sevilla"',54,now()),
('tech','pillar_1_title','Pilar 1 título','text','"Técnicas analógicas clásicas"','"Técnicas analógicas clásicas"',55,now()),
('tech','pillar_1_body','Pilar 1 texto','textarea','"La esencia del trabajo artesanal convive con tecnología de última generación para mejorar planificación, ajuste y precisión sin renunciar a la caracterización manual."','"La esencia del trabajo artesanal convive con tecnología de última generación para mejorar planificación, ajuste y precisión sin renunciar a la caracterización manual."',56,now()),
('tech','pillar_2_title','Pilar 2 título','text','"Diseño biofuncional CAD 3D"','"Diseño biofuncional CAD 3D"',57,now()),
('tech','pillar_2_body','Pilar 2 texto','textarea','"Integramos flujos digitales completos: escáner, software de diseño biofuncional y fresado de precisión en circonio, PMMA y resinas."','"Integramos flujos digitales completos: escáner, software de diseño biofuncional y fresado de precisión en circonio, PMMA y resinas."',58,now()),
('tech','pillar_3_title','Pilar 3 título','text','"Inteligencia artificial aplicada"','"Inteligencia artificial aplicada"',59,now()),
('tech','pillar_3_body','Pilar 3 texto','textarea','"La IA nos ayuda a analizar, comparar y optimizar flujos de trabajo para tomar decisiones más precisas en cada caso."','"La IA nos ayuda a analizar, comparar y optimizar flujos de trabajo para tomar decisiones más precisas en cada caso."',60,now()),
('tech','pillar_4_title','Pilar 4 título','text','"Criterio en cada material"','"Criterio en cada material"',61,now()),
('tech','pillar_4_body','Pilar 4 texto','textarea','"Metal-cerámica, circonio, disilicato, PMMA o resinas: cada caso necesita una indicación distinta según espacio, oclusión y objetivo."','"Metal-cerámica, circonio, disilicato, PMMA o resinas: cada caso necesita una indicación distinta según espacio, oclusión y objetivo."',62,now()),
('gallery','eyebrow','Galería eyebrow','text','"Nuestros trabajos"','"Nuestros trabajos"',70,now()),
('gallery','title','Galería título','richtext','"Imágenes reales,<br><em>sin filtros.</em>"','"Imágenes reales,<br><em>sin filtros.</em>"',71,now()),
('gallery','link','Galería enlace','text','"Ver más en Instagram"','"Ver más en Instagram"',72,now()),
('gallery','footer','Galería footer','text','"Cada imagen, un trabajo real de nuestro laboratorio."','"Cada imagen, un trabajo real de nuestro laboratorio."',73,now()),
('contact','eyebrow','Contacto eyebrow','text','"Hablemos"','"Hablemos"',80,now()),
('contact','title','Contacto título','richtext','"Un sinfín<br>de <em>soluciones.</em>"','"Un sinfín<br>de <em>soluciones.</em>"',81,now()),
('contact','subtitle','Contacto subtítulo','textarea','"Cuéntanos tu caso. Estaremos encantados de asesorarte sin compromiso sobre la mejor solución para tu clínica."','"Cuéntanos tu caso. Estaremos encantados de asesorarte sin compromiso sobre la mejor solución para tu clínica."',82,now()),
('contact','phone','Teléfono','text','"+34 655 232 333"','"+34 655 232 333"',83,now()),
('contact','phone_href','Teléfono sin espacios','text','"+34655232333"','"+34655232333"',84,now()),
('contact','whatsapp','WhatsApp','text','"https://wa.me/34655232333"','"https://wa.me/34655232333"',85,now()),
('contact','email','Email','text','"avrprotesicodental@gmail.com"','"avrprotesicodental@gmail.com"',86,now()),
('contact','address','Dirección','textarea','"C/ José de la Cámara, 4, local C\n41018 · Sevilla"','"C/ José de la Cámara, 4, local C\n41018 · Sevilla"',87,now()),
('contact','hours','Horario','text','"Lunes a viernes · 9:00 - 18:00"','"Lunes a viernes · 9:00 - 18:00"',88,now()),
('contact','form_eyebrow','Formulario eyebrow','text','"Formulario de contacto"','"Formulario de contacto"',89,now()),
('contact','submit','Texto botón formulario','text','"Enviar consulta →"','"Enviar consulta →"',90,now()),
('contact','note','Nota formulario','richtext','"Respuesta en menos<br>de 24 horas."','"Respuesta en menos<br>de 24 horas."',91,now()),
('contact','phone_label','Etiqueta teléfono','text','"Teléfono"','"Teléfono"',92,now()),
('contact','email_label','Etiqueta email','text','"Email"','"Email"',93,now()),
('contact','address_label','Etiqueta dirección','text','"Dirección"','"Dirección"',94,now()),
('contact','hours_label','Etiqueta horario','text','"Horario"','"Horario"',95,now()),
('social','instagram','Instagram URL','url','"https://www.instagram.com/alfredovallo/"','"https://www.instagram.com/alfredovallo/"',100,now()),
('social','instagram_handle','Instagram usuario','text','"alfredovallo"','"alfredovallo"',101,now()),
('social','linkedin','LinkedIn URL','url','"http://www.linkedin.com/in/alfredo-r-vallo-7aa45a155"','"http://www.linkedin.com/in/alfredo-r-vallo-7aa45a155"',102,now()),
('footer','copy','Copyright footer','text','"© 2026 Vallo Dental. Todos los derechos reservados."','"© 2026 Vallo Dental. Todos los derechos reservados."',110,now())
on conflict (section, key) do update set
label = excluded.label,
type = excluded.type,
draft_value = excluded.draft_value,
published_value = excluded.published_value,
sort_order = excluded.sort_order;

insert into public.services (title, description, icon_url, sort_order, is_published)
values
('Prótesis<br>fija','Coronas, puentes, carillas y restauraciones estéticas en metal-cerámica, circonio y disilicato. Ajuste preciso, caracterización personalizada y acabados naturales.','/assets/icono-protesis-fija.png',1,true),
('Diseño e<br>impresión 3D','Diseño CAD 3D, modelos, provisionales, férulas, guías y estructuras digitales. Flujo preciso para clínicas que buscan rapidez y control.','/assets/icono-diseno-3d.png',2,true),
('Implantes y<br>superestructuras','Coronas, puentes, barras y estructuras sobre implantes con planificación digital y control de ajuste.','/assets/icono-implantes.png',3,true),
('Cursos, colaboraciones<br>y formaciones','Formación práctica para estudiantes, técnicos y clínicas: estética, caracterización, digitalización y protocolos de laboratorio.','/assets/icono-retenedores.png',4,true)
on conflict do nothing;

insert into public.media_assets (title, alt, url, path, bucket, kind, gallery_group, is_featured, sort_order)
values
('Laboratorio','Laboratorio dental digital','/assets/lab-1.png',null,'public','image','laboratorio',true,1),
('Laboratorio 2','Laboratorio dental digital','/assets/lab-2.png',null,'public','image','laboratorio',false,2),
('Laboratorio 3','Laboratorio dental digital','/assets/lab-3.png',null,'public','image','laboratorio',false,3),
('Prótesis fija','Detalle de prótesis dental','/assets/protesis-1.png',null,'public','image','protesis',true,1),
('Prótesis fija 2','Detalle de prótesis dental','/assets/protesis-2.png',null,'public','image','protesis',false,2),
('Prótesis fija 3','Detalle de prótesis dental','/assets/protesis-3.png',null,'public','image','protesis',false,3),
('Diseño 3D','Diseño e impresión 3D dental','https://static.wixstatic.com/media/aca030_1546d01a94e94f3a8bf4ea0d0ed2d7b2~mv2.jpg',null,'external','image','diseno-3d',true,1),
('Estética dental','Trabajos de estética dental','https://static.wixstatic.com/media/aca030_7c5b259dce80487da7dd64ee897cb7ca~mv2.png',null,'external','image','estetica-dental',true,1)
on conflict do nothing;

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

-- Después de crear un usuario en Supabase Auth, conviértelo en admin:
-- insert into public.admin_users (user_id, full_name, role)
-- values ('UUID_DEL_USUARIO_AUTH', 'Alfredo Vallo', 'admin');
