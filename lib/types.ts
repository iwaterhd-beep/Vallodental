export type ContentType = "text" | "textarea" | "richtext" | "url" | "image" | "boolean";

export type ContentEntry = {
  id: string;
  section: string;
  key: string;
  label: string;
  type: ContentType;
  draft_value: string | boolean | null;
  published_value: string | boolean | null;
  sort_order: number;
  updated_at: string;
  published_at: string | null;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export type MediaAsset = {
  id: string;
  title: string;
  alt: string;
  url: string;
  path: string | null;
  kind: "image" | "document";
  bucket: string;
  gallery_group: "laboratorio" | "protesis" | "general" | string | null;
  is_featured: boolean | null;
  sort_order: number | null;
  created_at: string;
};

export type ChangeLog = {
  id: string;
  entity_type: string;
  entity_label: string;
  action: string;
  created_at: string;
};
