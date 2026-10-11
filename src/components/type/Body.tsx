import type { ReactNode } from "react";

export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={["type-body", className].filter(Boolean).join(" ")}>{children}</p>;
}
