import type { MediaId } from "@/content/media";
import { ph, type CopyValue } from "@/content/placeholder";

export const contactPage = {
  eyebrow: "Contact",
  title: ph("Talk to us about the licence.", "Contact page title"),
  lede: ph(
    "Enquiries about the exploration licence can come here. The destination for the form is still to be confirmed.",
    "Contact lede",
  ),
  mediaId: "band-contact-hero" as MediaId,
};

export const topics = [
  {
    key: "licence",
    label: "Licence information",
    helper: "Ask about the licence, its status, terms or boundary.",
    placeholder: "What would you like to know about the Badu licence?",
  },
  {
    key: "desktop-study",
    label: "Desktop study",
    helper: "We share the full report with interested parties on request.",
    placeholder: "Tell us a little about your interest in the report.",
  },
  {
    key: "partnership",
    label: "Partnership",
    helper: "Equity, joint venture, phase funding or technical partnership.",
    placeholder: "Tell us about your organisation and the kind of partnership you have in mind.",
  },
  {
    key: "general",
    label: "General",
    helper: "Anything else about BlackOre or the Badu project.",
    placeholder: "How can we help?",
  },
] as const;

export type TopicKey = (typeof topics)[number]["key"];

export const investorTypes = ["Individual", "Fund or institution", "Mining company", "Other"] as const;

export const contactForm = {
  eyebrow: "Enquiry",
  title: "Tell us what you need.",
  organisation: "Organisation",
  investor: "Investor type",
  consent: "I agree that BlackOre may contact me about this enquiry. See our",
  privacy: "privacy notice",
  submit: "Send enquiry",
  sending: "Sending…",
  note: ph("We reply from a named person, not an automated system.", "Confirm with client"),
  thanks: "Thank you,",
  again: "Send another enquiry",
  back: "Back to the concession",
  backHref: "/concession",
  reply: ph("We usually reply within two working days.", "Confirm response time"),
  sendError: "Your message didn't send. Check your connection and try again, or email us at",
  setup: "Email us directly while our form is being set up.",
};

export const contactSide = {
  direct: "Direct contact",
  hours: ph("Monday to Friday, 8:00–17:00 GMT"),
  next: "What happens next",
  steps: [
    "We read every enquiry ourselves.",
    ph("We reply within two working days."),
    ph(
      "For the full desktop study, we may ask you to sign a short confidentiality agreement.",
      "Confirm with client",
    ),
  ] as const satisfies readonly CopyValue[],
  place: "The concession",
  where: "Badu, Wenchi Municipal District, Bono Region, Ghana",
  see: "See the concession",
  seeHref: "/concession",
};

const legal = "Legal to review; Ghana Data Protection Act, 2012 (Act 843)";

export const privacyPage = {
  eyebrow: "Privacy",
  title: "Privacy notice",
  sections: [
    {
      heading: "Who we are",
      body: ph(
        "BlackOre Mining Ltd is an exploration-stage company. This notice will name the company, its address, and the person responsible for personal data.",
        legal,
      ),
    },
    {
      heading: "What we collect",
      body: ph(
        "The enquiry form collects your name, email address, organisation, investor type, country, phone number and message.",
        legal,
      ),
    },
    {
      heading: "Why we collect it",
      body: ph("We use these details to read your enquiry and reply to you.", legal),
    },
    {
      heading: "Where it is processed",
      body: ph(
        "Form submissions are processed by Formspree, which acts as our form processor, and are then read by BlackOre. If site analytics are switched on, Vercel Web Analytics and Speed Insights record page views without cookies.",
        legal,
      ),
    },
    {
      heading: "How long we keep it",
      body: ph(
        "We keep enquiry records for as long as we need them to respond and to keep a record of the conversation.",
        legal,
      ),
    },
    {
      heading: "Your rights",
      body: ph(
        "You can ask to see, correct or delete the personal information you sent through the form.",
        legal,
      ),
    },
    {
      heading: "How to contact us",
      body: ph("Write to the email address published on this site if you have a question about your personal data.", legal),
    },
  ],
};
