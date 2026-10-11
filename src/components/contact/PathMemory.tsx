"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** Remembers the last path so the contact form can name the page a visitor came from. */
export function PathMemory() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    try {
      sessionStorage.setItem("bo-path-current", pathname);
    } catch {
      /* Private browsing can block storage. The form then records the visit as direct. */
    }
  }, [pathname]);

  return null;
}
