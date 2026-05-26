import type { Metadata } from "next";
import { LegalDocument } from "@/components/site/legal-document";
import { getPublishedSiteData, text } from "@/lib/content";
import { LEGAL_PAGES } from "@/lib/legal-pages";

const page = LEGAL_PAGES[1];

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPublishedSiteData();
  const title = text(content, page.titleKey) || page.defaults.title;
  const description = text(content, page.metaKey) || page.defaults.meta;

  return {
    title: `${title} · Vallo Dental`,
    description
  };
}

export default async function PoliticaPrivacidadPage() {
  const { content } = await getPublishedSiteData();
  return <LegalDocument page={page} content={content} />;
}
