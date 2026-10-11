import type { ReactNode } from "react";
import type { MediaId } from "@/content/media";
import { isPlaceholder, type CopyValue } from "@/content/placeholder";
import { Copy } from "@/components/content/Copy";
import { Parallax } from "@/components/motion/Parallax";
import { Media } from "@/components/media/Media";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Heading } from "@/components/type/Heading";

export function MediaBand({
  id,
  height = "short",
  align = "end",
  shade,
  overlay,
  children,
}: {
  id: MediaId;
  height?: "short" | "tall";
  align?: "end" | "statement" | "center" | "start";
  shade?: "left" | "center";
  overlay?: {
    eyebrow?: string;
    heading?: CopyValue;
    caption?: string;
  };
  children?: ReactNode;
}) {
  const structured = overlay ? (
    <>
      {overlay.eyebrow ? <Eyebrow>{overlay.eyebrow}</Eyebrow> : null}
      {overlay.heading ? (
        <Heading>
          {isPlaceholder(overlay.heading) ? <Copy value={overlay.heading} /> : overlay.heading}
        </Heading>
      ) : null}
      {overlay.caption ? <Caption>{overlay.caption}</Caption> : null}
    </>
  ) : null;
  const content = children ?? structured;

  return (
    <div className="media-band" data-height={height} data-shade={shade}>
      <Parallax className="media-band-parallax">
        <Media id={id} sizes="100vw" />
      </Parallax>
      <div className="media-band-fade media-band-fade-top" aria-hidden="true" />
      <div className="media-band-fade media-band-fade-bottom" aria-hidden="true" />
      {shade ? <div className="media-band-shade" data-shade={shade} aria-hidden="true" /> : null}
      {content ? (
        <div className="media-band-overlay" data-align={align}>
          {content}
        </div>
      ) : null}
    </div>
  );
}
