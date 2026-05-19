"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronIcon } from "@/components/site/site-icons";
import type { MediaAsset } from "@/lib/types";

type GallerySectionProps = {
  media: MediaAsset[];
};

export function GallerySection({ media }: GallerySectionProps) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = useMemo(() => {
    return media
      .filter((item) => item.kind === "image")
      .reduce<Record<string, MediaAsset[]>>((acc, item) => {
        const group = item.gallery_group ?? "general";
        acc[group] = [...(acc[group] ?? []), item].sort(
          (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)
        );
        return acc;
      }, {});
  }, [media]);

  const labImages = groups.laboratorio ?? [];
  const protesisImages = groups.protesis ?? [];
  const generalImages = groups.general ?? [];

  const tiles = [
    pickFeatured(labImages),
    pickFeatured(protesisImages),
    generalImages[0],
    generalImages[1]
  ].filter(Boolean) as MediaAsset[];

  const activeImages = activeGroup ? groups[activeGroup] ?? [] : [];
  const activeImage = activeImages[activeIndex];

  useEffect(() => {
    if (!activeGroup) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveGroup(null);
      if (event.key === "ArrowLeft") setActiveIndex((index) => wrap(index - 1, activeImages.length));
      if (event.key === "ArrowRight") setActiveIndex((index) => wrap(index + 1, activeImages.length));
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeGroup, activeImages.length]);

  return (
    <>
      <div className="gallery-grid">
        {tiles.map((item, index) => {
          const group = item.gallery_group ?? "general";
          return (
            <button
              className={`gallery-item reveal ${index === 0 ? "tall gallery-lab-main" : ""} ${index === 1 ? "gallery-protesis-main" : ""} ${index === 3 ? "wide" : ""}`}
              key={item.id}
              type="button"
              onClick={() => {
                setActiveGroup(group);
                setActiveIndex(Math.max(0, (groups[group] ?? []).findIndex((image) => image.id === item.id)));
              }}
            >
              <Image src={item.url} alt={item.alt} width={900} height={900} />
              <div className="gallery-overlay">
                <span className="gallery-overlay-label">{item.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className={`lab-lightbox ${activeGroup ? "active" : ""}`}
        aria-hidden={!activeGroup}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveGroup(null);
        }}
      >
        <button className="lab-lightbox-close" type="button" onClick={() => setActiveGroup(null)} aria-label="Cerrar visor">
          ×
        </button>
        {activeImages.length > 1 ? (
          <button
            className="lab-lightbox-nav prev"
            type="button"
            onClick={() => setActiveIndex((index) => wrap(index - 1, activeImages.length))}
            aria-label="Imagen anterior"
          >
            <ChevronIcon direction="left" />
          </button>
        ) : null}
        {activeImage ? (
          <Image
            className="lab-lightbox-image"
            src={activeImage.url}
            alt={activeImage.alt}
            width={1400}
            height={1000}
          />
        ) : null}
        {activeImages.length > 1 ? (
          <button
            className="lab-lightbox-nav next"
            type="button"
            onClick={() => setActiveIndex((index) => wrap(index + 1, activeImages.length))}
            aria-label="Imagen siguiente"
          >
            <ChevronIcon direction="right" />
          </button>
        ) : null}
      </div>
    </>
  );
}

function pickFeatured(images: MediaAsset[]) {
  return images.find((item) => item.is_featured) ?? images[0];
}

function wrap(index: number, length: number) {
  if (!length) return 0;
  return (index + length) % length;
}
