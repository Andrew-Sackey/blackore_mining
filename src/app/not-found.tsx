import { ContourField } from "@/components/intro/ContourField";
import { Logo } from "@/components/brand/Logo";
import { TaglineWatch } from "@/components/content/TaglineWatch";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Display } from "@/components/type/Display";
import { notFoundTagline } from "@/content/taglines";

export default function NotFound() {
  return (
    <main className="not-found">
      <ContourField className="not-found-contours" />
      <Logo variant="mark" className="footer-mark" />
      <Display>{notFoundTagline}</Display>
      <TaglineWatch text={notFoundTagline} />
      <TransitionLink href="/" className="text-link">
        Back home <span aria-hidden="true">→</span>
      </TransitionLink>
    </main>
  );
}
