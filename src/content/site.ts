import type { MediaId } from "@/content/media";
import { ph } from "@/content/placeholder";

export const nav = [
  { href: "/about", label: "About" },
  { href: "/concession", label: "The Concession" },
  { href: "/licence", label: "Licence & Roadmap" },
  { href: "/contact", label: "Contact" },
] as const;

export const contact = {
  email: ph("info@blackoremining.com", "Contact email"),
  phone: ph("+233 00 000 0000", "Contact phone"),
  office: ph("Accra, Ghana", "Office location"),
};

export const footer = {
  concession: ["Badu", "Wenchi Municipal District", "Bono Region"],
  coordinates: "7°39′N 2°06′W",
  requestLabel: "Request licence information",
  requestHref: "/contact",
  copyright: "© 2026 BlackOre Mining Ltd.",
  disclaimer:
    "BlackOre is an exploration-stage company. Information on this site draws on a geological desktop study and does not describe a mineral resource or reserve.",
};

/**
 * Short landscape band above the footer. Home draws its own closing band.
 * Contact has none.
 */
const footerBands: Record<string, MediaId> = {
  "/about": "still-badu-town",
  "/concession": "band-mine-tunnel",
  "/licence": "still-outcrop",
};

/** Pillar coordinates stay off the site until the client asks for a public CSV. */
export const SHOW_PILLAR_DOWNLOAD = false;

/** The survey plan carries the surveyor's seal and signature. */
export const SHOW_SURVEY_PLAN = false;

/** Team portraits stay on until the client asks for the grid to come down. */
export const SHOW_TEAM = true;

export function footerBandFor(pathname: string): MediaId | null {
  if (pathname === "/" || pathname === "/contact" || pathname === "/privacy") return null;
  return footerBands[pathname] ?? "band-stream";
}
