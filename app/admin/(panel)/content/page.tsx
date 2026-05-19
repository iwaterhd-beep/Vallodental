import { createServiceAction, deleteServiceAction, saveContentAction, saveServicesAction } from "@/lib/actions/admin";
import { ContentField } from "@/components/admin/content-field";
import { DeleteButton } from "@/components/admin/delete-button";
import { getAdminData } from "@/lib/content";
import { SETTINGS_SECTIONS } from "@/lib/admin-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function ContentPage() {
  const { entries, services } = await getAdminData();
  const contentEntries = entries.filter((entry) => !SETTINGS_SECTIONS.has(entry.section));
  const sections = Array.from(new Set(contentEntries.map((entry) => entry.section)));

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de contenido</CardTitle>
          <CardDescription>
            Edita borradores con inputs cómodos. Usa “Publicar cambios” en la cabecera para llevarlos a la web.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveContentAction} className="grid gap-8">
            {sections.map((section) => (
              <div className="grid gap-4 rounded-xl border border-border bg-background/40 p-4" key={section}>
                <h2 className="font-display text-2xl capitalize text-gold">{section}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {contentEntries
                    .filter((entry) => entry.section === section)
                    .map((entry) => (
                      <ContentField entry={entry} key={entry.id} />
                    ))}
                </div>
              </div>
            ))}
            <Button className="w-fit" type="submit">
              Guardar borrador
            </Button>
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
                <div className="flex justify-end">
                  <DeleteButton formAction={deleteServiceAction} name="id" value={service.id} label="Eliminar servicio" />
                </div>
              </div>
            ))}
            <Button className="w-fit" type="submit">
              Guardar servicios
            </Button>
          </form>

          <form
            action={createServiceAction}
            className="grid gap-3 rounded-xl border border-dashed border-border p-4 md:grid-cols-[1fr_1fr_120px_auto]"
          >
            <Input name="title" placeholder="Nuevo servicio" />
            <Input name="description" placeholder="Descripción breve" />
            <Input name="sort_order" placeholder="Orden" type="number" />
            <Button type="submit" variant="secondary">
              Crear
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
