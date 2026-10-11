import type { ReactNode } from "react";

type Tag = "p" | "span" | "h2";

export function Eyebrow({ as: Tag = "p", children }: { as?: Tag; children: ReactNode }) {
  return <Tag className="type-eyebrow">{children}</Tag>;
}
