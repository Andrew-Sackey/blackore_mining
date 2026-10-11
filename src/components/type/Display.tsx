import type { ReactNode } from "react";

type Tag = "h1" | "h2" | "p";

export function Display({
  as: Tag = "h1",
  children,
  className,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
}) {
  const classes = ["type-display", className ?? ""].filter(Boolean).join(" ");
  return <Tag className={classes}>{children}</Tag>;
}
