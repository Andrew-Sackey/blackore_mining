export type MediaKind = "video" | "image";

export type PlaceholderVariant = "dawn" | "ridge" | "savanna" | "stream" | "forest";

export type MediaItem = {
  id: string;
  kind: MediaKind;
  /**
   * A path under /public (`/media/hero-loop-desktop.mp4`) or an absolute URL.
   * Clips over 4 MB should be uploaded to Vercel Blob and stored here as that URL.
   * Set NEXT_PUBLIC_MEDIA_HOST to the host origin so the content security policy allows it.
   */
  src?: string;
  /** Same rule as `src`: a local path or an absolute URL. */
  poster?: string;
  alt: string;
  shot: string;
  placeholderVariant: PlaceholderVariant;
};

export const mediaItems = [
  {
    id: "hero-loop",
    kind: "video",
    src: "/media/hero-loop-desktop.mp4",
    poster: "/media/hero-loop-poster.jpg",
    alt: "Aerial view of a loader and conveyor working pale earth, tyre tracks circling the ground",
    shot: "Aerial view of a loader and conveyor working pale earth, tyre tracks circling the ground",
    placeholderVariant: "dawn",
  },
  {
    id: "band-savanna-dawn",
    kind: "video",
    alt: "Low drone glide over tall savanna grass at sunrise",
    shot: "Low drone glide over tall savanna grass, sun just above the horizon",
    placeholderVariant: "savanna",
  },
  {
    id: "band-contact-hero",
    kind: "image",
    src: "/media/band-contact-dusk.jpg",
    alt: "A river at dusk, last light on the water and palms along the far bank",
    shot: "A river at dusk, last light on the water and palms along the far bank",
    placeholderVariant: "dawn",
  },
  {
    id: "band-ridge-aerial",
    kind: "video",
    src: "/media/band-ridge-aerial.mp4",
    poster: "/media/band-ridge-aerial-poster.jpg",
    alt: "Forested hills and green fields under a bright sky, with a rocky peak in the distance",
    shot: "Forested hills and green fields under a bright sky, with a rocky peak in the distance",
    placeholderVariant: "ridge",
  },
  {
    id: "band-stream",
    kind: "video",
    alt: "Seasonal stream winding through woodland, seen from above",
    shot: "Seasonal stream winding through woodland, shot from above",
    placeholderVariant: "stream",
  },
  {
    id: "band-badu-briefing",
    kind: "image",
    src: "/media/band-badu-briefing.jpg",
    alt: "Snow-dusted mountain ridge above a hazy valley, late light on the rock",
    shot: "Snow-dusted mountain ridge above a hazy valley, late light on the rock",
    placeholderVariant: "ridge",
  },
  {
    id: "band-laterite-road",
    kind: "image",
    src: "/media/still-outcrop.jpg",
    alt: "Aerial view of a yellow loader working a pile of orange earth, tyre tracks across the ground",
    shot: "Aerial view of a yellow loader working a pile of orange earth, tyre tracks across the ground",
    placeholderVariant: "dawn",
  },
  {
    id: "band-forest-edge",
    kind: "video",
    src: "/media/band-forest-edge.mp4",
    poster: "/media/band-forest-edge-poster.jpg",
    alt: "Aerial view of a dump truck and loader in a sand pit, with a cut bank and trees behind",
    shot: "Aerial view of a dump truck and loader in a sand pit, with a cut bank and trees behind",
    placeholderVariant: "forest",
  },
  {
    id: "band-mine-tunnel",
    kind: "image",
    src: "/media/band-mine-tunnel.jpg",
    alt: "A lit rock tunnel with arched walls, opening onto a railing in the distance",
    shot: "A lit rock tunnel with arched walls, opening onto a railing in the distance",
    placeholderVariant: "ridge",
  },
  {
    id: "still-outcrop",
    kind: "image",
    src: "/media/band-licence-cavern.jpg",
    alt: "A rock cavern lit in warm amber and cool teal, with a paved floor running into the dark",
    shot: "A rock cavern lit in warm amber and cool teal, with a paved floor running into the dark",
    placeholderVariant: "ridge",
  },
  {
    id: "still-river-stones",
    kind: "image",
    src: "/media/still-river-stones.jpg",
    alt: "Rounded river stones in cool light, a large pale cobble among smaller pebbles",
    shot: "Rounded river stones in cool light, a large pale cobble among smaller pebbles",
    placeholderVariant: "ridge",
  },
  {
    id: "still-badu-town",
    kind: "image",
    src: "/media/still-badu-town.jpg",
    alt: "A coastal road curving between dark rock and blue water, seen from above",
    shot: "A coastal road curving between dark rock and blue water, seen from above",
    placeholderVariant: "savanna",
  },
  {
    id: "still-team-field",
    kind: "image",
    alt: "Geologists in the field with maps and GPS",
    shot: "Geologists in the field with maps and GPS (future)",
    placeholderVariant: "forest",
  },
  {
    id: "still-core-tray",
    kind: "image",
    alt: "Drill core laid out in trays",
    shot: "Drill core in trays (future phase, use later)",
    placeholderVariant: "ridge",
  },
  {
    id: "band-bono-panorama",
    kind: "image",
    src: "/media/band-bono-panorama.jpg",
    alt: "Wooded ridge in golden haze, fog filling the valley and houses among the trees",
    shot: "Wooded ridge in golden haze, fog filling the valley and houses among the trees",
    placeholderVariant: "savanna",
  },
  {
    id: "still-access-road",
    kind: "image",
    src: "/media/still-access-road.jpg",
    alt: "Aerial view of a town crossroads, tarred roads through laterite ground and low buildings",
    shot: "Aerial view of a town crossroads, tarred roads through laterite ground and low buildings",
    placeholderVariant: "ridge",
  },
  {
    id: "band-woodland-walk",
    kind: "image",
    src: "/media/band-concession-aerial.jpg",
    alt: "Aerial view of pink sand worked by excavators, with dark water between the banks",
    shot: "Aerial view of pink sand worked by excavators, with dark water between the banks",
    placeholderVariant: "forest",
  },
  {
    id: "still-quartz-float",
    kind: "image",
    src: "/media/still-peak-sunset.jpg",
    alt: "A limestone peak at sunset, with a snow-capped range behind it",
    shot: "A limestone peak at sunset, with a snow-capped range behind it",
    placeholderVariant: "ridge",
  },
  {
    id: "band-survey-pillar",
    kind: "image",
    src: "/media/band-survey-pillar.jpg",
    alt: "Aerial view of grey gravel piles in warm light, with ridges left by machinery",
    shot: "Aerial view of grey gravel piles in warm light, with ridges left by machinery",
    placeholderVariant: "savanna",
  },
  {
    id: "still-field-map",
    kind: "image",
    src: "/media/still-field-map.jpg",
    alt: "A narrow rock passage lit orange, opening to daylight at the far end",
    shot: "A narrow rock passage lit orange, opening to daylight at the far end",
    placeholderVariant: "dawn",
  },
  {
    id: "band-harmattan-haze",
    kind: "image",
    src: "/media/band-about-sunset.jpg",
    alt: "Sunset behind a silhouetted tree, with a bare tree beside it and a dark treeline below",
    shot: "Sunset behind a silhouetted tree, with a bare tree beside it and a dark treeline below",
    placeholderVariant: "dawn",
  },
  {
    id: "still-badu-dusk",
    kind: "image",
    src: "/media/still-badu-dusk.jpg",
    alt: "Sunlit rice terraces stepping down a hillside toward a hazy valley",
    shot: "Sunlit rice terraces stepping down a hillside toward a hazy valley",
    placeholderVariant: "dawn",
  },
  {
    id: "still-community",
    kind: "image",
    src: "/media/still-community.jpg",
    alt: "A market street of rust-red roofs, with people, umbrellas and vehicles along a laterite road",
    shot: "A market street of rust-red roofs, with people, umbrellas and vehicles along a laterite road",
    placeholderVariant: "forest",
  },
] as const satisfies readonly MediaItem[];

export type MediaId = (typeof mediaItems)[number]["id"];

const byId = new Map<string, MediaItem>(mediaItems.map((item) => [item.id, item]));

export function getMedia(id: MediaId): MediaItem {
  const item = byId.get(id);
  if (!item) throw new Error(`Unknown media id: ${id}`);
  return item;
}
