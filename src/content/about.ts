import type { MediaId } from "@/content/media";
import { ph, type CopyValue } from "@/content/placeholder";

const teamNote = "Client to supply names, roles, bios and photos";

/**
 * Site colours from GEO_UNITS, in the order Van, Bsa, Gsb, Vyb.
 * Copied here so About does not load geology-map.ts.
 */
export const coreRocks = [
  { code: "Van", color: "#D9A36E", share: 0.18 },
  { code: "Bsa", color: "#D8BC72", share: 0.31 },
  { code: "Gsb", color: "#E6C3B3", share: 0.23 },
  { code: "Vyb", color: "#7A3F1D", share: 0.28 },
] as const;

export const coreDepths = [0, 25, 50, 75, 100] as const;

export const aboutHero = {
  eyebrow: "About BlackOre",
  title: "Patient exploration, grounded in geology.",
  lede: "Who BlackOre is, why the work is at Badu, and how the company is set up to explore.",
  mediaId: "band-forest-edge" as MediaId,
};

export const aboutIntro = {
  eyebrow: "About BlackOre",
  statement: ph(
    "We explore one concession, carefully, and say plainly what we know.",
    "Client to confirm",
  ),
  lede: ph(
    "BlackOre Mining Ltd is an exploration company focused on the Paleoproterozoic Birimian terrain of Ghana's Bono Region. Our first project is the 41.09 km² Badu concession in the Wenchi Municipal District.",
    "Client to confirm company description",
  ),
  facts: [
    { label: "Founded", value: ph("2025") },
    { label: "Headquarters", value: ph("Accra, Ghana") },
    { label: "Focus", value: "Gold exploration, Bono Region" as CopyValue },
    { label: "Stage", value: "Exploration" as CopyValue },
  ],
};

export const aboutStory = {
  eyebrow: "Our story",
  title: "Read from the top down.",
  chapters: [
    {
      depth: "0–25 m",
      title: "Where it started",
      paragraphs: [
        ph(
          "BlackOre was founded by a team with roots in Ghana's mining sector, set on finding the next generation of Birimian gold projects outside the crowded southern belts.",
          "Client to supply origin story",
        ),
      ] as CopyValue[],
    },
    {
      depth: "25–50 m",
      title: "Why Badu",
      paragraphs: [
        "The Badu concession sits at the northern end of the Sunyani Basin, in Birimian ground with volcanic units, sheared metasediments and granitoid contacts crossed by NE–SW and NW–SE faults. It is a day's drive from Accra, on grid power and mobile networks, with streams across the licence.",
        ph(
          "We chose it because the geology fits and the ground has seen little modern exploration.",
          "Confirm the 'little modern exploration' claim before publishing",
        ),
      ] as CopyValue[],
    },
    {
      depth: "50–75 m",
      title: "How we got here",
      paragraphs: [
        "The concession was surveyed in May 2026, and GeoXpert Ltd completed a geological desktop study in September 2026 that recommends a phased exploration programme.",
        ph("Add licence grant and any other milestones once confirmed.", "Client to add confirmed milestones"),
      ] as CopyValue[],
    },
    {
      depth: "75–100 m",
      title: "Where we are going",
      paragraphs: [
        "Next comes work on the ground: mapping, soil geochemistry, then trenching and drilling where the results justify it. Each step is designed to answer one question before the next is asked.",
      ] as CopyValue[],
    },
  ],
};

export const aboutPrinciples = {
  eyebrow: "How we work",
  title: "Four rules we hold ourselves to.",
  items: [
    {
      title: "Evidence before expenditure",
      body: "Each phase of work has to earn the next. We spend in stages and let the results decide." as CopyValue,
    },
    {
      title: "Geology sets the plan",
      body: "Structures, contacts and soil data choose where we look, not guesswork or pressure to show activity." as CopyValue,
    },
    {
      title: "Plain reporting",
      body: "We say what is known and what is not. A desktop study is not a discovery, and we will not describe it as one." as CopyValue,
    },
    {
      title: "Respect for the ground",
      body: ph(
        "We work with the communities around Badu and leave every site as we found it or better.",
        "Client to confirm",
      ),
    },
  ],
};

export const aboutPeople = {
  eyebrow: "People",
  title: ph("The team behind Badu.", "Client to confirm"),
  people: [
    {
      role: ph("Managing Director", teamNote),
      name: ph("Name to follow", teamNote),
      bio: ph("A short biography will be added with the portrait.", teamNote),
    },
    {
      role: ph("Exploration Manager", teamNote),
      name: ph("Name to follow", teamNote),
      bio: ph("A short biography will be added with the portrait.", teamNote),
    },
    {
      role: ph("Community Relations Lead", teamNote),
      name: ph("Name to follow", teamNote),
      bio: ph("A short biography will be added with the portrait.", teamNote),
    },
  ],
  partner: {
    caption: "Technical partner",
    name: "GeoXpert Ltd",
    body: "Prepared the Badu geological desktop study (September 2026). Principal geologist: Bernard Asare (mGhIG-395).",
    link: "About the desktop study",
    href: "/concession#desktop-study",
  },
};

export const aboutClose = {
  line: "Want to know more about BlackOre?",
  cta: "Get in touch",
  href: "/contact?topic=general",
};
