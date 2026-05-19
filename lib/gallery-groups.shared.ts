export type GalleryLayout = "tall" | "wide" | "normal";

export type GalleryGroup = {
  id: string;
  label: string;
  sortOrder: number;
  layout: GalleryLayout;
};

export const BUILTIN_GALLERY_GROUPS: GalleryGroup[] = [
  { id: "laboratorio", label: "Laboratorio", sortOrder: 1, layout: "tall" },
  { id: "protesis", label: "Prótesis fija", sortOrder: 2, layout: "normal" },
  { id: "diseno-3d", label: "Diseño 3D", sortOrder: 3, layout: "normal" },
  { id: "estetica-dental", label: "Estética dental", sortOrder: 4, layout: "wide" },
  { id: "general", label: "General", sortOrder: 99, layout: "normal" }
];

const LEGACY_LABELS: Record<string, string> = {
  protesis: "Prótesis fija",
  "protesis-fija": "Prótesis fija"
};

export function humanizeGalleryGroupId(id: string) {
  return LEGACY_LABELS[id] ?? id.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function mergeGalleryGroups(customGroups: GalleryGroup[], mediaGroupIds: string[]): GalleryGroup[] {
  const map = new Map<string, GalleryGroup>();

  for (const group of BUILTIN_GALLERY_GROUPS) {
    map.set(group.id, group);
  }

  for (const group of customGroups) {
    map.set(group.id, group);
  }

  for (const id of mediaGroupIds) {
    if (!id || map.has(id)) continue;
    map.set(id, {
      id,
      label: humanizeGalleryGroupId(id),
      sortOrder: 50,
      layout: "normal"
    });
  }

  return Array.from(map.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label, "es")
  );
}

export function galleryGroupLayoutClass(group: GalleryGroup, index: number) {
  const classes = ["gallery-item", "reveal"];
  if (group.layout === "tall" || index === 0) classes.push("tall", "gallery-lab-main");
  if (group.layout === "wide") classes.push("wide");
  if (group.id === "protesis" || group.id === "protesis-fija") classes.push("gallery-protesis-main");
  return classes.join(" ");
}
