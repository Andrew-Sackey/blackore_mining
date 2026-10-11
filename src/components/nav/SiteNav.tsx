"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { useIntro } from "@/components/intro/IntroContext";
import { LINKS, MobileMenu } from "@/components/nav/MobileMenu";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";

export function SiteNav() {
  const pathname = usePathname();
  const { navLogoRef } = useIntro();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const { setPaused } = useSmoothScroll();

  useEffect(() => {
    setPaused("menu", open);
    return () => setPaused("menu", false);
  }, [open, setPaused]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      header.classList.toggle("is-glass", y > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  return (
    <>
      <header id="site-nav" ref={headerRef} className="nav" data-open={open ? "" : undefined}>
        <div className="nav-row">
          <TransitionLink href="/" className="nav-logo" aria-label="BlackOre Mining home" ref={navLogoRef}>
            <Logo variant="horizontal" decorative />
          </TransitionLink>
          <nav aria-label="Main">
          <ul className="nav-links">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href} data-reveal>
                  <TransitionLink
                    href={link.href}
                    className={link.href === "/contact" ? "pill" : undefined}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
          </nav>
          <button
            ref={menuRef}
            type="button"
            className="nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-sheet"
            data-reveal
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={close} menuButtonRef={menuRef} />
    </>
  );
}
