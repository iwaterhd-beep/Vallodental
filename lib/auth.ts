import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id, role, full_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    role: admin.role as string,
    fullName: (admin.full_name as string | null) ?? "Administrador"
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
