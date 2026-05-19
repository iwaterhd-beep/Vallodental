"use client";

import { useMemo, useState } from "react";
import type { GalleryGroup } from "@/lib/gallery-groups.shared";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryGroupSelectProps = {
  groups: GalleryGroup[];
  name: string;
  defaultValue?: string;
  selectClassName?: string;
  showCreate?: boolean;
};

export function GalleryGroupSelect({
  groups,
  name,
  defaultValue = "laboratorio",
  selectClassName = "h-10 w-full rounded-md border border-input bg-background/80 px-3 text-sm",
  showCreate = true
}: GalleryGroupSelectProps) {
  const [items, setItems] = useState(groups);
  const [selected, setSelected] = useState(defaultValue);
  const [newLabel, setNewLabel] = useState("");
  const [pendingLabel, setPendingLabel] = useState("");

  const options = useMemo(() => {
    const map = new Map(items.map((group) => [group.id, group]));
    if (selected && !map.has(selected)) {
      map.set(selected, {
        id: selected,
        label: selected.replace(/-/g, " "),
        sortOrder: 50,
        layout: "normal"
      });
    }
    return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label, "es"));
  }, [items, selected]);

  function addGroup() {
    const label = newLabel.trim();
    if (!label) return;
    const id = slugify(label);
    const entry: GalleryGroup = { id, label, sortOrder: 50, layout: "normal" };
    setItems((current) => {
      if (current.some((group) => group.id === id)) return current;
      return [...current, entry];
    });
    setSelected(id);
    setPendingLabel(label);
    setNewLabel("");
  }

  return (
    <div className="grid gap-2">
      <select
        className={selectClassName}
        name={name}
        value={selected}
        onChange={(event) => {
          setSelected(event.target.value);
          setPendingLabel("");
        }}
      >
        {options.map((group) => (
          <option key={group.id} value={group.id}>
            {group.label}
          </option>
        ))}
      </select>
      <input name="gallery_group_new_label" type="hidden" value={pendingLabel} readOnly />
      {showCreate ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Crear apartado (ej. Implantes)"
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addGroup();
              }
            }}
          />
          <Button type="button" variant="secondary" className="shrink-0" onClick={addGroup}>
            Crear
          </Button>
        </div>
      ) : null}
    </div>
  );
}
