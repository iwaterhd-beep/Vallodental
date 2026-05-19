import type { Metadata } from "next";
import { getPublishedSiteData, text } from "@/lib/content";
import { SiteHome } from "@/components/site/site-home";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getPublishedSiteData();

  return {
    title: text(content, "seo.title"),
    description: text(content, "seo.description"),
    openGraph: {
      title: text(content, "seo.title"),
      description: text(content, "seo.description"),
      images: text(content, "hero.image") ? [text(content, "hero.image")] : []
    }
  };
}

export default async function HomePage() {
  const data = await getPublishedSiteData();
  return <SiteHome {...data} />;
}
