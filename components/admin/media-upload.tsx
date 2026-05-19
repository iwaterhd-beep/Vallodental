"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadMediaAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MediaUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  return (
    <form action={uploadMediaAction} className="grid gap-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5">
      <label
        className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-border bg-background/60 p-6 text-center transition hover:bg-accent"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files?.[0];
          const input = document.getElementById("media-file") as HTMLInputElement | null;
          if (!file || !input) return;
          const transfer = new DataTransfer();
          transfer.items.add(file);
          input.files = transfer.files;
          setFileName(file.name);
          setPreview(URL.createObjectURL(file));
        }}
      >
        <UploadCloud className="mb-3 h-8 w-8 text-primary" />
        <span className="font-medium">Arrastra una imagen o haz click para subir</span>
        <span className="mt-1 text-sm text-muted-foreground">Se guardará en Supabase Storage.</span>
        <input
          id="media-file"
          className="sr-only"
          name="file"
          type="file"
          accept="image/*"
          required
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFileName(file?.name ?? "");
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </label>
      {preview ? (
        <img src={preview} alt="Preview" className="h-56 w-full rounded-xl object-cover" />
      ) : null}
      <div className="grid gap-3 md:grid-cols-2">
        <Input name="title" placeholder="Título interno" defaultValue={fileName} />
        <Input name="alt" placeholder="Texto alternativo SEO" />
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_120px_160px]">
        <select
          className="h-10 rounded-md border border-input bg-background/80 px-3 text-sm"
          name="gallery_group"
          defaultValue="laboratorio"
        >
          <option value="laboratorio">Laboratorio</option>
          <option value="protesis">Prótesis</option>
          <option value="general">General</option>
        </select>
        <Input name="sort_order" placeholder="Orden" type="number" defaultValue={99} />
        <label className="flex items-center gap-2 rounded-md border border-input bg-background/80 px-3 text-sm text-muted-foreground">
          <input name="is_featured" type="checkbox" />
          Imagen principal
        </label>
      </div>
      <Button className="w-fit">Subir imagen</Button>
    </form>
  );
}
