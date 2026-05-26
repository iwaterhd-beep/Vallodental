"use client";

import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { deleteGalleryGroupAction, updateGalleryGroupAction } from "@/lib/actions/admin";
import type { GalleryGroup } from "@/lib/gallery-groups.shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryGroupListProps = {
  groups: GalleryGroup[];
  imageCounts: Record<string, number>;
};

export function GalleryGroupList({ groups, imageCounts }: GalleryGroupListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!groups.length) {
    return <p className="text-sm text-muted-foreground">Todavía no hay apartados. Crea el primero abajo.</p>;
  }

  return (
    <ul className="grid gap-2">
      {groups.map((group) => {
        const imageCount = imageCounts[group.id] ?? 0;
        const isEditing = editingId === group.id;
        const canDelete = group.id !== "general";

        return (
          <li
            className="flex flex-col gap-2 rounded-lg border border-border bg-background/60 p-3 sm:flex-row sm:items-center"
            key={group.id}
          >
            {isEditing ? (
              <form action={updateGalleryGroupAction} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <input name="id" type="hidden" value={group.id} />
                <Input
                  name="label"
                  defaultValue={group.label}
                  className="h-9 flex-1"
                  required
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button className="shrink-0" size="sm" type="submit">
                    Guardar
                  </Button>
                  <Button
                    className="shrink-0"
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{group.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {imageCount === 0
                      ? "Sin imágenes"
                      : imageCount === 1
                        ? "1 imagen"
                        : `${imageCount} imágenes`}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    className="gap-2"
                    size="sm"
                    type="button"
                    variant="secondary"
                    onClick={() => setEditingId(group.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  {canDelete ? (
                    <form action={deleteGalleryGroupAction}>
                      <input name="id" type="hidden" value={group.id} />
                      <Button
                        className="gap-2"
                        size="sm"
                        type="submit"
                        variant="destructive"
                        onClick={(event) => {
                          const message =
                            imageCount > 0
                              ? `¿Eliminar "${group.label}"? Las ${imageCount} imagen${imageCount === 1 ? "" : "es"} pasarán al apartado General.`
                              : `¿Eliminar el apartado "${group.label}"?`;
                          if (!confirm(message)) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </form>
                  ) : null}
                </div>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
