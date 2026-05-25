import { deleteContactSubmissionAction } from "@/lib/actions/contact";
import { getContactSubmissions } from "@/lib/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function replyMailto(submission: {
  name: string;
  email: string;
  clinic: string | null;
  phone: string | null;
  service_interest: string | null;
  message: string | null;
}) {
  const body = [
    `Hola ${submission.name},`,
    "",
    "Gracias por contactar con Vallo Dental.",
    "",
    "--- Consulta original ---",
    `Nombre: ${submission.name}`,
    submission.clinic ? `Clínica: ${submission.clinic}` : "",
    submission.phone ? `Teléfono: ${submission.phone}` : "",
    submission.service_interest ? `Servicio: ${submission.service_interest.replace(/<[^>]+>/g, " ")}` : "",
    submission.message ? `\n${submission.message}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${submission.email}?subject=${encodeURIComponent("Re: Consulta Vallo Dental")}&body=${encodeURIComponent(body)}`;
}

export default async function ContactInboxPage() {
  const { submissions, setupRequired, error } = await getContactSubmissions();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Consultas del formulario</CardTitle>
          <CardDescription>
            Mensajes recibidos desde la web. Responde por email o llama al teléfono indicado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {setupRequired ? (
            <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-foreground">
              Falta la tabla <code className="rounded bg-muted px-1">contact_submissions</code>. Ejecuta{" "}
              <code className="rounded bg-muted px-1">supabase/contact-submissions-migration.sql</code> en el SQL
              Editor de Supabase y confirma que{" "}
              <code className="rounded bg-muted px-1">SUPABASE_SERVICE_ROLE_KEY</code> está en Vercel.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {!submissions.length && !setupRequired ? (
            <p className="text-sm text-muted-foreground">Todavía no hay consultas. Prueba el formulario en la home.</p>
          ) : null}
          {submissions.map((submission) => (
            <Card className="overflow-hidden" key={submission.id}>
              <CardContent className="grid gap-3 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{submission.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(submission.created_at).toLocaleString("es-ES")}
                    </p>
                  </div>
                  {submission.service_interest ? (
                    <Badge className="bg-muted text-muted-foreground">
                      {submission.service_interest.replace(/<[^>]+>/g, " ").trim()}
                    </Badge>
                  ) : null}
                </div>
                <dl className="grid gap-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Email</dt>
                    <dd>
                      <a className="text-primary hover:underline" href={`mailto:${submission.email}`}>
                        {submission.email}
                      </a>
                    </dd>
                  </div>
                  {submission.phone ? (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Teléfono</dt>
                      <dd>
                        <a className="text-primary hover:underline" href={`tel:${submission.phone.replace(/\s/g, "")}`}>
                          {submission.phone}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                  {submission.clinic ? (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Clínica</dt>
                      <dd>{submission.clinic}</dd>
                    </div>
                  ) : null}
                  {submission.message ? (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Mensaje</dt>
                      <dd className="whitespace-pre-wrap text-muted-foreground">{submission.message}</dd>
                    </div>
                  ) : null}
                </dl>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild size="sm" variant="secondary">
                    <a href={replyMailto(submission)}>Responder por email</a>
                  </Button>
                  <form>
                    <DeleteButton
                      formAction={deleteContactSubmissionAction}
                      label="Eliminar"
                      name="id"
                      value={submission.id}
                      variant="outline"
                    />
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
