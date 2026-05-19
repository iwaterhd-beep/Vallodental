import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" className="w-full justify-start gap-2">
        <LogOut className="h-4 w-4" />
        Salir
      </Button>
    </form>
  );
}
