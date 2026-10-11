/** Every headline and tagline on the site, each used on one route. */
export const introTagline = "Exploring Ghana's Birimian frontier.";
export const statementTagline = "Bono Region, a hidden gem.";
export const heroTagline = "Birimian ground, ready to be tested.";
export const notFoundTagline = "Off the map.";

export const taglines = [
  { text: introTagline, route: "/" },
  { text: statementTagline, route: "/" },
  { text: heroTagline, route: "/" },
  { text: "A day's drive from Accra.", route: "/" },
  { text: "Three things the rocks tell us.", route: "/" },
  { text: "A layered Birimian sequence", route: "/" },
  { text: "Crossing fault systems", route: "/" },
  { text: "Granitoid contacts", route: "/" },
  { text: "Every phase earns the next.", route: "/" },
  { text: "Get the full Badu briefing.", route: "/" },
  { text: "Patient exploration, grounded in geology.", route: "/about" },
  { text: "We explore one concession, carefully, and say plainly what we know.", route: "/about" },
  { text: "Read from the top down.", route: "/about" },
  { text: "Four rules we hold ourselves to.", route: "/about" },
  { text: "The team behind Badu.", route: "/about" },
  { text: "Forty-one square kilometres of Birimian terrain.", route: "/concession" },
  { text: "From Ghana's gold belts down to Badu.", route: "/concession" },
  { text: "Read the ground, layer by layer.", route: "/concession" },
  { text: "A setting Ghana's geologists know well.", route: "/concession" },
  { text: "The groundwork, documented.", route: "/concession" },
  { text: "A Birimian volcano–sedimentary sequence", route: "/concession" },
  { text: "Volcanic rock under most of the ground", route: "/concession" },
  { text: "Sheared metasediments in the west", route: "/concession" },
  { text: "A granitoid body in the south", route: "/concession" },
  { text: "Faults across the boundary", route: "/concession" },
  { text: "Streams that follow the faults", route: "/concession" },
  { text: "Where it comes together", route: "/concession" },
  { text: "From licence to first drill hole.", route: "/licence" },
  { text: "Where the licence stands.", route: "/licence" },
  { text: "The ground the licence covers.", route: "/licence" },
  { text: "Milestones on the record.", route: "/licence" },
  { text: "How the ground gets tested.", route: "/licence" },
  { text: "Eighteen months, four stages.", route: "/licence" },
  { text: "Ways to be part of it.", route: "/licence" },
  { text: "Exploring with the community.", route: "/licence" },
  { text: "Talk to us about the licence.", route: "/contact" },
  { text: "Tell us what you need.", route: "/contact" },
  { text: "Thank you, {first name}.", route: "/contact" },
  { text: "Privacy notice", route: "/privacy" },
  { text: notFoundTagline, route: "/404" },
  { text: "Something went wrong.", route: "/error" },
] as const;

/** Rendered with a visitor's name, so the live duplicate check does not apply. */
const taglineTemplates = new Set<string>(["Thank you, {first name}."]);

if (process.env.NODE_ENV === "development") {
  const seen = new Set<string>();
  for (const line of taglines) {
    if (taglineTemplates.has(line.text)) continue;
    if (seen.has(line.text)) {
      console.warn(`[taglines] "${line.text}" is listed more than once.`);
    }
    seen.add(line.text);
  }
}
