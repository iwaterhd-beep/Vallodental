import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ChangeLog, ContentEntry, MediaAsset, Service } from "@/lib/types";

export const getPublishedSiteData = cache(async () => {
  const supabase = createSupabaseServerClient();

  const [{ data: entries }, { data: services }, { data: media }] = await Promise.all([
    supabase
      .from("content_entries")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false })
  ]);

  const content = new Map<string, string | boolean>();
  for (const entry of (entries ?? []) as ContentEntry[]) {
    content.set(`${entry.section}.${entry.key}`, entry.published_value ?? "");
  }

  return {
    content,
    services: (services ?? []) as Service[],
    media: (media ?? []) as MediaAsset[]
  };
});

export async function getAdminData() {
  const supabase = createSupabaseServerClient();

  const [{ data: entries }, { data: services }, { data: media }, { data: changes }] =
    await Promise.all([
      supabase
        .from("content_entries")
        .select("*")
        .order("section", { ascending: true })
        .order("sort_order", { ascending: true }),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("change_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8)
    ]);

  return {
    entries: (entries ?? []) as ContentEntry[],
    services: (services ?? []) as Service[],
    media: (media ?? []) as MediaAsset[],
    changes: (changes ?? []) as ChangeLog[]
  };
}

export function text(content: Map<string, string | boolean>, key: string) {
  const value = content.get(key);
  return typeof value === "string" ? value : "";
}

export function bool(content: Map<string, string | boolean>, key: string) {
  const value = content.get(key);
  return value === true || value === "true";
}
