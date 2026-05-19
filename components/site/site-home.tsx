import Image from "next/image";
import { bool, text } from "@/lib/content";
import type { MediaAsset, Service } from "@/lib/types";
import { GallerySection } from "@/components/site/gallery-section";
import { SiteInteractions } from "@/components/site/site-interactions";

type SiteHomeProps = {
  content: Map<string, string | boolean>;
  services: Service[];
  media: MediaAsset[];
};

export function SiteHome({ content, services, media }: SiteHomeProps) {
  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursorRing" />
      <SiteInteractions />

      <nav id="navbar">
        <a href="#" className="nav-logo">
          <span className="nav-logo-top">{text(content, "brand.name")}</span>
          <span className="nav-logo-bottom">{text(content, "brand.tagline")}</span>
        </a>
        <ul className="nav-links">
          <li><a href="#servicios">{text(content, "nav.services")}</a></li>
          <li><a href="#tecnologia">{text(content, "nav.technology")}</a></li>
          <li><a href="#trabajos">{text(content, "nav.work")}</a></li>
          <li><a href="#contacto">{text(content, "nav.contact")}</a></li>
        </ul>
        <a href="#contacto" className="nav-cta">{text(content, "nav.cta")}</a>
      </nav>

      <section id="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">{text(content, "hero.eyebrow")}</span>
          </div>
          <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: text(content, "hero.title") }} />
          <p className="hero-sub">{text(content, "hero.subtitle")}</p>
          <div className="hero-actions">
            <a href="#trabajos" className="btn-gold">{text(content, "hero.primary_button")}</a>
            <a href="#contacto" className="btn-ghost">{text(content, "hero.secondary_button")}</a>
          </div>
        </div>
        <div className="hero-right">
          {text(content, "hero.image") ? (
            <Image
              src={text(content, "hero.image")}
              alt={text(content, "hero.image_alt")}
              width={1200}
              height={1200}
              priority
            />
          ) : null}
        </div>
      </section>

      <div id="stats">
        {[1, 2, 3].map((index) => (
          <div className="stat-item reveal" key={index}>
            <div className={index === 3 ? "stat-number stat-number--long" : "stat-number"}>
              {text(content, `stats.${index}_number`)}
            </div>
            <div className="stat-label">{text(content, `stats.${index}_label`)}</div>
          </div>
        ))}
      </div>

      <section id="servicios">
        <div className="section-header">
          <div className="section-header-left reveal">
            <div className="section-eyebrow">
              <div className="section-eyebrow-line" />
              <span className="section-eyebrow-text">{text(content, "services.eyebrow")}</span>
            </div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: text(content, "services.title") }} />
          </div>
          <a href="#contacto" className="section-link reveal">{text(content, "services.link")}</a>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card reveal" data-num={String(index + 1).padStart(2, "0")} key={service.id}>
              <div className="service-num">{String(index + 1).padStart(2, "0")}</div>
              {service.icon_url ? (
                <Image className="service-icon service-icon-protesis" src={service.icon_url} alt="" width={90} height={90} />
              ) : null}
              <h3 className="service-name" dangerouslySetInnerHTML={{ __html: service.title }} />
              <p className="service-desc">{service.description}</p>
              <span className="service-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {bool(content, "marquee.enabled") ? (
        <div className="marquee-band">
          <div className="marquee-track">
            {text(content, "marquee.items").split(",").concat(text(content, "marquee.items").split(",")).map((item, index) => (
              <div className="marquee-item" key={`${item}-${index}`}>{item.trim()}<span>·</span></div>
            ))}
          </div>
        </div>
      ) : null}

      <section id="tecnologia">
        <div className="tech-layout">
          <div className="tech-left">
            <span className="tech-quote-mark reveal">&quot;</span>
            <blockquote className="tech-quote reveal" dangerouslySetInnerHTML={{ __html: text(content, "tech.quote") }} />
            <p className="tech-body reveal">{text(content, "tech.body")}</p>
            <div className="tech-signature reveal">
              <div className="tech-signature-avatar">{text(content, "tech.avatar")}</div>
              <div>
                <div className="tech-signature-name">{text(content, "tech.name")}</div>
                <div className="tech-signature-role">{text(content, "tech.role")}</div>
              </div>
            </div>
          </div>
          <div className="tech-right">
            {[1, 2, 3, 4].map((index) => (
              <div className="tech-pillar reveal" key={index}>
                <div className="tech-pillar-num">{["I", "II", "III", "IV"][index - 1]}</div>
                <div className="tech-pillar-content">
                  <div className="tech-pillar-title">
                    {text(content, `tech.pillar_${index}_title`)}
                    <div className="tech-pillar-dot" />
                  </div>
                  <p className="tech-pillar-desc">{text(content, `tech.pillar_${index}_body`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trabajos">
        <div className="gallery-header">
          <div className="reveal">
            <div className="section-eyebrow">
              <div className="section-eyebrow-line" />
              <span className="section-eyebrow-text">{text(content, "gallery.eyebrow")}</span>
            </div>
            <h2 className="section-title" style={{ color: "var(--dark)" }} dangerouslySetInnerHTML={{ __html: text(content, "gallery.title") }} />
          </div>
          <a href={text(content, "social.instagram")} target="_blank" className="section-link reveal" style={{ color: "var(--text-dim)" }}>
            {text(content, "gallery.link")}
          </a>
        </div>
        <GallerySection media={media} />
        <div className="gallery-footer reveal">
          <span className="gallery-footer-text">{text(content, "gallery.footer")}</span>
          <a href={text(content, "social.instagram")} target="_blank" className="gallery-footer-ig">
            @{text(content, "social.instagram_handle")}
          </a>
        </div>
      </section>

      <section id="contacto">
        <div className="contact-layout">
          <div className="contact-left">
            <div className="section-eyebrow reveal">
              <div className="section-eyebrow-line" />
              <span className="section-eyebrow-text">{text(content, "contact.eyebrow")}</span>
            </div>
            <h2 className="contact-title reveal" dangerouslySetInnerHTML={{ __html: text(content, "contact.title") }} />
            <p className="contact-subtitle reveal">{text(content, "contact.subtitle")}</p>
            <div className="contact-details">
              <ContactItem label={text(content, "contact.phone_label")} value={text(content, "contact.phone")} href={`tel:${text(content, "contact.phone_href")}`} />
              <ContactItem label={text(content, "contact.email_label")} value={text(content, "contact.email")} href={`mailto:${text(content, "contact.email")}`} />
              <ContactItem label={text(content, "contact.address_label")} value={text(content, "contact.address")} />
              <ContactItem label={text(content, "contact.hours_label")} value={text(content, "contact.hours")} />
            </div>
          </div>
          <div className="contact-right">
            <div className="reveal">
              <div className="section-eyebrow" style={{ marginBottom: 32 }}>
                <div className="section-eyebrow-line" />
                <span className="section-eyebrow-text">{text(content, "contact.form_eyebrow")}</span>
              </div>
            </div>
            <form action={`mailto:${text(content, "contact.email")}`} method="post" encType="text/plain">
              <div className="form-row reveal">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="nombre">Nombre</label>
                  <input className="form-input" id="nombre" name="nombre" placeholder="Tu nombre" required />
                </div>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="clinica">Clínica / empresa</label>
                  <input className="form-input" id="clinica" name="clinica" placeholder="Nombre de tu clínica" />
                </div>
              </div>
              <div className="form-row reveal">
                <div className="form-label-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input className="form-input" id="email" name="email" placeholder="tu@email.com" required type="email" />
                </div>
                <div className="form-label-group">
                  <label className="form-label" htmlFor="telefono">Teléfono</label>
                  <input className="form-input" id="telefono" name="telefono" placeholder="+34 000 000 000" />
                </div>
              </div>
              <div className="form-label-group reveal">
                <label className="form-label" htmlFor="mensaje">Mensaje</label>
                <textarea className="form-textarea" id="mensaje" name="mensaje" placeholder="Cuéntanos tu caso o consulta..." />
              </div>
              <div className="form-submit reveal">
                <button type="submit" className="form-submit-btn">{text(content, "contact.submit")}</button>
                <p className="form-note" dangerouslySetInnerHTML={{ __html: text(content, "contact.note") }} />
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-logo">{text(content, "brand.name")}</div>
        <ul className="footer-links">
          <li><a href="#servicios">{text(content, "nav.services")}</a></li>
          <li><a href="#tecnologia">{text(content, "nav.technology")}</a></li>
          <li><a href="#trabajos">{text(content, "nav.work")}</a></li>
          <li><a href="#contacto">{text(content, "nav.contact")}</a></li>
        </ul>
        <p className="footer-copy">{text(content, "footer.copy")}</p>
      </footer>
    </>
  );
}

function ContactItem({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="contact-detail-item reveal">
      <div className="contact-detail-icon" />
      <div>
        <div className="contact-detail-label">{label}</div>
        {href ? (
          <a href={href} className="contact-detail-value">{value}</a>
        ) : (
          <span className="contact-detail-value" style={{ cursor: "default", whiteSpace: "pre-line" }}>{value}</span>
        )}
      </div>
    </div>
  );
}
