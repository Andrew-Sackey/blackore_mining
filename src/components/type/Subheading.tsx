import type { ReactNode } from "react";

export function Subheading({ children }: { children: ReactNode }) {
  return <p className="type-subheading">{children}</p>;
}
