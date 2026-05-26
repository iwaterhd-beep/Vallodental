"use client";

import { useState, useTransition } from "react";
import { submitContactAction } from "@/lib/actions/contact";
import { ServiceSelect } from "@/components/site/service-select";

type ContactFormProps = {
  recipientEmail: string;
  submitLabel: string;
  noteHtml: string;
  serviceOptions: string[];
};

export function ContactForm({ recipientEmail, submitLabel, noteHtml, serviceOptions }: ContactFormProps) {
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; text: string }>({
    type: "idle",
    text: ""
  });
  const [pending, startTransition] = useTransition();
  const [selectKey, setSelectKey] = useState(0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("recipient", recipientEmail);

    startTransition(async () => {
      const result = await submitContactAction(formData);

      if (result.ok) {
        const mailtoBody = {
          name: String(formData.get("nombre") ?? ""),
          clinic: String(formData.get("clinica") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("telefono") ?? ""),
          service: String(formData.get("servicio") ?? ""),
          message: String(formData.get("mensaje") ?? "")
        };

        setStatus({ type: "success", text: result.message });
        form.reset();
        setSelectKey((key) => key + 1);

        if (result.mode === "mailto") {
          const body = [
            `Nombre: ${mailtoBody.name}`,
            `Clínica: ${mailtoBody.clinic}`,
            `Email: ${mailtoBody.email}`,
            `Teléfono: ${mailtoBody.phone}`,
            `Servicio: ${mailtoBody.service}`,
            "",
            mailtoBody.message
          ].join("\n");
          const params = new URLSearchParams({
            subject: `Consulta web — ${mailtoBody.name}`,
            body
          });
          window.location.href = `mailto:${recipientEmail}?${params.toString()}`;
        }
        return;
      }

      setStatus({ type: "error", text: result.error });
    });
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row reveal">
        <div className="form-label-group">
          <label className="form-label" htmlFor="nombre">
            Nombre
          </label>
          <input className="form-input" id="nombre" name="nombre" placeholder="Tu nombre" required autoComplete="name" />
        </div>
        <div className="form-label-group">
          <label className="form-label" htmlFor="clinica">
            Clínica / empresa
          </label>
          <input className="form-input" id="clinica" name="clinica" placeholder="Nombre de tu clínica" autoComplete="organization" />
        </div>
      </div>
      <div className="form-row reveal">
        <div className="form-label-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input className="form-input" id="email" name="email" placeholder="tu@email.com" required type="email" autoComplete="email" />
        </div>
        <div className="form-label-group">
          <label className="form-label" htmlFor="telefono">
            Teléfono
          </label>
          <input className="form-input" id="telefono" name="telefono" placeholder="+34 000 000 000" type="tel" autoComplete="tel" />
        </div>
      </div>
      <div className="form-label-group reveal">
        <label className="form-label" htmlFor="servicio">
          Servicio de interés
        </label>
        <ServiceSelect key={selectKey} id="servicio" name="servicio" options={serviceOptions} />
      </div>
      <div className="form-label-group reveal">
        <label className="form-label" htmlFor="mensaje">
          Mensaje
        </label>
        <textarea className="form-textarea" id="mensaje" name="mensaje" placeholder="Contáctanos" rows={5} />
      </div>
      <label className="form-privacy reveal">
        <input name="privacy" type="checkbox" required />
        <span>
          He leído y acepto la{" "}
          <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer">
            política de privacidad
          </a>
          .
        </span>
      </label>
      <div className="form-submit reveal">
        <button className="form-submit-btn" disabled={pending} type="submit">
          {pending ? "Enviando…" : submitLabel}
        </button>
        <p className="form-note" dangerouslySetInnerHTML={{ __html: noteHtml }} />
        {status.type !== "idle" ? (
          <p className={`form-status form-status--${status.type}`} role="status" aria-live="polite">
            {status.text}
          </p>
        ) : (
          <p className="form-status" aria-live="polite" />
        )}
      </div>
    </form>
  );
}
