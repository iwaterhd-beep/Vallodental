import { mergeGalleryGroups, type GalleryGroup, type GalleryLayout } from "@/lib/gallery-groups.shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type { GalleryGroup, GalleryLayout } from "@/lib/gallery-groups.shared";
export { BUILTIN_GALLERY_GROUPS, humanizeGalleryGroupId, galleryGroupLayoutClass } from "@/lib/gallery-groups.shared";

export async function getGalleryGroups(): Promise<GalleryGroup[]> {
  const supabase = createSupabaseServerClient();

  const [{ data: customRows, error: groupsError }, { data: mediaRows }] = await Promise.all([
    supabase.from("gallery_groups").select("id, label, sort_order, layout").order("sort_order", { ascending: true }),
    supabase.from("media_assets").select("gallery_group")
  ]);

  const customGroups: GalleryGroup[] = (groupsError?.code === "PGRST205" ? [] : customRows ?? []).map((row) => ({
    id: row.id as string,
    label: row.label as string,
    sortOrder: (row.sort_order as number) ?? 99,
    layout: ((row.layout as GalleryLayout) || "normal") as GalleryLayout
  }));

  const mediaGroupIds = Array.from(
    new Set(
      (mediaRows ?? [])
        .map((row) => row.gallery_group as string | null)
        .filter((value): value is string => Boolean(value))
    )
  );

  return mergeGalleryGroups(customGroups, mediaGroupIds);
}
