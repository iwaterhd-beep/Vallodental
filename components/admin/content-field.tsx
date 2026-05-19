import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContentEntry } from "@/lib/types";

function displayValue(value: ContentEntry["draft_value"]) {
  if (value === true || value === "true") return "true";
  if (value === false || value === "false") return "false";
  if (value == null) return "";
  return String(value);
}

function valueIsTrue(value: ContentEntry["draft_value"]) {
  return value === true || value === "true";
}

export function ContentField({ entry }: { entry: ContentEntry }) {
  const name = `value_${entry.id}`;
  const defaultValue = displayValue(entry.draft_value);
  const showDraftHint = entry.draft_value !== entry.published_value;

  return (
    <div className="grid gap-2">
      <input name="entry_id" type="hidden" value={entry.id} />
      <Label htmlFor={entry.id}>{entry.label}</Label>
      {entry.type === "boolean" ? (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            id={entry.id}
            name={name}
            type="checkbox"
            defaultChecked={valueIsTrue(entry.draft_value)}
            value="true"
          />
          Activado
        </label>
      ) : entry.type === "textarea" || entry.type === "richtext" ? (
        <Textarea id={entry.id} name={name} defaultValue={defaultValue} rows={entry.type === "richtext" ? 4 : 3} />
      ) : (
        <Input id={entry.id} name={name} defaultValue={defaultValue} type={entry.type === "url" ? "url" : "text"} />
      )}
      {showDraftHint ? (
        <p className="text-xs text-gold">Borrador distinto a la versión publicada.</p>
      ) : null}
    </div>
  );
}
