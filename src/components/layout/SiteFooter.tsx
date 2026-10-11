"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { copyText } from "@/content/placeholder";
import { contact, footer, footerBandFor, nav } from "@/content/site";
import { Copy } from "@/components/content/Copy";
import { ContourField } from "@/components/intro/ContourField";
import { Container } from "@/components/layout/Container";
import { MediaBand } from "@/components/media/MediaBand";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionLink } from "@/components/nav/TransitionLink";

export function SiteFooter() {
  const pathname = usePathname();
  const { scrollToTop } = useSmoothScroll();
  const band = footerBandFor(pathname);
  const email = copyText(contact.email);
  const phone = copyText(contact.phone);

  return (
    <>
      {band ? <MediaBand id={band} height="short" /> : null}
      <footer className="site-footer">
        <ContourField className="footer-contours" />
        <Container>
          <div className="footer-top">
            <Logo variant="horizontal" className="footer-logo" decorative />
            <div className="footer-cols">
              <div>
                <p className="footer-kicker">Explore</p>
                <ul>
                  {nav.map((link) => (
                    <li key={link.href}>
                      <TransitionLink href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                        {link.label}
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="footer-kicker">Concession</p>
                <ul>
                  {footer.concession.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="footer-coords">{footer.coordinates}</p>
              </div>
              <div>
                <p className="footer-kicker">Contact</p>
                <ul>
                  <li>
                    <a href={`mailto:${email}`}>
                      <Copy value={contact.email} />
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${phone.replace(/\s/g, "")}`}>
                      <Copy value={contact.phone} />
                    </a>
                  </li>
                  <li>
                    <Copy value={contact.office} />
                  </li>
                </ul>
              </div>
              <div>
                <p className="footer-kicker">Request</p>
                <TransitionLink href={footer.requestHref} className="btn footer-cta" data-cta={footer.requestLabel}>
                  {footer.requestLabel}
                </TransitionLink>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">{footer.copyright}</p>
            <TransitionLink href="/privacy" className="footer-privacy">
              Privacy notice
            </TransitionLink>
            <button type="button" className="back-top" onClick={scrollToTop}>
              Back to top
            </button>
            <p className="footer-disclaimer">{footer.disclaimer}</p>
          </div>
        </Container>
      </footer>
    </>
  );
}
