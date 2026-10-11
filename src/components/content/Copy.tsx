import type { ReactNode } from "react";
import { isPlaceholder, type CopyValue } from "@/content/placeholder";

export function Copy({ value }: { value: CopyValue }): ReactNode {
  if (!isPlaceholder(value)) return value;
  const note = value.note ?? "Placeholder";
  return (
    <span data-ph="" data-ph-note={note} title={note}>
      {value.text}
    </span>
  );
}
