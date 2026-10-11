import type { MediaId } from "@/content/media";
import { ph, type CopyValue } from "@/content/placeholder";

export const concession = {
  eyebrow: "The Badu concession · Desktop study",
  title: "Forty-one square kilometres of Birimian terrain.",
  lede: ph(
    "The concession sits at Badu, in the Wenchi Municipal District. The boundary, geology, and setting will be told from the desktop study.",
    "Concession lede",
  ),
  mediaId: "band-ridge-aerial" as MediaId,
};

export const licenceGlance = {
  eyebrow: "The licence boundary",
  title: "The ground the licence covers.",
};

export const licenceRows: { label: string; parts: CopyValue[] }[] = [
  { label: "Holder", parts: ["BlackOre Mining Ltd"] },
  {
    label: "Licence type",
    parts: ["Large-scale concession ", ph("Confirm exact licence type and number with client")],
  },
  { label: "Status", parts: [ph("Granted / under application, confirm with client")] },
  { label: "Locality", parts: ["Badu, Wenchi Municipal District, Bono Region"] },
  { label: "Area", parts: ["41.09 km² · 196 cadastral blocks"] },
  { label: "Boundary", parts: ["70 surveyed pillars, WGS 84 / UTM zone 30N"] },
  {
    label: "Survey plan",
    parts: ["FS 0703B4, scale 1:120,000, certified 18 May 2026 by a licensed surveyor"],
  },
  { label: "Geological map sheet", parts: ["Wenchi 0703B (Geological Survey of Ghana)"] },
];

export const regional = {
  eyebrow: "Regional setting",
  title: "From Ghana's gold belts down to Badu.",
  paragraphs: [
    "Ghana's main gold province sits in Paleoproterozoic Birimian rocks: volcanic and sedimentary successions folded and metamorphosed during the Eburnean orogeny, then intruded by granitoids.",
    "Major deposits tend to cluster along structural corridors, near volcanic–sedimentary contacts, regional shear zones and the smaller faults that branch from them.",
    "Badu sits at the northern end of the Sunyani Basin, in the Badu–Drobo–Wenchi corridor. The wider Bono Region carries Birimian metasediments in the west, with metavolcanics and granitic intrusions also present.",
  ],
};

export const localGeology = {
  eyebrow: "Local geology",
  title: "Read the ground, layer by layer.",
  lede: "The desktop study's geology map, redrawn from its source data and aligned to the surveyed boundary. Each layer colours in as the story reaches it.",
  source:
    "Digitised from Figure 3 of the GeoXpert geological desktop study (September 2026), compiled after the Geological Survey of Ghana Wenchi sheet 0703B. Unit shares are approximate, measured on the digitised map. Field mapping has not yet been carried out.",
  replay: "↻ Replay tour",
};

export type TourGroup = "volcanics" | "metasediments" | "granitoid";

export const GEO_TOUR_STEPS: {
  id: string;
  chip: string;
  title: string;
  body: string;
  group?: TourGroup;
}[] = [
  {
    id: "overview",
    chip: "Overview",
    title: "A Birimian volcano–sedimentary sequence",
    body: "The tenement sits in the Badu–Drobo–Wenchi corridor at the northern end of the Sunyani Basin. Volcanic units, metasediments, schists and granitoid intrusions were all deformed during the Eburnean orogeny.",
  },
  {
    id: "volcanics",
    chip: "Volcanics",
    group: "volcanics",
    title: "Volcanic rock under most of the ground",
    body: "Mafic to intermediate flows and pyroclastics. These competent rocks fracture readily under stress, which favours vein development and structurally controlled mineralisation.",
  },
  {
    id: "metasediments",
    chip: "Metasediments",
    group: "metasediments",
    title: "Sheared metasediments in the west",
    body: "Turbidites, greywackes, phyllites and schists with foliation and shear fabrics. Units like these often host quartz vein systems.",
  },
  {
    id: "granitoid",
    chip: "Granitoid",
    group: "granitoid",
    title: "A granitoid body in the south",
    body: "Discrete granitoid intrusions cut the sequence. Their margins concentrate strain, creating brittle zones that channel hydrothermal fluids.",
  },
  {
    id: "structures",
    chip: "Structures",
    title: "Faults across the boundary",
    body: "NE–SW and NW–SE faults and shear zones form a complex network across the tenement. Intersections and zones of dense lineaments are the most favourable sites for gold deposition.",
  },
  {
    id: "drainage",
    chip: "Drainage",
    title: "Streams that follow the faults",
    body: "Many streams run along fault traces. These corridors carry geochemical dispersion, which makes them natural first lines for reconnaissance sampling.",
  },
  {
    id: "concession",
    chip: "The concession",
    title: "Where it comes together",
    body: "Inside the 41.09 km² boundary: volcanic ground, granitoid contacts and sheared metasedimentary belts, crossed by faults. This is the combination the desktop study identifies as prospective for orogenic gold. Field work will test it.",
  },
];

