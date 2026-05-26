import type { LegalPageConfig } from "@/lib/legal-pages";
import { text } from "@/lib/content";

type ContentMap = Map<string, string | boolean>;

function legalText(content: ContentMap, key: string, fallback: string) {
  const value = text(content, key);
  return value.trim() ? value : fallback;
}

export function LegalDocument({ page, content }: { page: LegalPageConfig; content: ContentMap }) {
  const title = legalText(content, page.titleKey, page.defaults.title);
  const updated = legalText(content, page.updatedKey, page.defaults.updated);
  const body = legalText(content, page.bodyKey, page.defaults.body);

  return (
    <>
      <header className="legal-header">
        <a className="legal-back" href="/">
          ← Volver a Vallo Dental
        </a>
      </header>
      <main className="legal-main">
        <h1>{title}</h1>
        <p className="legal-updated">{updated}</p>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </main>
    </>
  );
}
