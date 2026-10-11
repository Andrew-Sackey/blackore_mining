import type { MediaId } from "@/content/media";
import { getMedia } from "@/content/media";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Media } from "@/components/media/Media";
import { Caption } from "@/components/type/Caption";

const ratioValue = {
  "16/9": "16 / 9",
  "4/5": "4 / 5",
  "1/1": "1 / 1",
  "21/9": "21 / 9",
} as const;

export function MediaFrame({
  id,
  ratio = "16/9",
  caption,
}: {
  id: MediaId;
  ratio?: keyof typeof ratioValue;
  caption?: string;
}) {
  const item = getMedia(id);
  return (
    <figure className="media-figure">
      <ImageReveal>
        <div
          className="media-frame"
          data-ratio={ratio}
          style={ratio === "21/9" ? undefined : { aspectRatio: ratioValue[ratio] }}
        >
          <Media id={id} sizes="(max-width: 767px) 100vw, min(1200px, 90vw)" />
        </div>
      </ImageReveal>
      <Caption as="figcaption">{caption ?? item.shot}</Caption>
    </figure>
  );
}