export const comparison = {
  eyebrow: "Comparable settings",
  title: "A setting Ghana's geologists know well.",
  lede: "The desktop study compares Badu's geological setting with some of Ghana's established gold operations. The comparison is about the type of ground, not the size of any deposit.",
  note: "Comparison of geological setting only, as summarised in the desktop study. It says nothing about the presence, size or grade of mineralisation at Badu.",
  columns: ["Project", "Host rocks", "Structural control", "Intrusive influence", "Deposit style"] as const,
  rows: [
    {
      project: "Badu",
      host: "Birimian volcanics, metasediments and granitoids",
      structure: "NE–SW and NW–SE faults and shear zones",
      intrusive: "Granitoid margins as strain concentrators",
      style: "Orogenic, shear-hosted quartz veins (target)",
    },
    {
      project: "Obuasi",
      host: "Birimian volcano-sedimentary belts, graphitic schists",
      structure: "Major shear zones, multi-phase deformation",
      intrusive: "Granitoids influence fluid flow",
      style: "Mesothermal quartz–sulphide lodes",
    },
    {
      project: "Prestea–Bogoso",
      host: "Birimian metasediments, schists, volcanics",
      structure: "Strong NE–SW shear zones",
      intrusive: "Minor intrusions",
      style: "Shear-hosted quartz veins",
    },
    {
      project: "Wassa",
      host: "Birimian metasedimentary belts",
      structure: "Broad shear corridor, ductile zones",
      intrusive: "Intrusions nearby",
      style: "Disseminated and vein-hosted",
    },
    {
      project: "Edikan",
      host: "Birimian volcano-sedimentary sequences",
      structure: "Major fault corridors",
      intrusive: "Significant granitoids",
      style: "Shear-zone and intrusion-related",
    },
    {
      project: "Chirano",
      host: "Birimian volcanics and sediments",
      structure: "Shear zones",
      intrusive: "Multiple intrusive phases",
      style: "Vein-hosted and disseminated",
    },
    {
      project: "Namdini",
      host: "Birimian metavolcanics and metasediments",
      structure: "Major shear zone (Nangodi belt)",
      intrusive: "Diorite intrusions",
      style: "Large-scale disseminated",
    },
  ],
};

export const reportGlance = {
  eyebrow: "The desktop study",
  title: "The groundwork, documented.",
  preparedBy: "GeoXpert Ltd",
  facts: ["September 2026", "12 pages", "70 pillars scheduled"],
  summary: [
    {
      label: "What it is",
      text: "A geological desktop study of the Badu concession, prepared by principal geologist Bernard Asare of GeoXpert Ltd.",
    },
    {
      label: "What it does",
      text: "It combines the surveyed concession plan with published regional geology, the Geological Survey's Wenchi map sheet and environmental data, then judges how prospective the ground is and how to explore it.",
    },
    {
      label: "What it shows",
      text: "Birimian volcanic and metasedimentary rocks, granitoid contacts and crossing faults: a setting comparable to Ghana's established gold belts, and a phased plan to test it.",
    },
    {
      label: "What it is not",
      text: "A discovery. No samples have been taken yet. The study sets out the case that field work will test.",
    },
  ],
  inside: "Inside the report",
  request: "Request the full report",
  requestHref: "/contact?topic=desktop-study",
  note: "Shared with interested parties on request.",
} as const;

export const surveyCaption = "Surveyed plan of the concession, FS 0703B4, 18 May 2026.";

export const quartzCaption = "A limestone peak at sunset, with a snow-capped range behind it.";
