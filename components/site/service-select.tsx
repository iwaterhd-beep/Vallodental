"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ServiceSelectProps = {
  name: string;
  id: string;
  options: string[];
  placeholder?: string;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function ServiceSelect({
  name,
  id,
  options,
  placeholder = "Selecciona un servicio"
}: ServiceSelectProps) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [menuStyle, setMenuStyle] = useState<MenuPosition>({ top: 0, left: 0, width: 0 });

  const items = options.map(stripHtml).filter(Boolean);

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateMenuPosition() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenuStyle({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width
    });
  }

  function toggleOpen() {
    if (open) {
      setOpen(false);
      return;
    }
    updateMenuPosition();
    setOpen(true);
  }

  function choose(next: string) {
    setValue(next);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-service-select-menu]")) return;
      setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function onLayoutChange() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("scroll", onLayoutChange, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("scroll", onLayoutChange, true);
    };
  }, [open]);

  const menu = open ? (
    <ul
      className="form-select-menu form-select-menu--portal"
      data-service-select-menu
      id={listId}
      role="listbox"
      style={{
        top: menuStyle.top,
        left: menuStyle.left,
        width: menuStyle.width
      }}
    >
      <li role="none">
        <div
          className={`form-select-option${!value ? " is-active" : ""}`}
          role="option"
          tabIndex={0}
          aria-selected={!value}
          onClick={() => choose("")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              choose("");
            }
          }}
        >
          {placeholder}
        </div>
      </li>
      {items.map((label) => (
        <li key={label} role="none">
          <div
            className={`form-select-option${value === label ? " is-active" : ""}`}
            role="option"
            tabIndex={0}
            aria-selected={value === label}
            onClick={() => choose(label)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                choose(label);
              }
            }}
          >
            {label}
          </div>
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <div className="form-select-custom">
      <input name={name} type="hidden" value={value} />
      <button
        ref={triggerRef}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`form-input form-select form-select-trigger${value ? "" : " is-placeholder"}`}
        id={id}
        type="button"
        onClick={toggleOpen}
      >
        {value || placeholder}
      </button>
      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}
