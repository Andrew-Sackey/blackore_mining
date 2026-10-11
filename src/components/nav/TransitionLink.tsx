"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { useSmoothScroll } from "@/components/motion/SmoothScroll";
import { track } from "@/lib/analytics";

type LinkProps = ComponentProps<typeof Link> & { "data-cta"?: string };

function hrefText(href: LinkProps["href"]) {
  if (typeof href === "string") return href;
  const pathname = href.pathname ?? "";
  const query = href.query
    ? `?${new URLSearchParams(href.query as Record<string, string>).toString()}`
    : "";
  return `${pathname}${query}${href.hash ?? ""}`;
}

export function TransitionLink({ href, onClick, ref, ...rest }: LinkProps) {
  const { transitionTo, scrollToElement } = useSmoothScroll();
  const pathname = usePathname();
  const cta = typeof rest["data-cta"] === "string" ? rest["data-cta"] : undefined;

  return (
    <Link
      href={href}
      ref={ref}
      {...rest}
      onClick={(event) => {
        if (cta) track("cta_click", { label: cta, page: pathname });
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (rest.target === "_blank") return;

        const raw = hrefText(href);
        if (!raw || raw.startsWith("#") || /^(https?:|mailto:|tel:)/.test(raw)) {
          if (raw.startsWith("#")) {
            const target = document.getElementById(decodeURIComponent(raw.slice(1)));
            if (!target) return;
            event.preventDefault();
            scrollToElement(target);
          }
          return;
        }

        const url = new URL(raw, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) {
          if (url.hash) {
            const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
            if (!target) return;
            event.preventDefault();
            scrollToElement(target);
          }
          return;
        }

        event.preventDefault();
        transitionTo(`${url.pathname}${url.search}${url.hash}`);
      }}
    />
  );
}
