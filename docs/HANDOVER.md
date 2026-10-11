# BlackOre Mining website: hand-over

This note is for the client team and for the next person who edits the site. The site is a Next.js project. Most day-to-day changes are text and pictures, not layout.

## 1. Replacing a placeholder

Copy that is still waiting on the client is written with `ph()` in `src/content/`. Each page has its own file:

| Page | File |
|---|---|
| Home | `src/content/home.ts` |
| About | `src/content/about.ts` |
| The Concession | `src/content/concession.ts` |
| Licence & Roadmap | `src/content/licence.ts` |
| Contact and privacy | `src/content/contact.ts` |
| Shared details (email, phone, footer) | `src/content/site.ts` |

`ph("the sentence", "who needs to confirm it")` marks a sentence as temporary. On the site it reads as normal text. In development, press **Shift + P** and every placeholder picks up an outline so you can see what is still draft.

A developer replaces a placeholder by changing that `ph(...)` call into a plain string once the wording is approved. Leave the surrounding layout alone.

The full list, grouped by page, is at `/dev/placeholders` while the site is running locally. **Copy as Markdown** puts that list on the clipboard so it can be sent as one document to fill in. That address does not exist on the public site.

## 2. Adding footage

1. Open the shot list at `/dev/shot-list` (local only) and match the clip to an id such as `hero-loop`.
2. From the project folder, run:

```bash
scripts/encode-video.sh path/to/source.mov hero-loop
```

This needs ffmpeg. It writes five files into `public/media/`: a phone clip, a desktop clip, each as WebM and MP4, and a poster frame. The script prints the file sizes. If a phone file is over 3 MB, or a desktop file is over 8 MB, shorten the clip to about 8–12 seconds or ask the developer to raise the compression.

3. Files over 4 MB should be uploaded to Vercel Blob (the default host) rather than committed into the repository. Mux or Cloudinary work the same way if the host is already chosen.
4. In `src/content/media.ts`, fill in `src` and `poster` for that id. A local file looks like `/media/hero-loop-desktop.mp4`. A hosted file is the full `https://…` address. Set `NEXT_PUBLIC_MEDIA_HOST` to that host’s origin so the site is allowed to load it. Nothing else in the page code needs to change.

## 3. Feature flags

These live in `src/content/site.ts`. They are switches, not environment variables.

| Flag | What it shows | Current setting |
|---|---|---|
| `SHOW_PILLAR_DOWNLOAD` | A CSV of the 70 boundary pillar coordinates | Off, until the client approves publishing them |
| `SHOW_SURVEY_PLAN` | The survey plan image, which carries the surveyor’s seal and signature | Off, until the client approves |
| `SHOW_TEAM` | The team grid on About | On. Set it to false to hide the grid while names and photos are missing |

## 4. Where enquiries go

The contact form posts to Formspree. The form id is the environment variable `NEXT_PUBLIC_FORMSPREE_FORM_ID`.

Before launch, create the form on the client’s own Formspree account and put that id in the Vercel project settings. In the Formspree dashboard, set the notification email to the inbox that should receive enquiries. The address visitors see on the site is separate: it is `contact.email` in `src/content/site.ts`.

Formspree’s free plan caps submissions per month. The current public limit is on Formspree’s pricing page and can change; check it when the form is moved, and upgrade if the inbox is likely to pass that cap. A full inbox fails quietly from the visitor’s point of view, so watch the monthly count.

While the id is empty, a local preview pretends the form succeeded (so the page can be reviewed) and a production build hides the form and shows the email address instead.

## 5. Deploying and rolling back

The site is meant to run on Vercel.

- Production branch: `main`.
- Pull requests get their own preview URL.
- Keep previews private until launch: in the Vercel project, turn on **Deployment Protection** (password or Vercel Authentication) for Preview.
- Environment variables to set on Vercel: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_FORMSPREE_FORM_ID`, `NEXT_PUBLIC_ANALYTICS` (`on` or `off`), and `NEXT_PUBLIC_MEDIA_HOST` once footage is hosted. A copy of the names is in `.env.example`.
- Point the domain at Vercel over HTTPS. Pick one canonical host. If the live site is `https://blackoremining.com`, redirect `www` to that apex (or the reverse) and set `NEXT_PUBLIC_SITE_URL` to the same host. Do not leave both serving the site.
- Previews and any deployment that is not production send `noindex` and a robots file that disallows the whole site. `/dev/*` is also removed from production builds.

To roll back: open the Vercel project, choose **Deployments**, find the last good production deployment, and use **Promote to Production**. That restores the previous build without a new code change.

Analytics, when `NEXT_PUBLIC_ANALYTICS=on`, is Vercel Web Analytics and Speed Insights. Both are cookieless. The privacy notice says so. Leave the variable off until the client wants the numbers.

## 6. Open items

Owners are the client unless a row says otherwise. The running list is `docs/project-notes.md`.

| Item | Owner |
|---|---|
| Domain name and DNS access | Client |
| Real contact email, phone and office; Formspree moved to the client’s account | Client |
| Licence facts and dates; partnership options (legal review); privacy notice (legal review, Ghana Data Protection Act, 2012, Act 843) | Client, with counsel |
| Approval to publish the survey plan and pillar coordinates | Client |
| GeoXpert’s permission to be named, and to use its logo if a logo is added | Client |
| Landscape and drone footage per the shot list; team photos if the team section stays on | Client |
| Original logo vector from the designer (the traced files work until then) | Client |
| Analytics on or off | Client |
| Confirm the Badu ground “has seen little modern exploration” before publishing that sentence | Client |
| Confirm whether a forest reserve lies inside or next to the western boundary | Client |
| Phase durations, the budget line, and the “moves on when” wording, reviewed by the client’s geologist | Client |
| Report issues for GeoXpert: the executive summary says metasediments, the map shows mostly volcanics (the site follows the map); elevations of 30–61 m look too low for Wenchi | Client to raise with GeoXpert |
| Deploy the Vercel project, protect previews, and attach the domain | Developer, once the client has the Vercel team and DNS |
