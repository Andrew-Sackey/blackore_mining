import type { ReactNode } from "react";

export function Grid({ children, className }: { children: ReactNode; className?: string }) {
  const classes = ["grid-12", className ?? ""].filter(Boolean).join(" ");
  return <div className={classes}>{children}</div>;
}
