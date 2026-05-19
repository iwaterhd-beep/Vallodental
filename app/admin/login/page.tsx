import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { loginAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const missingEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <main className="admin-app relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle>Acceso administración</CardTitle>
          <CardDescription>Panel privado para gestionar la web de la clínica.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            {missingEnv ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                Faltan variables de Supabase en Vercel: NEXT_PUBLIC_SUPABASE_URL y
                NEXT_PUBLIC_SUPABASE_ANON_KEY.
              </p>
            ) : null}
            {searchParams.error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {searchParams.error}
              </p>
            ) : null}
            <Button className="mt-2 w-full">Entrar al panel</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
