"use client";

import Link from "next/link";
import { ContourField } from "@/components/intro/ContourField";
import { Logo } from "@/components/brand/Logo";
import { TaglineWatch } from "@/components/content/TaglineWatch";
import { Display } from "@/components/type/Display";
import { copyText } from "@/content/placeholder";
import { contact } from "@/content/site";

export function ErrorScreen({ reset }: { reset: () => void }) {
  const email = copyText(contact.email);
  return (
    <main className="not-found">
      <ContourField className="not-found-contours" />
      <Logo variant="mark" className="footer-mark" />
      <Display>Something went wrong.</Display>
      <TaglineWatch text="Something went wrong." />
      <p className="error-body">
        Try loading the page again. If it keeps happening, email us at {email}.
      </p>
      <div className="ctas">
        <button type="button" className="btn" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="text-link">
          Home <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
