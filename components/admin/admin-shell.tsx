import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { PublishButton } from "@/components/admin/publish-button";

export function AdminShell({ children, adminName }: { children: React.ReactNode; adminName: string }) {
  return (
    <div className="admin-app admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <p className="admin-brand-title">Alfredo Vallo Dental</p>
          <p className="admin-brand-kicker">CMS privado</p>
        </div>
        <AdminNav />
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
