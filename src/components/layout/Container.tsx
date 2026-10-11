import type { ReactNode } from "react";

export function Container({
  wide = false,
  children,
  className,
}: {
  wide?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const classes = ["container", wide ? "container-wide" : "", className ?? ""].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
