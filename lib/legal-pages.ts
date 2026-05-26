export type LegalPageId = "aviso" | "privacidad" | "cookies";

export type LegalPageConfig = {
  id: LegalPageId;
  label: string;
  path: string;
  titleKey: string;
  updatedKey: string;
  metaKey: string;
  bodyKey: string;
  defaults: {
    title: string;
    updated: string;
    meta: string;
    body: string;
  };
};

export const LEGAL_PAGES: LegalPageConfig[] = [
  {
    id: "aviso",
    label: "Aviso legal",
    path: "/aviso-legal",
    titleKey: "legal.aviso_title",
    updatedKey: "legal.aviso_updated",
    metaKey: "legal.aviso_meta",
    bodyKey: "legal.aviso_body",
    defaults: {
      title: "Aviso legal",
      updated: "Última actualización: enero de 2026",
      meta: "Aviso legal de Vallo Dental. Información sobre titularidad, uso del sitio web y responsabilidades.",
      body: `<h2>1. Datos identificativos</h2>
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
<p>Se aplicará la legislación española y, para controversias, los juzgados de Sevilla.</p>`
    }
  },
  {
    id: "privacidad",
    label: "Política de privacidad",
    path: "/politica-privacidad",
    titleKey: "legal.privacidad_title",
    updatedKey: "legal.privacidad_updated",
    metaKey: "legal.privacidad_meta",
    bodyKey: "legal.privacidad_body",
    defaults: {
      title: "Política de privacidad",
      updated: "Última actualización: enero de 2026",
      meta: "Política de privacidad de Vallo Dental conforme al RGPD.",
      body: `<h2>1. Responsable</h2>
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
<p>Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>, o reclamar ante la AEPD.</p>`
    }
  },
  {
    id: "cookies",
    label: "Política de cookies",
    path: "/politica-cookies",
    titleKey: "legal.cookies_title",
    updatedKey: "legal.cookies_updated",
    metaKey: "legal.cookies_meta",
    bodyKey: "legal.cookies_body",
    defaults: {
      title: "Política de cookies",
      updated: "Última actualización: enero de 2026",
      meta: "Política de cookies de Vallo Dental.",
      body: `<h2>1. ¿Qué son las cookies?</h2>
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
<p>Consulta nuestra <a href="/politica-privacidad">política de privacidad</a> o escribe a <a href="mailto:avrprotesicodental@gmail.com">avrprotesicodental@gmail.com</a>.</p>`
    }
  }
];

export function getLegalPageByPath(path: string) {
  return LEGAL_PAGES.find((page) => page.path === path);
}

export function legalFieldKeys() {
  return LEGAL_PAGES.flatMap((page) => [page.titleKey, page.updatedKey, page.metaKey, page.bodyKey]);
}
