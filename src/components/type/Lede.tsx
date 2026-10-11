import type { ReactNode } from "react";

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={["type-lede", className].filter(Boolean).join(" ")}>{children}</p>;
}
