-- Páginas legales editables desde el admin (ejecutar en Supabase SQL Editor)

insert into public.content_entries (section, key, label, type, draft_value, published_value, sort_order, published_at)
values
('legal', 'aviso_title', 'Aviso legal — título', 'text', to_jsonb('Aviso legal'::text), to_jsonb('Aviso legal'::text), 120, now()),
('legal', 'aviso_updated', 'Aviso legal — fecha actualización', 'text', to_jsonb('Última actualización: enero de 2026'::text), to_jsonb('Última actualización: enero de 2026'::text), 121, now()),
('legal', 'aviso_meta', 'Aviso legal — descripción SEO', 'textarea', to_jsonb('Aviso legal de Vallo Dental. Información sobre titularidad, uso del sitio web y responsabilidades.'::text), to_jsonb('Aviso legal de Vallo Dental. Información sobre titularidad, uso del sitio web y responsabilidades.'::text), 122, now()),
('legal', 'aviso_body', 'Aviso legal — contenido (HTML)', 'textarea', to_jsonb($aviso$
<h2>1. Datos identificativos</h2>
<p>En cumplimiento de la LSSI-CE, se informa que el titular de este sitio web es <strong>Vallo Dental</strong>, con domicilio en C/ José de la Cámara, 4, local C, 41018 Sevilla, teléfono +34 655 232 333 y correo <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>.</p>
<h2>2. Objeto</h2>
<p>Este sitio web ofrece información sobre los servicios del laboratorio dental y facilita el contacto con clientes y profesionales del sector.</p>
<h2>3. Condiciones de uso</h2>
<p>El acceso implica la aceptación de estas condiciones. El usuario se compromete a un uso adecuado de los contenidos.</p>
<h2>4. Propiedad intelectual</h2>
<p>Los contenidos del sitio están protegidos por la normativa de propiedad intelectual e industrial.</p>
<h2>5. Responsabilidad</h2>
<p>Vallo Dental no se hace responsable del uso incorrecto del sitio web ni de enlaces externos de terceros.</p>
<h2>6. Legislación aplicable</h2>
<p>Se aplicará la legislación española y, para controversias, los juzgados de Sevilla.</p>
$aviso$::text), to_jsonb($aviso$
<h2>1. Datos identificativos</h2>
<p>En cumplimiento de la LSSI-CE, se informa que el titular de este sitio web es <strong>Vallo Dental</strong>, con domicilio en C/ José de la Cámara, 4, local C, 41018 Sevilla, teléfono +34 655 232 333 y correo <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>.</p>
<h2>2. Objeto</h2>
<p>Este sitio web ofrece información sobre los servicios del laboratorio dental y facilita el contacto con clientes y profesionales del sector.</p>
<h2>3. Condiciones de uso</h2>
<p>El acceso implica la aceptación de estas condiciones. El usuario se compromete a un uso adecuado de los contenidos.</p>
<h2>4. Propiedad intelectual</h2>
<p>Los contenidos del sitio están protegidos por la normativa de propiedad intelectual e industrial.</p>
<h2>5. Responsabilidad</h2>
<p>Vallo Dental no se hace responsable del uso incorrecto del sitio web ni de enlaces externos de terceros.</p>
<h2>6. Legislación aplicable</h2>
<p>Se aplicará la legislación española y, para controversias, los juzgados de Sevilla.</p>
$aviso$::text), 123, now()),
('legal', 'privacidad_title', 'Privacidad — título', 'text', to_jsonb('Política de privacidad'::text), to_jsonb('Política de privacidad'::text), 130, now()),
('legal', 'privacidad_updated', 'Privacidad — fecha actualización', 'text', to_jsonb('Última actualización: enero de 2026'::text), to_jsonb('Última actualización: enero de 2026'::text), 131, now()),
('legal', 'privacidad_meta', 'Privacidad — descripción SEO', 'textarea', to_jsonb('Política de privacidad de Vallo Dental conforme al RGPD.'::text), to_jsonb('Política de privacidad de Vallo Dental conforme al RGPD.'::text), 132, now()),
('legal', 'privacidad_body', 'Privacidad — contenido (HTML)', 'textarea', to_jsonb($privacidad$
<h2>1. Responsable</h2>
<p><strong>Vallo Dental</strong> · C/ José de la Cámara, 4, local C, 41018 Sevilla · <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a></p>
<h2>2. Finalidades</h2>
<ul>
<li>Gestionar consultas del formulario de contacto.</li>
<li>Informar sobre servicios del laboratorio dental.</li>
<li>Cumplir obligaciones legales.</li>
</ul>
<h2>3. Legitimación</h2>
<p>Consentimiento del interesado, medidas precontractuales e interés legítimo en atender solicitudes profesionales.</p>
<h2>4. Conservación</h2>
<p>Los datos se conservan mientras sea necesario para la finalidad indicada o por obligación legal.</p>
<h2>5. Derechos</h2>
<p>Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>, o reclamar ante la AEPD.</p>
$privacidad$::text), to_jsonb($privacidad$
<h2>1. Responsable</h2>
<p><strong>Vallo Dental</strong> · C/ José de la Cámara, 4, local C, 41018 Sevilla · <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a></p>
<h2>2. Finalidades</h2>
<ul>
<li>Gestionar consultas del formulario de contacto.</li>
<li>Informar sobre servicios del laboratorio dental.</li>
<li>Cumplir obligaciones legales.</li>
</ul>
<h2>3. Legitimación</h2>
<p>Consentimiento del interesado, medidas precontractuales e interés legítimo en atender solicitudes profesionales.</p>
<h2>4. Conservación</h2>
<p>Los datos se conservan mientras sea necesario para la finalidad indicada o por obligación legal.</p>
<h2>5. Derechos</h2>
<p>Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>, o reclamar ante la AEPD.</p>
$privacidad$::text), 133, now()),
('legal', 'cookies_title', 'Cookies — título', 'text', to_jsonb('Política de cookies'::text), to_jsonb('Política de cookies'::text), 140, now()),
('legal', 'cookies_updated', 'Cookies — fecha actualización', 'text', to_jsonb('Última actualización: enero de 2026'::text), to_jsonb('Última actualización: enero de 2026'::text), 141, now()),
('legal', 'cookies_meta', 'Cookies — descripción SEO', 'textarea', to_jsonb('Política de cookies de Vallo Dental.'::text), to_jsonb('Política de cookies de Vallo Dental.'::text), 142, now()),
('legal', 'cookies_body', 'Cookies — contenido (HTML)', 'textarea', to_jsonb($cookies$
<h2>1. ¿Qué son las cookies?</h2>
<p>Son archivos que se almacenan en tu dispositivo para recordar preferencias o medir el uso del sitio.</p>
<h2>2. Tipos de cookies</h2>
<ul>
<li><strong>Técnicas:</strong> necesarias para el funcionamiento.</li>
<li><strong>De preferencias:</strong> recuerdan opciones de navegación.</li>
<li><strong>Analíticas:</strong> estadísticas agregadas de uso.</li>
</ul>
<h2>3. Gestión</h2>
<p>Puedes permitir, bloquear o eliminar cookies desde la configuración de tu navegador.</p>
<h2>4. Más información</h2>
<p>Consulta nuestra <a href="/politica-privacidad">política de privacidad</a> o escribe a <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>.</p>
$cookies$::text), to_jsonb($cookies$
<h2>1. ¿Qué son las cookies?</h2>
<p>Son archivos que se almacenan en tu dispositivo para recordar preferencias o medir el uso del sitio.</p>
<h2>2. Tipos de cookies</h2>
<ul>
<li><strong>Técnicas:</strong> necesarias para el funcionamiento.</li>
<li><strong>De preferencias:</strong> recuerdan opciones de navegación.</li>
<li><strong>Analíticas:</strong> estadísticas agregadas de uso.</li>
</ul>
<h2>3. Gestión</h2>
<p>Puedes permitir, bloquear o eliminar cookies desde la configuración de tu navegador.</p>
<h2>4. Más información</h2>
<p>Consulta nuestra <a href="/politica-privacidad">política de privacidad</a> o escribe a <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>.</p>
$cookies$::text), 143, now())
on conflict (section, key) do update set
  label = excluded.label,
  type = excluded.type,
  draft_value = excluded.draft_value,
  published_value = excluded.published_value,
  sort_order = excluded.sort_order;
