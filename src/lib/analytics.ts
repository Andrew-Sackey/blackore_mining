import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

/** Cookieless Vercel events. No-ops unless NEXT_PUBLIC_ANALYTICS=on. */
export function track(name: string, props?: Props) {
  if (process.env.NEXT_PUBLIC_ANALYTICS !== "on") return;
  vercelTrack(name, props);
}
