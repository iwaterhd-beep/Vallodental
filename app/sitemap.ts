import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vallodental.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/aviso-legal.html`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/politica-privacidad.html`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/politica-cookies.html`, lastModified, changeFrequency: "yearly", priority: 0.3 }
  ];
}
