"use client";

import { useEffect, useId, useRef, useState } from "react";

type ServiceSelectProps = {
  name: string;
  id: string;
  options: string[];
  placeholder?: string;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const items = options.map(stripHtml).filter(Boolean);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(next: string) {
    setValue(next);
    setOpen(false);
  }

  return (
    <div className="form-select-custom" ref={rootRef}>
      <input name={name} type="hidden" value={value} />
      <button
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`form-input form-select form-select-trigger${value ? "" : " is-placeholder"}`}
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        {value || placeholder}
      </button>
      {open ? (
        <ul className="form-select-menu" id={listId} role="listbox">
          <li role="none">
            <button
              className={`form-select-option${!value ? " is-active" : ""}`}
              role="option"
              type="button"
              aria-selected={!value}
              onClick={() => choose("")}
            >
              {placeholder}
            </button>
          </li>
          {items.map((label) => (
            <li key={label} role="none">
              <button
                className={`form-select-option${value === label ? " is-active" : ""}`}
                role="option"
                type="button"
                aria-selected={value === label}
                onClick={() => choose(label)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
