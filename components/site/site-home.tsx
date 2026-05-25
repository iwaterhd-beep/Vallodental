import Image from "next/image";
import { bool, text } from "@/lib/content";
import type { GalleryGroup } from "@/lib/gallery-groups.shared";
import type { MediaAsset, Service } from "@/lib/types";
import { ContactForm } from "@/components/site/contact-form";
import { GallerySection } from "@/components/site/gallery-section";
import { ContactItem, ContactSocialIcon, InstagramIcon, ServiceCardIcon } from "@/components/site/site-icons";
import { SiteInteractions } from "@/components/site/site-interactions";
import { SiteNav } from "@/components/site/site-nav";

type SiteHomeProps = {
  content: Map<string, string | boolean>;
  services: Service[];
  media: MediaAsset[];
  galleryGroups: GalleryGroup[];
};

export function SiteHome({ content, services, media, galleryGroups }: SiteHomeProps) {
  const navLinks = [
    { href: "#servicios", label: text(content, "nav.services") },
    { href: "#tecnologia", label: text(content, "nav.technology") },
    { href: "#trabajos", label: text(content, "nav.work") },
    { href: "#contacto", label: text(content, "nav.contact") }
  ];

  return (
    <>
      <div className="cursor" id="cursor" />
      <div className="cursor-ring" id="cursorRing" />
      <SiteInteractions />

      <SiteNav
        brandName={text(content, "brand.name")}
        brandTagline={text(content, "brand.tagline")}
        links={navLinks}
        ctaLabel={text(content, "nav.cta")}
      />

      <main id="contenido-principal">
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
              <ServiceCardIcon iconUrl={service.icon_url} index={index} />
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
          <a href={text(content, "social.instagram")} target="_blank" rel="noreferrer" className="section-link reveal" style={{ color: "var(--text-dim)" }}>
            {text(content, "gallery.link")}
          </a>
        </div>
        <GallerySection media={media} galleryGroups={galleryGroups} />
        <div className="gallery-footer reveal">
          <span className="gallery-footer-text">{text(content, "gallery.footer")}</span>
          <a href={text(content, "social.instagram")} target="_blank" rel="noreferrer" className="gallery-footer-ig">
            <InstagramIcon />
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
              <ContactItem icon="phone" label={text(content, "contact.phone_label")} value={text(content, "contact.phone")} href={`tel:${text(content, "contact.phone_href")}`} />
              <ContactItem icon="email" label={text(content, "contact.email_label")} value={text(content, "contact.email")} href={`mailto:${text(content, "contact.email")}`} />
              <ContactItem
                icon="address"
                label={text(content, "contact.address_label")}
                value={text(content, "contact.address")}
                href="https://maps.google.com/?q=C.+Jos%C3%A9+de+la+C%C3%A1mara,+4,+41018+Sevilla"
              />
              <ContactItem icon="hours" label={text(content, "contact.hours_label")} value={text(content, "contact.hours")} />
            </div>
            <div className="contact-social reveal">
              <a href={text(content, "social.instagram")} target="_blank" rel="noreferrer" className="contact-social-link" aria-label="Instagram">
                <ContactSocialIcon kind="instagram" />
              </a>
              <a href={text(content, "social.linkedin")} target="_blank" rel="noreferrer" className="contact-social-link" aria-label="LinkedIn">
                <ContactSocialIcon kind="linkedin" />
              </a>
              <a href={text(content, "contact.whatsapp")} target="_blank" rel="noreferrer" className="contact-social-link" aria-label="WhatsApp">
                <ContactSocialIcon kind="whatsapp" />
              </a>
            </div>
          </div>
          <div className="contact-right">
            <div className="reveal">
              <div className="section-eyebrow" style={{ marginBottom: 32 }}>
                <div className="section-eyebrow-line" />
                <span className="section-eyebrow-text">{text(content, "contact.form_eyebrow")}</span>
              </div>
            </div>
            <ContactForm
              recipientEmail={text(content, "contact.email")}
              submitLabel={text(content, "contact.submit")}
              noteHtml={text(content, "contact.note")}
              serviceOptions={services.map((service) => service.title)}
            />
          </div>
        </div>
      </section>
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-logo">Vallo Dental</p>
            <p className="footer-tagline">Laboratorio dental · Sevilla</p>
          </div>

          <div className="footer-block footer-contact">
            <p className="footer-heading">Contacto rápido</p>
            <ul className="footer-list">
              <li>
                <a href={`tel:${text(content, "contact.phone_href")}`} className="footer-link">
                  <span className="footer-link-label">{text(content, "contact.phone_label")}</span>
                  {text(content, "contact.phone")}
                </a>
              </li>
              <li>
                <a href={`mailto:${text(content, "contact.email")}`} className="footer-link">
                  <span className="footer-link-label">{text(content, "contact.email_label")}</span>
                  {text(content, "contact.email")}
                </a>
              </li>
            </ul>
          </div>

          <nav className="footer-block footer-nav" aria-label="Navegación del sitio">
            <p className="footer-heading">Navegación</p>
            <ul className="footer-list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-link">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-block footer-legal" aria-label="Información legal">
            <p className="footer-heading">Legal</p>
            <ul className="footer-list">
              <li><a href="/aviso-legal.html" className="footer-link">Aviso legal</a></li>
              <li><a href="/politica-privacidad.html" className="footer-link">Política de privacidad</a></li>
              <li><a href="/politica-cookies.html" className="footer-link">Política de cookies</a></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© 2026 Vallo Dental. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
