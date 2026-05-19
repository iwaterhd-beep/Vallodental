import Link from "next/link";
import { BarChart3, FileText, ImageIcon, Settings } from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { PublishButton } from "@/components/admin/publish-button";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/content", label: "Contenido", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children, adminName }: { children: React.ReactNode; adminName: string }) {
  return (
    <div className="admin-app admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <p className="admin-brand-title">Alfredo Vallo Dental</p>
          <p className="admin-brand-kicker">CMS privado</p>
        </div>
        <nav className="admin-nav">
          {links.map((item) => (
            <Link
              className="admin-nav-link"
              href={item.href}
              key={item.href}
            >
              <span className="admin-nav-icon">
                <item.icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-session">
          <p className="admin-session-label">Sesión iniciada</p>
          <p className="admin-session-name">{adminName}</p>
          <div className="admin-session-action">
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-inner">
            <div>
              <p className="admin-kicker">Panel de administración</p>
              <h1 className="admin-title">Gestión web</h1>
            </div>
            <div className="admin-actions">
              <ThemeToggle />
              <PublishButton />
            </div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
