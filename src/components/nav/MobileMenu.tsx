"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";
import { TransitionLink } from "@/components/nav/TransitionLink";

const LINKS = nav;

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0;
}

export function MobileMenu({
  open,
  onClose,
  menuButtonRef,
}: {
  open: boolean;
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const sheetRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const header = document.getElementById("site-nav");
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");

    const button = menuButtonRef.current;
    const focusable = [
      ...(header?.querySelectorAll<HTMLElement>("a, button") ?? []),
      ...(sheet?.querySelectorAll<HTMLElement>("a, button") ?? []),
    ].filter(isVisible);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheet?.querySelector("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      main?.removeAttribute("inert");
      if (button) button.focus();
    };
  }, [open, onClose, menuButtonRef]);

  return (
    <nav
      ref={sheetRef}
      id="mobile-sheet"
      className="sheet"
      aria-label="Mobile"
      aria-hidden={!open}
      inert={open ? undefined : true}
    >
      {LINKS.map((link) => (
        <TransitionLink key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </TransitionLink>
      ))}
    </nav>
  );
}

export { LINKS };
