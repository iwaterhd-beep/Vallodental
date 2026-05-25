"use client";

import { useEffect, useState } from "react";

type SiteNavProps = {
  brandName: string;
  brandTagline: string;
  links: { href: string; label: string }[];
  ctaLabel: string;
};

export function SiteNav({ brandName, brandTagline, links, ctaLabel }: SiteNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <>
      <nav id="navbar" aria-label="Principal">
        <a href="#" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="nav-logo-top">{brandName}</span>
          <span className="nav-logo-bottom">{brandTagline}</span>
        </a>

        <ul className={`nav-links${open ? " nav-links--open" : ""}`} id="siteNavLinks">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a href="#contacto" className="nav-cta" onClick={() => setOpen(false)}>
            {ctaLabel}
          </a>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="siteNavLinks"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </div>
      </nav>

      <button
        type="button"
        className={`nav-backdrop${open ? " nav-backdrop--visible" : ""}`}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        aria-label="Cerrar menú"
        onClick={() => setOpen(false)}
      />
    </>
  );
}
