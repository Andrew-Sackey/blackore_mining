import type { ReactNode } from "react";

type Tag = "p" | "span" | "figcaption";

export function Caption({
  as: Tag = "p",
  children,
  className,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
}) {
  return <Tag className={["type-caption", className].filter(Boolean).join(" ")}>{children}</Tag>;
}
