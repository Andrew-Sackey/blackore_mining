"use client";

import { useEffect } from "react";

const live = new Map<string, number>();

/** Dev-only. Warns when the same headline is mounted twice at once. */
export function useTagline(text: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const next = (live.get(text) ?? 0) + 1;
    live.set(text, next);
    if (next > 1) {
      console.warn(
        `[taglines] "${text}" is rendered more than once (${next}). Each headline is used once.`,
      );
    }
    return () => {
      const left = (live.get(text) ?? 1) - 1;
      if (left <= 0) live.delete(text);
      else live.set(text, left);
    };
  }, [text]);
}

export function TaglineWatch({ text }: { text: string }) {
  useTagline(text);
  return null;
}
