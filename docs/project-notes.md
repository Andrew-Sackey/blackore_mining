# BlackOre Mining website: project notes

A running list of client decisions and ideas to carry through the build. Keep this file in the repo at `docs/project-notes.md` so Cursor can read it too.

## Client and audience
- BlackOre Mining Ltd. Early-stage gold exploration, Badu concession, Wenchi Municipality, Bono Region, Ghana.
- 41.09 km², 196 blocks, 70 surveyed boundary pillars. Survey plan FS 0703B4 certified 18 May 2026.
- Geological desktop study by Bernard Asare (GeoXpert Ltd), 8 Sep 2026.
- Audience: investors. The site must look established and credible.

## Decided
- Stack: Next.js (App Router) + Tailwind + GSAP. Cursor builds; prompts come from the design lead.
- Look: Apple product page, but for mining. Dark, off-white text, copper accent taken from the logo.
- Mobile-first for every component.
- Multi-page site. Nav order: **About · The Concession · Licence & Roadmap · Contact**.
- Opening sequence = page loader + first scene of the hero. The whole O in BLACKORE is a spinning globe that lands on Badu. The finished logo holds briefly, then docks in the nav.
- Hero video loads behind the intro; poster fallback if it is late.

## House rules (from the design lead)
- **No repeated one-liners.** Every headline and tagline is used once on the whole site. Track them in `src/content/taglines.ts`.
- **Content comes from the desktop study first.** Each section draws on a different part of the PDF so the copy never runs dry or repeats.
- **Placeholders everywhere for now**, wrapped in `ph()` so they are easy to find (`Shift + P` in dev) and replace.
- **Clean and smooth above all.** Few effects, done perfectly. Every animation uses the shared motion tokens.

## Client requests to work in
- **"Bono Region, a hidden gem."** in bold. Lives in the home Statement section (large, word-by-word reveal). The intro tagline is now "Exploring Ghana's Birimian frontier." so the line is not used twice.
- **Landscape videos and images throughout the site** to represent mining. There is no separate Landscape page; every page should carry landscape media (section backgrounds, full-bleed breaks between sections).
- **Use the maps from the desktop study** (concession plan, Ghana geology map, local geology map). Idea: each map draws itself in black and white line work, then the relevant part fills with colour depending on what the section is talking about (for example, the volcanic units colour in when the text covers lithology).
- Licensing timeline, future plans and options, and a "contact us for information about our licence" page.
- Something that represents the desktop report (highlights plus a request/download).

## Map data (in `src/content/geo/`)
- `concession-boundary.ts`: all 70 pillars (lat/lon, DMS, UTM 30N) from the survey plan / desktop study Appendix A. Polygon area computes to 41.08 km², matching the licence's 41.09 km².
- `ghana-map.ts`: Ghana outline and neighbours from Natural Earth (public domain), approximate town positions, schematic Accra → Badu route.
- `geology-map.ts`: Figure 3 of the report vectorised into 8 rock units, drainage and structures, georeferenced to UTM 30N by fitting the surveyed boundary (misfit about 4 m). Unit shares inside the concession: volcanics ≈59%, granitoid ≈23%, metasediments ≈19%.
- Figure 2 (Ghana geology) is credited to a ScienceDirect publication: do not reproduce it on the site.

## Report issues to raise with GeoXpert
- The executive summary says the area is "predominantly underlain by Birimian metasedimentary rocks", but the report's own map puts about 59% of the concession on volcanics. The site follows the map.
- Elevations of 30–61 m in section 3 look wrong (Wenchi is about 270–300 m).

## Waiting on client approval (features built but switched off)
- Publishing the pillar coordinates as a CSV download (`SHOW_PILLAR_DOWNLOAD`).
- Showing the survey plan image, which carries the surveyor's seal and signature (`SHOW_SURVEY_PLAN`).
- Licence type, number and current status for the data sheet.

## Contact and forms
- Enquiries go through Formspree (`NEXT_PUBLIC_FORMSPREE_FORM_ID`). Move the form to the client's own Formspree account before launch and set their notification email.
- Formspree's free plan has a monthly submission cap; check current limits and upgrade if needed.
- Confirm: contact email, phone, office, hours, reply time, and whether the full report needs a confidentiality agreement.
- `/privacy` is all placeholder text and needs a legal review (Ghana Data Protection Act, 2012, Act 843).

## About page: placeholders to fill
- Company description, founding year, headquarters, origin story.
- Team names, roles, bios, photos (or switch the grid off with `SHOW_TEAM`).
- Confirm the claim that the Badu ground "has seen little modern exploration" before publishing it.
- Permission from GeoXpert to be named as technical partner, and to use its logo.

## Licence & Roadmap page: placeholders to fill
- Application date, cadastral allocation date, grant date, licence term, EPA permit status, field work start.
- Phase durations (currently 0–3, 2–7, 6–11, 10–18 months) and whether to show the US$0.75–1.0M budget.
- Which partnership options to offer (equity, JV/earn-in, phase funding, technical partnership); needs legal review.
- Responsible exploration commitments.
- **Check:** the survey plan shows forest areas near the western part of the concession. Confirm whether any forest reserve lies inside or next to the boundary.
- Phase objectives and "moves on when" lines are draft copy for the client's geologist to review.

## Ideas parked for later
- Globe dive (Earth → West Africa → Ghana → the 70-pillar boundary drawing itself in copper) on The Concession page.
- Exploded geology block (layers separate: cover, metasediments, volcanics, granitoid, shear zone).
- Horizontal licence and roadmap timeline: completed milestones in copper, future phases outlined.

## Content guardrails
- Say "prospective" and "exploration stage". Never imply a discovery, resource or production. The report itself says no mineralisation has been established yet.
- Compare to Obuasi, Prestea and others for geological setting only, never for size or grade.
- Do not quote the report's elevation figures (30–61 m); they look wrong (Wenchi is about 270–300 m).
- Do not cite "Grokipedea" publicly.

## Still needed from the client
- Licensing dates: application, Minerals Commission milestones, grant date, licence term, current status.
- Landscape and drone footage, photos.
- Original logo vector file from the designer (current files are traced from a JPG and work fine for now).
- Contact details and where enquiry form submissions should go.

## Launch checklist (owner: client unless noted)
- Domain name and DNS access.
- Real contact email, phone and office; Formspree moved to the client's account.
- Licence facts and dates; partnership options (legal review); privacy notice (legal review).
- Approval to publish the survey plan and pillar coordinates.
- GeoXpert's permission to be named (and logo, if used).
- Landscape and drone footage per the shot list; team photos if the team section stays on.
- Original logo vector from the designer (traced version works until then).
- Analytics on or off (`NEXT_PUBLIC_ANALYTICS`).
- Developer: Vercel project on `main`, preview protection, and the canonical domain. See `docs/HANDOVER.md`.
