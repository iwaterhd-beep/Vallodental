import { saveContentAction } from "@/lib/actions/admin";
import { ContentField } from "@/components/admin/content-field";
import { getAdminData } from "@/lib/content";
import { LEGAL_PAGES } from "@/lib/legal-pages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FIELD_ORDER = ["title", "updated", "meta", "body"] as const;

const FIELD_SUFFIX: Record<(typeof FIELD_ORDER)[number], string> = {
  title: "_title",
  updated: "_updated",
  meta: "_meta",
  body: "_body"
};

export default async function LegalAdminPage() {
  const { entries } = await getAdminData();
  const legalEntries = entries.filter((entry) => entry.section === "legal");

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Páginas legales</CardTitle>
          <CardDescription>
            Edita aviso legal, privacidad y cookies. Guarda como borrador y usa &quot;Publicar cambios&quot; en la cabecera
            para actualizar la web. Puedes usar HTML básico en el contenido (h2, p, ul, li, a, strong).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!legalEntries.length ? (
            <p className="mb-6 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
              Ejecuta <code className="text-xs">supabase/legal-pages-migration.sql</code> en el SQL Editor de Supabase para
              activar la edición desde el panel.
            </p>
          ) : null}
          <form action={saveContentAction} className="grid gap-8">
            {LEGAL_PAGES.map((page) => {
              const pageEntries = legalEntries
                .filter((entry) => entry.key.startsWith(`${page.id}_`))
                .sort((a, b) => {
                  const ai = FIELD_ORDER.findIndex((field) => entryKeyMatches(a.key, page.id, field));
                  const bi = FIELD_ORDER.findIndex((field) => entryKeyMatches(b.key, page.id, field));
                  return ai - bi;
                });

              return (
                <div className="grid gap-4 rounded-xl border border-border bg-background/40 p-4" key={page.id}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-display text-2xl text-gold">{page.label}</h2>
                    <a
                      className="text-sm text-muted-foreground underline-offset-4 hover:text-gold hover:underline"
                      href={page.path}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Ver en la web →
                    </a>
                  </div>
                  <div className="grid gap-4">
                    {pageEntries.map((entry) => (
                      <ContentField entry={entry} key={entry.id} />
                    ))}
                  </div>
                </div>
              );
            })}
            <Button className="w-fit" type="submit">
              Guardar borrador
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function entryKeyMatches(key: string, pageId: string, field: (typeof FIELD_ORDER)[number]) {
  return key === `${pageId}${FIELD_SUFFIX[field]}`;
}
