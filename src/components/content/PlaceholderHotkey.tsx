"use client";

import { useEffect } from "react";

export function PlaceholderHotkey() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "KeyP" || !event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, [contenteditable='true']")) return;
      event.preventDefault();
      document.documentElement.toggleAttribute("data-placeholders");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
