export function reducedMotion(): boolean {
  if (typeof document === "undefined") return false;
  return (
    document.documentElement.classList.contains("is-reduced") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function desktopSmoothScroll(): boolean {
  if (reducedMotion()) return false;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return fine && !coarse;
}
