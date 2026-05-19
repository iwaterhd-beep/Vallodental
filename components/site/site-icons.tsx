import Image from "next/image";

const GOLD = "#c9a96e";

type SvgProps = {
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
};

function baseSvgProps({ width = 14, height = 14, stroke = GOLD, className }: SvgProps) {
  return {
    width,
    height,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    className
  };
}

export type ContactIconKind = "phone" | "email" | "address" | "hours";

export function ContactDetailIcon({ kind }: { kind: ContactIconKind }) {
  const props = baseSvgProps({});

  if (kind === "phone") {
    return (
      <svg {...props}>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    );
  }

  if (kind === "email") {
    return (
      <svg {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    );
  }

  if (kind === "address") {
    return (
      <svg {...props}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
}

export function ContactSocialIcon({ kind }: { kind: "instagram" | "linkedin" | "whatsapp" }) {
  const props = baseSvgProps({ width: 16, height: 16 });

  if (kind === "instagram") {
    return <InstagramIcon {...props} />;
  }

  if (kind === "linkedin") {
    return (
      <svg {...props}>
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

export function InstagramIcon({ width = 16, height = 16, stroke = "currentColor", className }: SvgProps) {
  const props = baseSvgProps({ width, height, stroke, className });
  return (
    <svg {...props} strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={stroke} stroke="none" />
    </svg>
  );
}

export function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  const props = baseSvgProps({ width: 20, height: 20, stroke: GOLD });
  return (
    <svg {...props}>
      {direction === "left" ? <polyline points="15,18 9,12 15,6" /> : <polyline points="9,18 15,12 9,6" />}
    </svg>
  );
}

const SERVICE_ICON_CLASSES = [
  "service-icon-protesis",
  "service-icon-diseno",
  "service-icon-implante",
  "service-icon-retenedores"
] as const;

const DEFAULT_SERVICE_ICONS = [
  "/assets/icono-protesis-fija.png",
  "/assets/icono-diseno-3d.png",
  "/assets/icono-implantes.png",
  "/assets/icono-retenedores.png"
] as const;

export function ServiceCardIcon({ iconUrl, index }: { iconUrl: string | null; index: number }) {
  const slot = Math.min(index, SERVICE_ICON_CLASSES.length - 1);
  const className = `service-icon ${SERVICE_ICON_CLASSES[slot]}`;
  const src = iconUrl?.trim() || DEFAULT_SERVICE_ICONS[slot];

  return <Image className={className} src={src} alt="" width={90} height={90} />;
}

export function ContactItem({
  icon,
  label,
  value,
  href
}: {
  icon: ContactIconKind;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="contact-detail-item reveal">
      <div className="contact-detail-icon">
        <ContactDetailIcon kind={icon} />
      </div>
      <div>
        <div className="contact-detail-label">{label}</div>
        {href ? (
          <a href={href} className="contact-detail-value">
            {value}
          </a>
        ) : (
          <span className="contact-detail-value" style={{ cursor: "default", whiteSpace: "pre-line" }}>
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
