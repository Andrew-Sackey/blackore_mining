import type { MediaId } from "@/content/media";
import { ph, type CopyValue } from "@/content/placeholder";

const durationNote = "Confirm phase durations with client";
const geologistNote = "Geologist to review";
const optionNote = "Client to confirm which options to offer; legal review before publishing";
const commitmentNote = "Client to confirm commitments";

export type LicenceState = "granted" | "pending";
export type MilestoneKind = "done" | "progress" | "planned";

export type LicenceFact = {
  label: string;
  value: CopyValue;
  note: CopyValue;
  /** Only the status fact shows the live or pending dot. */
  dot?: boolean;
};

export type LicenceMilestone = {
  date: CopyValue;
  title: string;
  detail: CopyValue;
  kind: MilestoneKind;
  status: CopyValue;
};

export type ExplorationPhase = {
  number: number;
  title: string;
  objective: CopyValue;
  activities: readonly string[];
  movesOn: CopyValue;
};

export const licenceHero = {
  eyebrow: "Licence & Roadmap",
  title: "From licence to first drill hole.",
  lede: "Where the licence stands, how it got here, and what the desktop study recommends next.",
  mediaId: "band-laterite-road" as MediaId,
};

/** Drives the status dot. The word beside it stays a placeholder until the client confirms. */
export const licenceState: LicenceState = "granted";

export const licenceStatus = {
  eyebrow: "Licence status",
  title: "Where the licence stands.",
  facts: [
    {
      label: "Status",
      value: ph("Granted", "Confirm: granted / under application"),
      note: ph("Large-scale concession issued by the Minerals Commission of Ghana"),
      dot: true,
    },
    {
      label: "Term",
      value: ph("3 years", "Confirm licence term and renewal terms"),
      note: ph("From grant date, renewable", "Confirm licence term and renewal terms"),
    },
    {
      label: "Next milestone",
      value: "Reconnaissance mapping",
      note: ph("Planned start Q1 2027", "Confirm with client"),
    },
  ] satisfies readonly LicenceFact[],
};

export const licenceTimeline = {
  eyebrow: "Licensing timeline",
  title: "Milestones on the record.",
  lede: "Each step from application to field work, with dates from the official documents where we have them.",
  milestones: [
    {
      date: ph("2025", "Confirm application year"),
      title: "Application lodged",
      detail: ph(
        "Application for a large-scale concession submitted to the Minerals Commission",
        "Confirm application date",
      ),
      kind: "done",
      status: ph("Done", "Confirm this step is complete"),
    },
    {
      date: ph("2025", "Confirm cadastral allocation year"),
      title: "Cadastral allocation",
      detail: ph(
        "196 blocks allocated on the mining cadastre around Badu",
        "Confirm allocation date and wording",
      ),
      kind: "done",
      status: ph("Done", "Confirm this step is complete"),
    },
    {
      date: "18 May 2026",
      title: "Concession surveyed",
      detail: "Boundary of 70 pillars surveyed and certified by a licensed surveyor (plan FS 0703B4)",
      kind: "done",
      status: "Done",
    },
    {
      date: "8 Sep 2026",
      title: "Geological desktop study",
      detail: "GeoXpert Ltd assesses the concession's geology and recommends a phased programme",
      kind: "done",
      status: "Done",
    },
    {
      date: ph("2026", "Confirm grant year"),
      title: "Licence granted",
      detail: ph("Licence issued, term begins", "Confirm grant date"),
      kind: "planned",
      status: ph("Planned", "Confirm whether the licence has been granted"),
    },
    {
      date: ph("2026", "Confirm permit year"),
      title: "Environmental permit",
      detail: ph("EPA permit for exploration activities", "Confirm requirement and status"),
      kind: "planned",
      status: ph("Planned", "Confirm requirement and status"),
    },
    {
      date: ph("Q1 2027", "Confirm field-work start"),
      title: "Field work begins",
      detail: "Reconnaissance mapping and sampling start on the ground",
      kind: "planned",
      status: "Planned",
    },
  ] satisfies readonly LicenceMilestone[],
};

