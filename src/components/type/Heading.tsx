import type { ReactNode } from "react";

type Tag = "h2" | "h3" | "p";

export function Heading({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: Tag;
  children: ReactNode;
  className?: string;
}) {
  const classes = ["type-heading", className ?? ""].filter(Boolean).join(" ");
  return <Tag className={classes}>{children}</Tag>;
}

export function Dim({ children }: { children: ReactNode }) {
  return <span className="type-dim">{children}</span>;
}
