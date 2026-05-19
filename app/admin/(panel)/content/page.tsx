import { createServiceAction, deleteServiceAction, saveContentAction, saveServicesAction } from "@/lib/actions/admin";
import { getAdminData } from "@/lib/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function ContentPage() {
  const { entries, services } = await getAdminData();
  const sections = Array.from(new Set(entries.map((entry) => entry.section)));

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de contenido</CardTitle>
          <CardDescription>
            Edita borradores con inputs cómodos. Usa “Publicar cambios” para llevarlos a la web.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveContentAction} className="grid gap-8">
            {sections.map((section) => (
              <div className="grid gap-4 rounded-xl border border-border bg-background/40 p-4" key={section}>
                <h2 className="font-display text-2xl capitalize text-gold">{section}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {entries.filter((entry) => entry.section === section).map((entry) => (
                    <div className="grid gap-2" key={entry.id}>
                      <input name="entry_id" type="hidden" value={entry.id} />
                      <Label htmlFor={entry.id}>{entry.label}</Label>
                      {entry.type === "textarea" || entry.type === "richtext" ? (
                        <Textarea id={entry.id} name={`value_${entry.id}`} defaultValue={String(entry.draft_value ?? "")} />
                      ) : (
                        <Input id={entry.id} name={`value_${entry.id}`} defaultValue={String(entry.draft_value ?? "")} />
                      )}
                      {entry.draft_value !== entry.published_value ? (
                        <p className="text-xs text-gold">Borrador distinto a la versión publicada.</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button className="w-fit">Guardar borrador</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
          <CardDescription>Ordena, publica u oculta los servicios mostrados en la home.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <form action={saveServicesAction} className="grid gap-4">
            {services.map((service) => (
              <div className="grid gap-3 rounded-xl border border-border bg-background/40 p-4" key={service.id}>
                <input name="service_id" type="hidden" value={service.id} />
                <div className="grid gap-3 md:grid-cols-[1fr_100px_140px]">
                  <Input name={`service_title_${service.id}`} defaultValue={service.title} placeholder="Título" />
                  <Input name={`service_order_${service.id}`} defaultValue={service.sort_order} type="number" />
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input name={`service_published_${service.id}`} type="checkbox" defaultChecked={service.is_published} />
                    Publicado
                  </label>
                </div>
                <Textarea name={`service_description_${service.id}`} defaultValue={service.description} />
                <Input name={`service_icon_${service.id}`} defaultValue={service.icon_url ?? ""} placeholder="URL icono" />
                <DeleteButton formAction={deleteServiceAction} name="id" value={service.id} />
              </div>
            ))}
            <Button className="w-fit">Guardar servicios</Button>
          </form>

          <form action={createServiceAction} className="grid gap-3 rounded-xl border border-dashed border-border p-4 md:grid-cols-[1fr_1fr_120px_auto]">
            <Input name="title" placeholder="Nuevo servicio" />
            <Input name="description" placeholder="Descripción breve" />
            <Input name="sort_order" placeholder="Orden" type="number" />
            <Button variant="secondary">Crear</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
