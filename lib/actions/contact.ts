"use server";

import { createSupabaseServiceClient } from "@/lib/supabase/service";

export type ContactSubmitResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function submitContactAction(formData: FormData): Promise<ContactSubmitResult> {
  const name = String(formData.get("nombre") ?? "").trim();
  const clinic = String(formData.get("clinica") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("telefono") ?? "").trim();
  const service = String(formData.get("servicio") ?? "").trim();
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
    const service = createSupabaseServiceClient();
    const { error } = await service.from("contact_submissions").insert({
      name,
      clinic: clinic || null,
      email,
      phone: phone || null,
      service_interest: service || null,
      message: message || null
    });

    if (error) {
      if (error.code === "PGRST205") {
        return {
          ok: true,
          message:
            "Se abrirá tu cliente de correo para completar el envío. Si no se abre, escríbenos directamente por email o WhatsApp."
        };
      }
      return { ok: false, error: error.message };
    }

    await service.from("change_logs").insert({
      entity_type: "contact",
      entity_label: name,
      action: `Nueva consulta (${email})`
    });

    return {
      ok: true,
      message: "Consulta recibida. Te responderemos en menos de 24 horas."
    };
  } catch {
    if (!recipient) {
      return { ok: false, error: "No se pudo enviar la consulta. Inténtalo por teléfono o WhatsApp." };
    }

    return {
      ok: true,
      message:
        "Se abrirá tu cliente de correo para completar el envío. Si no se abre, escríbenos directamente por email o WhatsApp."
    };
  }
}