export const licenceProgramme = {
  eyebrow: "Exploration programme",
  title: "How the ground gets tested.",
  lede: "The desktop study recommends a phased, evidence-based programme. Each stage costs more than the last, so each one has to justify the next.",
  illustrative: "Illustrative only. Not actual targets or results.",
  movesLabel: "Moves on when",
  phases: [
    {
      number: 1,
      title: "Reconnaissance",
      objective: ph(
        "Put geologists on the ground to check what the desktop study predicts.",
        geologistNote,
      ),
      activities: [
        "Geological and structural mapping",
        "Ground truthing",
        "Investigation of artisanal workings",
        "Grab sampling",
      ],
      movesOn: ph("Mapping confirms the key structures and contacts in the field.", geologistNote),
    },
    {
      number: 2,
      title: "Geochemistry",
      objective: ph("Find where gold shows up in the soil.", geologistNote),
      activities: ["Systematic soil grid sampling", "Infill sampling over anomalies", "Rock-chip sampling"],
      movesOn: ph("Soil results outline coherent gold anomalies.", geologistNote),
    },
    {
      number: 3,
      title: "Target definition",
      objective: ph("Turn anomalies into drill targets.", geologistNote),
      activities: ["Trenching and auger drilling", "Ground geophysics where justified"],
      movesOn: ph("Trenches or auger holes intersect mineralised zones worth drilling.", geologistNote),
    },
    {
      number: 4,
      title: "Discovery drilling",
      objective: ph("Test the targets at depth.", geologistNote),
      activities: [
        "RC drilling",
        "Diamond drilling",
        "Follow-up drilling to test continuity, with the aim of supporting a future resource estimate",
      ],
      movesOn: ph("Drilling results justify resource definition work.", geologistNote),
    },
  ] satisfies readonly ExplorationPhase[],
};

export const licenceSchedule = {
  eyebrow: "Schedule and budget",
  title: "Eighteen months, four stages.",
  body: "The desktop study puts the full programme at about 12 to 18 months without interruption, at an indicative cost of US$750,000 to US$1,000,000.",
  span: 18,
  phases: [
    { title: "1 Reconnaissance", start: ph("0", durationNote), end: ph("3", durationNote) },
    { title: "2 Geochemistry", start: ph("2", durationNote), end: ph("7", durationNote) },
    { title: "3 Target definition", start: ph("6", durationNote), end: ph("11", durationNote) },
    { title: "4 Discovery drilling", start: ph("10", durationNote), end: ph("18", durationNote) },
  ],
  /** CountUp animates the 0.75; the full range is the placeholder the client confirms. */
  budgetValue: 0.75,
  budget: ph("US$0.75–1.0M", "Client to confirm before launch"),
  budgetCaption: "Indicative total, all four phases",
};

export const licenceOptions = {
  eyebrow: "Opportunities",
  title: "Ways to be part of it.",
  lede: ph(
    "BlackOre is open to discussions with partners who share a long-term view of the Badu concession.",
    "Client to confirm wording",
  ),
  href: "/contact?topic=partnership",
  link: "Discuss this",
  cards: [
    {
      title: ph("Equity investment", optionNote),
      body: ph("Take a stake in BlackOre as the programme moves from desk to field.", optionNote),
      icon: "stake",
    },
    {
      title: ph("Joint venture or earn-in", optionNote),
      body: ph("Fund defined exploration phases in return for an interest in the project.", optionNote),
      icon: "venture",
    },
    {
      title: ph("Phase funding", optionNote),
      body: ph("Back a single stage of the programme with clear deliverables.", optionNote),
      icon: "phase",
    },
    {
      title: ph("Technical partnership", optionNote),
      body: ph("Bring exploration, geophysics or drilling expertise to the project.", optionNote),
      icon: "technical",
    },
  ],
} as const;

export const licenceCare = {
  eyebrow: "Responsible exploration",
  title: ph("Exploring with the community.", "Client to confirm"),
  mediaId: "still-field-map" as MediaId,
  commitments: [
    {
      title: ph("Community first.", commitmentNote),
      body: ph("Engage Badu and surrounding communities before field work begins.", commitmentNote),
    },
    {
      title: ph("Permits in place.", commitmentNote),
      body: ph("Hold the required environmental permits before any ground disturbance.", commitmentNote),
    },
    {
      title: ph("Light footprint.", commitmentNote),
      body: ph("Rehabilitate trenches and drill pads, and protect streams and forest areas.", commitmentNote),
    },
    {
      title: ph("Local hiring.", commitmentNote),
      body: ph("Employ and train local field assistants wherever possible.", commitmentNote),
    },
  ],
};

export const licenceClose = {
  line: "Questions about the licence or the programme?",
  link: "Contact us",
  href: "/contact?topic=licence",
};
