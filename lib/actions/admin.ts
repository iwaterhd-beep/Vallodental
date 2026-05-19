"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

async function logChange(entityType: string, entityLabel: string, action: string) {
  const supabase = createSupabaseServerClient();
  await supabase.from("change_logs").insert({
    entity_type: entityType,
    entity_label: entityLabel,
    action
  });
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error
  } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/admin/login?error=Credenciales%20incorrectas");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user?.id)
    .maybeSingle();

  if (!admin || adminError) {
    await supabase.auth.signOut();
    const message =
      adminError?.code === "PGRST205"
        ? "Primero ejecuta supabase/schema.sql en Supabase."
        : "Este usuario no tiene permisos de administrador.";
    redirect(`/admin/login?error=${encodeURIComponent(message)}`);
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveContentAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const ids = formData.getAll("entry_id").map(String);

  for (const id of ids) {
    const value = String(formData.get(`value_${id}`) ?? "");
    await supabase
      .from("content_entries")
      .update({ draft_value: value, updated_at: new Date().toISOString() })
      .eq("id", id);
  }

  await logChange("content", "Contenido global", "Guardado como borrador");
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function publishContentAction() {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  const { data: entries } = await supabase.from("content_entries").select("id, draft_value");
  for (const entry of entries ?? []) {
    await supabase
      .from("content_entries")
      .update({
        published_value: entry.draft_value,
        published_at: new Date().toISOString()
      })
      .eq("id", entry.id);
  }

  await logChange("content", "Sitio completo", "Publicado");
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/content");
}

export async function saveServicesAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const ids = formData.getAll("service_id").map(String);

  for (const id of ids) {
    await supabase
      .from("services")
      .update({
        title: String(formData.get(`service_title_${id}`) ?? ""),
        description: String(formData.get(`service_description_${id}`) ?? ""),
        icon_url: String(formData.get(`service_icon_${id}`) ?? "") || null,
        sort_order: Number(formData.get(`service_order_${id}`) ?? 0),
        is_published: formData.get(`service_published_${id}`) === "on"
      })
      .eq("id", id);
  }

  await logChange("services", "Servicios", "Actualizados");
  revalidatePath("/");
  revalidatePath("/admin/content");
}

export async function createServiceAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();

  await supabase.from("services").insert({
    title: String(formData.get("title") ?? "Nuevo servicio"),
    description: String(formData.get("description") ?? ""),
    icon_url: String(formData.get("icon_url") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 99),
    is_published: false
  });

  await logChange("services", "Nuevo servicio", "Creado");
  revalidatePath("/admin/content");
}

export async function deleteServiceAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseServerClient();
  const id = String(formData.get("id") ?? "");
  await supabase.from("services").delete().eq("id", id);
  await logChange("services", "Servicio", "Eliminado");
  revalidatePath("/");
  revalidatePath("/admin/content");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return;

  const service = createSupabaseServiceClient();
  const title = String(formData.get("title") ?? file.name);
  const alt = String(formData.get("alt") ?? title);
  const galleryGroup = String(formData.get("gallery_group") ?? "general");
  const sortOrder = Number(formData.get("sort_order") ?? 99);
  const isFeatured = formData.get("is_featured") === "on";
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;

  const { error } = await service.storage
    .from("site-media")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = service.storage.from("site-media").getPublicUrl(path);
  await service.from("media_assets").insert({
    title,
    alt,
    url: data.publicUrl,
    path,
    bucket: "site-media",
    kind: "image",
    gallery_group: galleryGroup,
    is_featured: isFeatured,
    sort_order: sortOrder
  });

  await logChange("media", title, "Imagen subida");
  revalidatePath("/");
  revalidatePath("/admin/media");
}

export async function updateMediaLibraryAction(formData: FormData) {
  await requireAdmin();
  const service = createSupabaseServiceClient();
  const ids = formData.getAll("media_id").map(String);

  for (const id of ids) {
    const isFeatured = formData.get(`is_featured_${id}`) === "on";
    const galleryGroup = String(formData.get(`gallery_group_${id}`) ?? "general");

    if (isFeatured) {
      await service
        .from("media_assets")
        .update({ is_featured: false })
        .eq("gallery_group", galleryGroup)
        .neq("id", id);
    }

    await service
      .from("media_assets")
      .update({
        title: String(formData.get(`title_${id}`) ?? ""),
        alt: String(formData.get(`alt_${id}`) ?? ""),
        gallery_group: galleryGroup,
        is_featured: isFeatured,
        sort_order: Number(formData.get(`sort_order_${id}`) ?? 99)
      })
      .eq("id", id);
  }

  await logChange("media", "Biblioteca de imágenes", "Galerías actualizadas");
  revalidatePath("/");
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();
  const service = createSupabaseServiceClient();
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");

  if (path) await service.storage.from("site-media").remove([path]);
  await service.from("media_assets").delete().eq("id", id);

  await logChange("media", "Imagen", "Eliminada");
  revalidatePath("/");
  revalidatePath("/admin/media");
}
