"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LOGO_VIEWBOX, LOGO_VIEWBOX_STACKED, STACKED } from "@/components/brand/logo-paths";
import { AnimatedLogo } from "@/components/intro/AnimatedLogo";
import { ContourField } from "@/components/intro/ContourField";
import { useIntro } from "@/components/intro/IntroContext";
import { markIntroSeen, resolveIntroMode, type IntroMode } from "@/components/intro/intro-mode";
import { buildGlobePaths, veinGuideY } from "@/components/intro/globe";
import { DevControls } from "@/components/intro/DevControls";
import { useTagline } from "@/components/content/TaglineWatch";
import { introTagline } from "@/content/taglines";
import { track } from "@/lib/analytics";

gsap.registerPlugin(useGSAP);

function outside(selector: string) {
  return document.querySelectorAll(selector);
}

function setPageInert(locked: boolean) {
  const nav = document.getElementById("site-nav");
  const main = document.querySelector("main");
  for (const element of [nav, main]) {
    if (!element) continue;
    if (locked) element.setAttribute("inert", "");
    else element.removeAttribute("inert");
  }
}

export function OpeningSequence() {
  useTagline(introTagline);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contoursRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const t1Ref = useRef<HTMLParagraphElement>(null);
  const t2Ref = useRef<HTMLParagraphElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const markRef = useRef<SVGGElement>(null);
  const miningRef = useRef<SVGGElement>(null);
  const revealRef = useRef<SVGRectElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const sheenRef = useRef<SVGGElement>(null);
  const sheenGradRef = useRef<SVGLinearGradientElement>(null);
  const globeRef = useRef<SVGGElement>(null);
  const oRef = useRef<SVGPathElement>(null);
  const frontRef = useRef<SVGPathElement>(null);
  const backRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const pingRef = useRef<SVGCircleElement>(null);
  const skipAction = useRef<() => void>(() => {});
  const {
    replayToken,
    forcedMode,
    videoReadyRef,
    onVideoReadyRef,
    setPosterFallback,
    navLogoRef,
    heroMediaRef,
  } = useIntro();

  useGSAP(
    () => {
      const mode: IntroMode = forcedMode ?? resolveIntroMode();
      document.documentElement.dataset.intro = mode;
      window.__BO_INTRO__ = mode;

      let waitId = 0;
      let handing = false;
      const animations: gsap.core.Animation[] = [];
      const introEl = rootRef.current;
      const logo = svgRef.current;
      const mark = markRef.current;
      const mining = miningRef.current;

      const paintGlobe = (lambda: number) => {
        const { front, back, dot } = buildGlobePaths(lambda);
        frontRef.current?.setAttribute("d", front);
        backRef.current?.setAttribute("d", back);
        dotRef.current?.setAttribute("cx", String(dot.x));
        dotRef.current?.setAttribute("cy", String(dot.y));
        pingRef.current?.setAttribute("cx", String(dot.x));
        pingRef.current?.setAttribute("cy", String(dot.y));
        if (dotRef.current) dotRef.current.style.opacity = dot.z > 0 ? "1" : "0";
      };

      const navSvg = () => navLogoRef.current?.querySelector("svg") ?? null;

      const applyLayout = () => {
        if (!logo || !mark || !mining || handing) return window.innerWidth < 640;
        const stacked = window.innerWidth < 640;
        document.documentElement.classList.toggle("is-stacked", stacked);
        logo.setAttribute("viewBox", stacked ? LOGO_VIEWBOX_STACKED : LOGO_VIEWBOX);
        gsap.set(mark, stacked
          ? { x: STACKED.mark.x, y: STACKED.mark.y, scale: STACKED.mark.scale, svgOrigin: "0 0" }
          : { x: 0, y: 0, scale: 1, svgOrigin: "0 0" });
        gsap.set(mining, stacked ? { x: STACKED.mining.x, y: STACKED.mining.y } : { x: 0, y: 0 });
        return stacked;
      };

      const writeFinalCounts = () => {
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          el.textContent = Number(el.dataset.count).toFixed(Number(el.dataset.dec || 0));
        });
      };

      const countUp = () => {
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const decimals = Number(el.dataset.dec || 0);
          const value = { v: 0 };
          animations.push(
            gsap.to(value, {
              v: end,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = value.v.toFixed(decimals);
              },
            }),
          );
        });
      };

      const finishNow = () => {
        handing = true;
        window.clearTimeout(waitId);
        onVideoReadyRef.current = null;
        animations.forEach((animation) => animation.kill());
        if (introEl) {
          introEl.style.display = "none";
          introEl.classList.add("is-settled");
        }
        document.documentElement.dataset.intro = mode === "none" ? "none" : "done";
        document.documentElement.classList.remove("is-stacked");
        document.documentElement.style.overflow = "";
        const svg = navSvg();
        if (svg) svg.style.visibility = "visible";
        setPageInert(false);
        if (mode !== "none") {
          gsap.set(outside("#site-nav [data-reveal]"), { opacity: 1, y: 0 });
          gsap.set(outside("[data-hero]"), { opacity: 1, y: 0 });
          gsap.set(outside("[data-stat]"), { opacity: 1, y: 0 });
          gsap.set(outside("[data-line]"), { y: 0, yPercent: 0 });
          if (heroMediaRef.current) gsap.set(heroMediaRef.current, { scale: 1 });
        }
        writeFinalCounts();
        markIntroSeen();
      };

      skipAction.current = finishNow;

      if (mode === "none") {
        if (introEl) introEl.style.display = "none";
        const svg = navSvg();
        if (svg) svg.style.visibility = "visible";
        setPageInert(false);
        markIntroSeen();
        return;
      }

      const handoff = (animateUnstack: boolean) => {
        if (handing || !logo || !mark || !mining || !introEl) return;
        handing = true;
        onVideoReadyRef.current = null;
        window.clearTimeout(waitId);

        const stackedNow = document.documentElement.classList.contains("is-stacked");
        const sequence = gsap.timeline({ defaults: { ease: "power3.inOut" } });
        animations.push(sequence);

        sequence
          .to([t1Ref.current, t2Ref.current, skipRef.current], {
            opacity: 0,
            y: -6,
            duration: 0.45,
            ease: "power2.in",
          }, 0)
          .to(globeRef.current, {
            opacity: 0,
            scale: 0.92,
            svgOrigin: "340.55 163.65",
            duration: 0.6,
            ease: "power2.inOut",
          }, 0.05)
          .to(oRef.current, { opacity: 1, duration: 0.6, ease: "power2.inOut" }, 0.1);

        let flyAt = 0.35;
        if (stackedNow && animateUnstack) {
          sequence
            .to(logo, { attr: { viewBox: LOGO_VIEWBOX }, duration: 0.75 }, flyAt)
            .to(mark, { x: 0, y: 0, scale: 1, svgOrigin: "0 0", duration: 0.75 }, flyAt)
            .to(mining, { x: 0, y: 0, duration: 0.75 }, flyAt);
          flyAt += 0.7;
        } else if (stackedNow) {
          logo.setAttribute("viewBox", LOGO_VIEWBOX);
          gsap.set(mark, { x: 0, y: 0, scale: 1, svgOrigin: "0 0" });
          gsap.set(mining, { x: 0, y: 0 });
          flyAt = 0.05;
        }

        sequence.add(() => {
          const svg = navSvg();
          if (!svg) {
            finishNow();
            return;
          }
          const from = logo.getBoundingClientRect();
          const to = svg.getBoundingClientRect();
          const scale = from.width > 0 ? to.width / from.width : 1;
          const dx = to.left + to.width / 2 - (from.left + from.width / 2);
          const dy = to.top + to.height / 2 - (from.top + from.height / 2);

          const fly = gsap.timeline({ defaults: { ease: "power3.inOut" } });
          animations.push(fly);
          fly
            .to(logo, { x: dx, y: dy, scale, duration: 1.15, transformOrigin: "50% 50%" })
            .to(contoursRef.current, { opacity: 0, duration: 0.8 }, 0)
            .to(introEl, { backgroundColor: "rgba(5,5,5,0)", duration: 1.1, ease: "power2.inOut" }, 0.1)
            .to(heroMediaRef.current, { scale: 1, duration: 2.6, ease: "power2.out" }, 0.1)
            .add(() => {
              svg.style.visibility = "visible";
              introEl.style.display = "none";
              introEl.style.backgroundColor = "";
              introEl.classList.add("is-settled");
              document.documentElement.dataset.intro = "done";
              document.documentElement.classList.remove("is-stacked");
              document.documentElement.style.overflow = "";
              setPageInert(false);
              markIntroSeen();
            }, 1.15)
            .to(outside("#site-nav [data-reveal]"), {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.06,
              ease: "power3.out",
            }, 0.95)
            .fromTo(outside("[data-line]"), {
              y: 0,
              yPercent: 105,
            }, {
              y: 0,
              yPercent: 0,
              duration: 1.1,
              stagger: 0.1,
              ease: "expo.out",
              immediateRender: false,
            }, 0.75)
            .to(outside("[data-hero]"), {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.1,
              ease: "power3.out",
            }, 0.95)
            .to(outside("[data-stat]"), {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.07,
              ease: "power3.out",
            }, 1.25)
            .add(countUp, 1.25);
        }, flyAt);
      };

      const armGate = (delayMs: number) => {
        const go = (late: boolean) => {
          if (handing) return;
          onVideoReadyRef.current = null;
          window.clearTimeout(waitId);
          if (late) setPosterFallback(true);
          handoff(mode === "full");
        };
        if (videoReadyRef.current) go(false);
        else {
          onVideoReadyRef.current = () => go(false);
          waitId = window.setTimeout(() => go(!videoReadyRef.current), delayMs);
        }
      };

      const svg = navSvg();
      if (svg) svg.style.visibility = "";
      if (introEl) {
        introEl.style.display = "grid";
        introEl.style.backgroundColor = "";
        introEl.classList.remove("is-settled");
      }
      document.documentElement.style.overflow = "hidden";
      setPageInert(true);
      if (logo) gsap.set(logo, { x: 0, y: 0, scale: 1, transformOrigin: "50% 50%" });
      applyLayout();

      gsap.set(revealRef.current, { attr: { width: mode === "short" ? 800 : 0 } });
      gsap.set(headRef.current, { opacity: 0 });
      gsap.set(sheenRef.current, { opacity: 0 });
      gsap.set(globeRef.current, { opacity: mode === "short" ? 0 : 1, scale: 1, svgOrigin: "340.55 163.65" });
      gsap.set(oRef.current, { opacity: mode === "short" ? 1 : 0 });
      gsap.set(pingRef.current, { attr: { r: 1.3 }, opacity: 0 });
      paintGlobe(mode === "short" ? -2.1 : -722);
      gsap.set(contoursRef.current, { opacity: 0 });
      gsap.set(skipRef.current, { opacity: 0 });
      gsap.set(outside("#site-nav [data-reveal]"), { opacity: 0, y: -6 });
      gsap.set(outside("[data-hero]"), { opacity: 0, y: 18 });
      gsap.set(outside("[data-line]"), { y: 0, yPercent: 105 });
      gsap.set(outside("[data-stat]"), { opacity: 0, y: 14 });
      if (heroMediaRef.current) gsap.set(heroMediaRef.current, { scale: 1.08 });
      document.getElementById("site-nav")?.classList.remove("is-glass");

      if (mode === "short") {
        gsap.set(".letter", { y: 0, opacity: 1 });
        gsap.set(".mi", { x: 0, opacity: 1 });
        gsap.set([t1Ref.current, t2Ref.current], { opacity: 1, y: 0 });
        const fade = gsap.timeline();
        animations.push(fade);
        fade
          .fromTo(stageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power3.out" }, 0)
          .to(contoursRef.current, { opacity: 0.07, duration: 0.4, ease: "power1.out" }, 0)
          .to(skipRef.current, { opacity: 1, duration: 0.3 }, 0.1)
          .add(() => armGate(1700), 0.8);
      } else {
        gsap.set(".letter", { y: 40, opacity: 0 });
        gsap.set(".mi", { opacity: 0, x: 0 });
        gsap.set([t1Ref.current, t2Ref.current], { opacity: 0, y: 10 });
        gsap.set(stageRef.current, { opacity: 1 });

        const vein = { x: 40 };
        const globeSpin = { lambda: -722 };
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        animations.push(tl);
        tl.to(contoursRef.current, { opacity: 0.07, duration: 1.6, ease: "power1.out" }, 0)
          .to(skipRef.current, { opacity: 1, duration: 0.6 }, 0.8)
          .set(headRef.current, { opacity: 1 }, 0.25)
          .to(vein, {
            x: 800,
            duration: 1.55,
            ease: "power2.inOut",
            onUpdate() {
              revealRef.current?.setAttribute("width", String(Math.max(0, vein.x - 30)));
              const x = Math.min(vein.x, 786);
              headRef.current?.setAttribute("cx", String(x));
              headRef.current?.setAttribute("cy", String(veinGuideY(x)));
            },
          }, 0.25)
          .to(headRef.current, { opacity: 0, duration: 0.35, ease: "power1.in" }, 1.65)
          .set(sheenRef.current, { opacity: 1 }, 1.55)
          .fromTo(
            sheenGradRef.current,
            { attr: { x1: -260, x2: -60 } },
            { attr: { x1: 860, x2: 1060 }, duration: 1.1, ease: "power2.inOut" },
            1.55,
          )
          .to(".letter", { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.055 }, 1.35)
          .to(globeSpin, {
            lambda: -2.1,
            duration: 2.5,
            ease: "expo.out",
            onUpdate: () => paintGlobe(globeSpin.lambda),
          }, 1.45)
          .fromTo(
            ".mi",
            { x: (index: number) => (2.5 - index) * 14, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 1.15,
              ease: "power3.out",
              stagger: { each: 0.04, from: "center" },
            },
            2,
          )
          .to(t1Ref.current, { opacity: 1, y: 0, duration: 0.9 }, 2.7)
          .to(t2Ref.current, { opacity: 1, y: 0, duration: 0.9 }, 2.9)
          .to(pingRef.current, { opacity: 0.9, duration: 0.01 }, 3.15)
          .to(pingRef.current, { attr: { r: 6 }, opacity: 0, duration: 1.2, ease: "power2.out" }, 3.16)
          .add(() => armGate(1900), 5.1);
      }

      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!handing) applyLayout();
        }, 150);
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.clearTimeout(waitId);
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        onVideoReadyRef.current = null;
        setPageInert(false);
      };
    },
    { scope: rootRef, dependencies: [replayToken, forcedMode], revertOnUpdate: true },
  );

  return (
    <>
      <div className="intro" id="intro" ref={rootRef}>
        <ContourField canvasRef={contoursRef} />
        <div className="intro-stage" ref={stageRef} aria-hidden="true">
          <AnimatedLogo
          svgRef={svgRef}
          markRef={markRef}
          miningRef={miningRef}
          revealRef={revealRef}
          headRef={headRef}
          sheenRef={sheenRef}
          sheenGradRef={sheenGradRef}
          globeRef={globeRef}
          oShapeRef={oRef}
          frontRef={frontRef}
          backRef={backRef}
          dotRef={dotRef}
          pingRef={pingRef}
        />
          <div className="intro-tag">
            <p className="t1" ref={t1Ref}>
              {introTagline}
            </p>
            <p className="t2" ref={t2Ref}>
              <em>●</em>&nbsp; Badu · Bono Region · 7°39′N 2°06′W
            </p>
          </div>
        </div>
        <button
          ref={skipRef}
          className="skip"
          type="button"
          onClick={() => {
            track("intro_skipped");
            skipAction.current();
          }}
        >
          Skip intro
        </button>
      </div>
      {process.env.NODE_ENV === "development" ? <DevControls /> : null}
    </>
  );
}
