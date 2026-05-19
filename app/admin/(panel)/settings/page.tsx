import { saveContentAction } from "@/lib/actions/admin";
import { getAdminData } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const settingsSections = new Set(["seo", "contact", "social", "footer", "brand"]);

export default async function SettingsPage() {
  const { entries } = await getAdminData();
  const settings = entries.filter((entry) => settingsSections.has(entry.section));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajustes generales</CardTitle>
        <CardDescription>Datos de contacto, horarios, SEO básico, WhatsApp, redes y footer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={saveContentAction} className="grid gap-5 md:grid-cols-2">
          {settings.map((entry) => (
            <div className="grid gap-2" key={entry.id}>
              <input name="entry_id" type="hidden" value={entry.id} />
              <Label htmlFor={entry.id}>{entry.label}</Label>
              {entry.type === "textarea" || entry.type === "richtext" ? (
                <Textarea id={entry.id} name={`value_${entry.id}`} defaultValue={String(entry.draft_value ?? "")} />
              ) : (
                <Input id={entry.id} name={`value_${entry.id}`} defaultValue={String(entry.draft_value ?? "")} />
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <Button>Guardar ajustes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
