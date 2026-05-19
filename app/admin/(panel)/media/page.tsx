import Image from "next/image";
import { deleteMediaAction, updateMediaLibraryAction } from "@/lib/actions/admin";
import { getAdminData } from "@/lib/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { MediaUpload } from "@/components/admin/media-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function MediaPage({ searchParams }: { searchParams: { error?: string } }) {
  const { media } = await getAdminData();
  const sortedMedia = [...media].sort((a, b) => {
    const group = (a.gallery_group ?? "general").localeCompare(b.gallery_group ?? "general");
    if (group !== 0) return group;
    return (a.sort_order ?? 99) - (b.sort_order ?? 99);
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de imágenes</CardTitle>
          <CardDescription>Subida con drag & drop, preview y almacenamiento en Supabase Storage.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {searchParams.error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {searchParams.error}
            </p>
          ) : null}
          <MediaUpload />
        </CardContent>
      </Card>

      {!sortedMedia.length ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Todavía no hay imágenes en la biblioteca. Sube la primera desde el formulario de arriba.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sortedMedia.map((item) => (
          <Card className="overflow-hidden" key={item.id}>
            <div className="relative h-56">
              <Image src={item.url} alt={item.alt} fill className="object-cover" />
            </div>
            <CardContent className="grid gap-3 p-4">
              <form action={updateMediaLibraryAction} className="grid gap-3">
                <input name="media_id" type="hidden" value={item.id} />
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Título</label>
                  <Input name={`title_${item.id}`} defaultValue={item.title} />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Alt SEO</label>
                  <Input name={`alt_${item.id}`} defaultValue={item.alt} />
                </div>
                <div className="grid gap-3 md:grid-cols-[1fr_90px]">
                  <select
                    className="h-10 rounded-md border border-input bg-background/80 px-3 text-sm"
                    name={`gallery_group_${item.id}`}
                    defaultValue={item.gallery_group ?? "general"}
                  >
                    <option value="laboratorio">Laboratorio</option>
                    <option value="protesis">Prótesis</option>
                    <option value="general">General</option>
                  </select>
                  <Input name={`sort_order_${item.id}`} defaultValue={item.sort_order ?? 99} type="number" />
                </div>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input name={`is_featured_${item.id}`} type="checkbox" defaultChecked={Boolean(item.is_featured)} />
                  Principal de su grupo
                </label>
                <Input readOnly value={item.url} />
                <Button className="w-fit" variant="secondary">Guardar imagen</Button>
              </form>
              <form action={deleteMediaAction}>
                <input name="id" type="hidden" value={item.id} />
                <input name="path" type="hidden" value={item.path ?? ""} />
                <DeleteButton />
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
