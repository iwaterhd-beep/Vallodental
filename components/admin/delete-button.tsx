"use client";

import { Trash2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

export function DeleteButton({
  label = "Borrar",
  confirmMessage = "¿Seguro que quieres borrar este elemento? Esta acción no se puede deshacer.",
  ...props
}: { label?: string; confirmMessage?: string } & ButtonProps) {
  return (
    <Button
      type="submit"
      variant="destructive"
      size="sm"
      className="gap-2"
      {...props}
      onClick={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
        props.onClick?.(event);
      }}
    >
      <Trash2 className="h-4 w-4" />
      {label}
    </Button>
  );
}
