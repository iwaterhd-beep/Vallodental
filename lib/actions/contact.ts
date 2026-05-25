"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { requireAdmin } from "@/lib/auth";

export type ContactSubmitResult =
  | { ok: true; mode: "saved"; message: string }
  | { ok: true; mode: "mailto"; message: string }
  | { ok: false; error: string };

export async function submitContactAction(formData: FormData): Promise<ContactSubmitResult> {
  const name = String(formData.get("nombre") ?? "").trim();
  const clinic = String(formData.get("clinica") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("telefono") ?? "").trim();
  const serviceInterest = String(formData.get("servicio") ?? "").trim();
  const message = String(formData.get("mensaje") ?? "").trim();
  const privacy = formData.get("privacy") === "on";
  const recipient = String(formData.get("recipient") ?? "").trim();

  if (!name || !email) {
    return { ok: false, error: "Indica tu nombre y un email de contacto." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "El email no tiene un formato válido." };
  }

  if (!privacy) {
    return { ok: false, error: "Debes aceptar la política de privacidad para enviar el formulario." };
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name,
      clinic: clinic || null,
      email,
      phone: phone || null,
      service_interest: serviceInterest || null,
      message: message || null
    });

    if (error) {
      if (error.code === "PGRST205") {
        return {
          ok: true,
          mode: "mailto",
          message:
            "No encontramos la base de datos del formulario. Se abrirá tu correo para enviar la consulta."
        };
      }
      return { ok: false, error: error.message };
    }

    await supabase.from("change_logs").insert({
      entity_type: "contact",
      entity_label: name,
      action: `Nueva consulta (${email})`
    });

    return {
      ok: true,
      mode: "saved",
      message: "Consulta recibida. Te responderemos en menos de 24 horas."
    };
  } catch {
    if (!recipient) {
      return { ok: false, error: "No se pudo enviar la consulta. Inténtalo por teléfono o WhatsApp." };
    }

    return {
      ok: true,
      mode: "mailto",
      message: "Se abrirá tu cliente de correo para completar el envío."
    };
  }
}

export async function deleteContactSubmissionAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    const supabase = createSupabaseServiceClient();
    await supabase.from("contact_submissions").delete().eq("id", id);
    revalidatePath("/admin/contact");
    revalidatePath("/admin/dashboard");
  } catch {
    // service role missing
  }
}
