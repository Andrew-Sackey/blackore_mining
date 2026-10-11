"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { ease, navOffset, route } from "@/lib/motion";
import { desktopSmoothScroll, reducedMotion } from "@/lib/motion-flags";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type SmoothApi = {
  setPaused: (reason: string, paused: boolean) => void;
  scrollToElement: (element: HTMLElement) => void;
  scrollToTop: () => void;
  transitionTo: (href: string) => void;
};

const SmoothContext = createContext<SmoothApi | null>(null);

let armEnter = false;
let navigating = false;
let popId = 0;
let lastAppliedPop = 0;
let poppedY = 0;
const scrollMemory = new Map<string, number>();

function pageKey() {
  return `${window.location.pathname}${window.location.search}`;
}

export function useSmoothScroll() {
  const api = useContext(SmoothContext);
  if (!api) throw new Error("useSmoothScroll must be used within SmoothScroll");
  return api;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const lenisRef = useRef<Lenis | null>(null);
  const reasons = useRef(new Set<string>());

  const applyPause = useCallback(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (reasons.current.size > 0) lenis.stop();
    else lenis.start();
  }, []);

  const setPaused = useCallback(
    (reason: string, paused: boolean) => {
      if (paused) reasons.current.add(reason);
      else reasons.current.delete(reason);
      applyPause();
    },
    [applyPause],
  );

  const scrollToElement = useCallback((element: HTMLElement) => {
    const lenis = lenisRef.current;
    if (lenis && reasons.current.size === 0) {
      lenis.scrollTo(element, { offset: -navOffset });
      return;
    }
    const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: reducedMotion() ? "auto" : "smooth" });
  }, []);

  const scrollToTop = useCallback(() => {
    const lenis = lenisRef.current;
    if (lenis && reasons.current.size === 0) {
      lenis.scrollTo(0, { force: true });
      return;
    }
    window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }, []);

  const transitionTo = useCallback(
    (href: string) => {
      if (navigating) return;
      navigating = true;
      const page = document.getElementById("page-root");
      const line = document.querySelector<HTMLElement>(".route-line");
      const go = () => {
        scrollMemory.set(pageKey(), window.scrollY);
        armEnter = true;
        router.push(href);
      };
      if (reducedMotion() || !page) {
        if (page) gsap.set(page, { opacity: 0 });
        go();
        return;
      }
      const timeline = gsap.timeline({
        onComplete() {
          if (line) gsap.set(line, { scaleX: 0 });
          go();
        },
      });
      if (line) {
        timeline.set(line, { scaleX: 0, transformOrigin: "left center" });
        timeline.to(line, { scaleX: 1, duration: route.line, ease: ease.inOut }, 0);
      }
      timeline.to(page, { opacity: 0, duration: route.leave, ease: ease.inOut }, 0);
    },
    [router],
  );

  const api = useMemo(
    () => ({ setPaused, scrollToElement, scrollToTop, transitionTo }),
    [setPaused, scrollToElement, scrollToTop, transitionTo],
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    if (reducedMotion()) root.classList.add("is-reduced");

    let lenis: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    const boot = () => {
      lenis?.destroy();
      lenis = null;
      lenisRef.current = null;
      if (ticker) {
        gsap.ticker.remove(ticker);
        ticker = null;
      }
      if (!desktopSmoothScroll()) return;
      gsap.ticker.lagSmoothing(0);
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        syncTouch: false,
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      lenisRef.current = lenis;
      ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      applyPause();
    };

    const syncIntro = () => {
      const mode = root.dataset.intro;
      setPaused("intro", mode === "full" || mode === "short");
    };

    boot();
    syncIntro();

    const introObserver = new MutationObserver(syncIntro);
    introObserver.observe(root, { attributes: true, attributeFilter: ["data-intro"] });

    const desktopMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const coarseMq = window.matchMedia("(pointer: coarse)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMode = () => {
      root.classList.toggle("is-reduced", reduceMq.matches);
      boot();
      syncIntro();
    };
    desktopMq.addEventListener("change", onMode);
    coarseMq.addEventListener("change", onMode);
    reduceMq.addEventListener("change", onMode);

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const id = decodeURIComponent(href.slice(1));
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      scrollToElement(target);
    };
    document.addEventListener("click", onClick);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => undefined);
    window.addEventListener("load", refresh);

    const onPop = () => {
      popId += 1;
      poppedY = scrollMemory.get(pageKey()) ?? window.scrollY;
    };
    window.addEventListener("popstate", onPop);

    let refreshTimer = 0;
    const refreshSoon = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(refresh, 80);
    };
    const onResourceLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) refreshSoon();
    };
    document.addEventListener("load", onResourceLoad, true);

    const rememberScroll = () => {
      if (popId !== lastAppliedPop) return;
      scrollMemory.set(pageKey(), window.scrollY);
    };
    window.addEventListener("scroll", rememberScroll, { passive: true });

    return () => {
      introObserver.disconnect();
      desktopMq.removeEventListener("change", onMode);
      coarseMq.removeEventListener("change", onMode);
      reduceMq.removeEventListener("change", onMode);
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("load", onResourceLoad, true);
      window.removeEventListener("scroll", rememberScroll);
      window.clearTimeout(refreshTimer);
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [applyPause, scrollToElement, setPaused]);

  useLayoutEffect(() => {
    navigating = false;
    const page = document.getElementById("page-root");
    const line = document.querySelector<HTMLElement>(".route-line");
    if (line) gsap.set(line, { scaleX: 0 });
    if (armEnter && page) {
      armEnter = false;
      const duration = reducedMotion() ? route.reduced : route.enter;
      gsap.fromTo(
        page,
        { opacity: 0 },
        {
          opacity: 1,
          duration,
          ease: ease.out,
          onComplete() {
            gsap.set(page, { clearProps: "opacity" });
          },
        },
      );
    }

    const restoreId = popId;
    const popped = restoreId !== lastAppliedPop;
    const restoreY = poppedY;

    const applyScroll = (y: number) => {
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    };
    if (!popped) applyScroll(0);

    const hash = window.location.hash;
    const frame = window.requestAnimationFrame(() => {
      ScrollTrigger.getAll().forEach((item) => {
        if (item.trigger instanceof Element && !item.trigger.isConnected) item.kill();
      });
      ScrollTrigger.refresh();
      if (popped) {
        applyScroll(restoreY);
        return;
      }
      if (!hash) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) scrollToElement(target);
    });
    const later = window.setTimeout(() => {
      lastAppliedPop = restoreId;
      if (popped) applyScroll(restoreY);
    }, 50);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(later);
    };
  }, [pathname, scrollToElement]);

  return (
    <SmoothContext.Provider value={api}>
      {children}
      <div className="route-line" aria-hidden="true" />
    </SmoothContext.Provider>
  );
}
