import type { ReactNode } from "react";

type Tone = "ink" | "ink-2" | "media";
type Space = "md" | "lg";

export function Section({
  id,
  tone = "ink",
  space = "md",
  children,
  className,
}: {
  id?: string;
  tone?: Tone;
  space?: Space;
  children: ReactNode;
  className?: string;
}) {
  const classes = ["section", className ?? ""].filter(Boolean).join(" ");
  return (
    <section id={id} className={classes} data-tone={tone} data-space={space}>
      {children}
    </section>
  );
}
