import { Activity, FileText, ImageIcon, Sparkles } from "lucide-react";
import { getAdminData } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const { entries, services, media, changes } = await getAdminData();
  const drafts = entries.filter((entry) => entry.draft_value !== entry.published_value).length;

  return (
    <div className="admin-dashboard">
      <Card className="admin-hero-card">
        <CardContent className="admin-hero-card-content">
          <div>
            <p className="admin-kicker">Resumen del CMS</p>
            <h2 className="admin-hero-title">
              Controla la web sin tocar código.
            </h2>
            <p className="admin-hero-text">
              Edita textos, imágenes, servicios, datos de contacto y SEO. Guarda borradores y publica cuando todo esté listo.
            </p>
          </div>
          <div className="admin-status-card">
            <p>Estado actual</p>
            <strong>{drafts}</strong>
            <span>borradores pendientes</span>
          </div>
        </CardContent>
      </Card>

      <div className="admin-metrics">
        <Metric icon={FileText} label="Campos editables" value={entries.length} />
        <Metric icon={Sparkles} label="Borradores pendientes" value={drafts} />
        <Metric icon={Activity} label="Servicios" value={services.length} />
        <Metric icon={ImageIcon} label="Imágenes" value={media.length} />
      </div>
      <Card className="admin-history-card">
        <CardHeader>
          <CardTitle>Últimas modificaciones</CardTitle>
          <CardDescription>Historial simple de cambios del CMS.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {changes.map((change) => (
            <div className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3" key={change.id}>
              <div>
                <p className="text-sm font-medium">{change.entity_label}</p>
                <p className="text-xs text-muted-foreground">{new Date(change.created_at).toLocaleString("es-ES")}</p>
              </div>
              <Badge>{change.action}</Badge>
            </div>
          ))}
          {!changes.length ? <p className="text-sm text-muted-foreground">Todavía no hay cambios registrados.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: number }) {
  return (
    <Card className="admin-metric-card">
      <CardContent className="admin-metric-content">
        <div className="admin-metric-icon">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="admin-metric-value">{value}</p>
          <p className="admin-metric-label">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
