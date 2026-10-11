import type { MediaId } from "@/content/media";
import { ph } from "@/content/placeholder";
import { heroTagline, statementTagline } from "@/content/taglines";

/** Approved home hero copy. The intro and hero render these strings as they stand. */
export const home = {
  eyebrow: "Exploration concession · Bono Region, Ghana",
  title: heroTagline,
  titleLead: "Birimian ground,",
  titleTail: "ready to be tested.",
  lede: "A 41.09 km² large-scale concession at Badu, in the Wenchi Municipal District. It sits in the same Paleoproterozoic Birimian terrain that hosts Ghana's major gold belts, and a phased exploration programme is ready to begin.",
  ctaPrimary: "Explore the concession",
  ctaPrimaryHref: "/concession",
  ctaSecondary: "Request licence information",
  ctaSecondaryHref: "/contact",
  stats: [
    { value: "41.09", decimals: 2, unit: "km²", label: "Licence area" },
    { value: "196", decimals: 0, unit: "", label: "Cadastral blocks" },
    { value: "70", decimals: 0, unit: "", label: "Surveyed boundary pillars" },
  ],
  statement: {
    line: statementTagline,
    lede: "Bono sits in Ghana's forest–savanna transition, at the northern end of the Sunyani Basin. Savanna woodland, tall grass and scattered forest cover gently rolling ground, with rains from March to October.",
    mediaId: "band-bono-panorama" as MediaId,
  },
  location: {
    eyebrow: "Location & access",
    title: "A day's drive from Accra.",
    lede: "Badu lies about 340 km north-west of Accra, along the highway through Kumasi and Techiman: six to seven hours by road. Sunyani, the regional capital, is about 70 km away via Wenchi.",
    facts: [
      {
        label: "Road",
        line: "Tarred highway to Techiman, then tar with stretches of laterite gravel to Badu.",
      },
      {
        label: "Power",
        line: "Connected to the national grid, with supply through nearby Wenchi and Drobo.",
      },
      {
        label: "Water",
        line: "Streams and seasonal rivers cross the concession; boreholes serve nearby towns.",
      },
      {
        label: "Network",
        line: "MTN, Telecel and AT coverage, with 3G and 4G in Badu.",
      },
    ],
    frameId: "still-access-road" as MediaId,
    note: "Schematic route. Town positions approximate.",
  },
  geology: {
    eyebrow: "Geological setting",
    title: "Three things the rocks tell us.",
    lede: "The desktop study maps a typical Birimian volcano–sedimentary sequence across the tenement, folded and faulted during the Eburnean orogeny.",
    cards: [
      {
        title: "A layered Birimian sequence",
        body: "Mafic to intermediate volcanic flows and pyroclastics sit alongside turbidites, greywackes, phyllites and schists. Competent volcanic rock fractures readily, which favours vein formation.",
      },
      {
        title: "Crossing fault systems",
        body: "NE–SW and NW–SE faults and shear zones cut the tenement. In Birimian gold systems, intersections like these are where mineralising fluids tend to collect.",
      },
      {
        title: "Granitoid contacts",
        body: "Granitoid bodies intrude the sequence. Their margins concentrate strain and open pathways for hydrothermal fluids, a setting typical of orogenic gold.",
      },
    ],
    frameId: "still-river-stones" as MediaId,
    source:
      "Source: GeoXpert geological desktop study, September 2026. Field mapping and sampling are the next step.",
    link: "Explore the concession geology",
    href: "/concession",
  },
  roadmap: {
    eyebrow: "Exploration roadmap",
    title: "Every phase earns the next.",
    lede: "The programme is phased and evidence-based. Each stage narrows the ground and reduces geological risk before the next, larger commitment.",
    phases: [
      { status: "done" as const, label: "Concession surveyed", detail: "May 2026 · 196 blocks, 70 pillars" },
      { status: "done" as const, label: "Desktop study", detail: "Sep 2026 · GeoXpert Ltd" },
      {
        status: "next" as const,
        number: 1,
        label: "Reconnaissance",
        detail: "Geological and structural mapping, ground truthing, grab sampling",
      },
      {
        status: "planned" as const,
        number: 2,
        label: "Geochemistry",
        detail: "Soil grids, infill over anomalies, rock-chip sampling",
      },
      {
        status: "planned" as const,
        number: 3,
        label: "Target definition",
        detail: "Trenching and auger drilling, ground geophysics where justified",
      },
      {
        status: "planned" as const,
        number: 4,
        label: "Discovery drilling",
        detail: "RC and diamond drilling toward a resource estimate",
      },
    ],
    note: ph(
      "Planned over 12 to 18 months. Indicative budget US$750,000 to US$1,000,000.",
      "Confirm with client before launch",
    ),
    link: "See the licence and full roadmap",
    href: "/licence",
  },
  closing: {
    eyebrow: "Investor enquiries",
    title: "Get the full Badu briefing.",
    body: "Licence details, the desktop study and the exploration plan, shared directly with interested parties.",
    mediaId: "band-badu-briefing" as MediaId,
    primary: "Request licence information",
    primaryHref: "/contact?topic=licence",
    secondary: "Ask for the desktop study",
    secondaryHref: "/contact?topic=desktop-study",
  },
};
