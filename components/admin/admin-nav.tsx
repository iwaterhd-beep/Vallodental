"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, ImageIcon, Settings } from "lucide-react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/content", label: "Contenido", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Ajustes", icon: Settings }
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav">
      {links.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            className={`admin-nav-link${isActive ? " is-active" : ""}`}
            href={item.href}
            key={item.href}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="admin-nav-icon">
              <item.icon className="h-4 w-4" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
