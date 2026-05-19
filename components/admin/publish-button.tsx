"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Rocket } from "lucide-react";
import { publishContentAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function PublishButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      className="gap-2"
      onClick={() => {
        if (!confirm("¿Publicar todos los borradores en la web?")) return;
        startTransition(async () => {
          try {
            await publishContentAction();
            toast.success("Cambios publicados en la web");
          } catch {
            toast.error("No se pudieron publicar los cambios");
          }
        });
      }}
    >
      <Rocket className="h-4 w-4" />
      {pending ? "Publicando..." : "Publicar cambios"}
    </Button>
  );
}
