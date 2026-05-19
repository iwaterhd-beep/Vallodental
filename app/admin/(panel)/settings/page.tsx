import { saveContentAction } from "@/lib/actions/admin";
import { ContentField } from "@/components/admin/content-field";
import { getAdminData } from "@/lib/content";
import { SETTINGS_SECTIONS } from "@/lib/admin-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const { entries } = await getAdminData();
  const settings = entries.filter((entry) => SETTINGS_SECTIONS.has(entry.section));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajustes generales</CardTitle>
        <CardDescription>Datos de contacto, horarios, SEO básico, WhatsApp, redes y footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={saveContentAction} className="grid gap-5 md:grid-cols-2">
          {settings.map((entry) => (
            <ContentField entry={entry} key={entry.id} />
          ))}
          <div className="md:col-span-2">
            <Button type="submit">Guardar ajustes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
