"use client";

import { memo, useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";
import { GEO_TOUR_STEPS, localGeology, type TourGroup } from "@/content/concession";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import { ease, geoTour } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";

type Unit = {
  code: string;
  group: TourGroup;
  name: string;
  site: string;
  sharePct: number;
  d: string;
};

type GeoModule = {
  GEO_VIEWBOX: string;
  GEO_GEOREF: { E0: number; N0: number; metresPerUnit: number };
  GEO_UNITS: readonly Unit[];
  GEO_DRAINAGE: readonly string[];
  GEO_STRUCTURES: readonly string[];
  GEO_BOUNDARY: string;
  GEO_PILLARS: readonly (readonly [number, number])[];
};

const GROUP_ORDER: TourGroup[] = ["volcanics", "granitoid", "metasediments"];

function shareLabel(pct: number) {
  if (pct === 0) return "outside";
  if (pct < 1) return "<1%";
  return `≈${Math.round(pct)}%`;
}

function groupTotal(units: readonly Unit[], group: TourGroup) {
  return units.filter((unit) => unit.group === group).reduce((sum, unit) => sum + unit.sharePct, 0);
}

function clockNow() {
  return performance.now();
}

const GeoLayers = memo(function GeoLayers({ geo }: { geo: GeoModule }) {
  const { E0, N0, metresPerUnit } = geo.GEO_GEOREF;
  const width = 1190;
  const height = 831;
  const eastings: number[] = [];
  const northings: number[] = [];
  for (let easting = 590000; easting <= 610000; easting += 5000) eastings.push(easting);
  for (let northing = 840000; northing <= 855000; northing += 5000) northings.push(northing);

  return (
    <>
      <g className="geo-grid" aria-hidden="true">
        {eastings.map((easting) => {
          const x = (easting - E0) / metresPerUnit;
          if (x < 0 || x > width) return null;
          return (
            <g key={easting}>
              <line x1={x} y1={0} x2={x} y2={height} />
              <text x={x + 4} y={height - 8}>
                {(easting / 1000).toFixed(0)} kmE
              </text>
            </g>
          );
        })}
        {northings.map((northing) => {
          const y = (N0 - northing) / metresPerUnit;
          if (y < 0 || y > height) return null;
          return (
            <g key={northing}>
              <line x1={0} y1={y} x2={width} y2={y} />
              <text x={6} y={y - 5}>
                {(northing / 1000).toFixed(0)} kmN
              </text>
            </g>
          );
        })}
      </g>
      <g>
        {geo.GEO_UNITS.map((unit) => (
          <path
            key={unit.code}
            className="geo-u"
            data-g={unit.group}
            d={unit.d}
            fill={unit.site}
            fillRule="evenodd"
          />
        ))}
      </g>
      <g>
        {geo.GEO_UNITS.map((unit) => (
          <path key={`${unit.code}-line`} className="geo-ol" d={unit.d} />
        ))}
      </g>
      <g>
        {geo.GEO_DRAINAGE.map((d, index) => (
          <path key={index} className="geo-dr" d={d} />
        ))}
      </g>
      <g>
        {geo.GEO_STRUCTURES.map((d, index) => (
          <path key={index} className="geo-st" d={d} />
        ))}
      </g>
      <path className="geo-dim" d={`M0 0H${width}V${height}H0Z${geo.GEO_BOUNDARY}`} fillRule="evenodd" />
      <path className="geo-bd" d={geo.GEO_BOUNDARY} />
      <g>
        {geo.GEO_PILLARS.map(([x, y], index) => (
          <circle key={index} className="geo-pil" cx={x} cy={y} r={2.6} />
        ))}
      </g>
    </>
  );
});

export function GeologyMapTour() {
  const [geo, setGeo] = useState<GeoModule | null>(null);
  const [geoFailed, setGeoFailed] = useState(false);
  const [step, setStep] = useState(0);
  const [focus, setFocus] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stepRef = useRef(0);
  const drawn = useRef(false);
  const machine = useRef({
    stopped: false,
    visible: false,
    remain: 0,
    startedAt: 0,
    timer: 0,
    phase: "idle" as "idle" | "wait" | "dwell",
  });

  const current = GEO_TOUR_STEPS[step];
  useTagline(localGeology.title);
  useTagline(current.title);

  useEffect(() => {
    const node = mapRef.current;
    if (!node) return;
    let cancel = false;
    const load = () => {
      void import("@/content/geo/geology-map")
        .then((mod) => {
          if (!cancel) setGeo(mod as GeoModule);
        })
        .catch(() => {
          if (!cancel) setGeoFailed(true);
        });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => {
      cancel = true;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!geo) return;
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [geo]);

  function halt() {
    machine.current.stopped = true;
    machine.current.phase = "idle";
    window.clearTimeout(machine.current.timer);
    setPlaying(false);
    setPaused(false);
  }

  function arm(ms: number) {
    const state = machine.current;
    window.clearTimeout(state.timer);
    if (state.stopped || !state.visible || reducedMotion()) return;
    state.remain = ms;
    state.startedAt = clockNow();
    setPaused(false);
    setPlaying(state.phase === "dwell");
    state.timer = window.setTimeout(() => {
      if (state.stopped) return;
      if (state.phase === "wait") {
        state.phase = "dwell";
        advance(1);
        return;
      }
      const next = stepRef.current + 1;
      if (next >= GEO_TOUR_STEPS.length) {
        state.phase = "idle";
        setPlaying(false);
        return;
      }
      advance(next);
    }, ms);
  }

  function advance(index: number) {
    stepRef.current = index;
    setStep(index);
    setFocus(index);
    machine.current.phase = "dwell";
    arm(geoTour.dwell * 1000);
  }

  function select(index: number) {
    const chosen = GEO_TOUR_STEPS[index];
    if (chosen) track("geology_layer_view", { step: chosen.id });
    halt();
    stepRef.current = index;
    setStep(index);
    setFocus(index);
  }

  function prime() {
    const svg = svgRef.current;
    if (!svg || reducedMotion() || drawn.current) return;
    svg.querySelectorAll<SVGGeometryElement>(".geo-ol, .geo-dr, .geo-st, .geo-bd").forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    });
  }

  function draw() {
    const svg = svgRef.current;
    if (!svg || drawn.current) return;
    drawn.current = true;
    if (reducedMotion()) return;
    const outlines = svg.querySelectorAll(".geo-ol");
    const streams = svg.querySelectorAll(".geo-dr");
    const structures = svg.querySelectorAll(".geo-st");
    const boundary = svg.querySelector(".geo-bd");
    const all = svg.querySelectorAll(".geo-ol, .geo-dr, .geo-st, .geo-bd");
    gsap.to(outlines, {
      strokeDashoffset: 0,
      duration: geoTour.outlineDur,
      stagger: geoTour.outlineStagger,
      ease: ease.inOut,
    });
    gsap.to(streams, {
      strokeDashoffset: 0,
      duration: geoTour.streamDur,
      delay: () => geoTour.streamFrom + Math.random() * geoTour.streamSpan,
      ease: ease.inOut,
    });
    gsap.to(structures, {
      strokeDashoffset: 0,
      duration: geoTour.structureDur,
      delay: (index: number) => geoTour.structureAt + index * geoTour.structureStagger,
      ease: ease.inOut,
    });
    if (boundary) {
      gsap.to(boundary, {
        strokeDashoffset: 0,
        duration: geoTour.boundaryDur,
        delay: geoTour.boundaryAt,
        ease: ease.inOut,
      });
    }
    gsap.delayedCall(geoTour.clearAt, () => {
      gsap.set(all, { clearProps: "strokeDasharray,strokeDashoffset" });
    });
    if (!machine.current.stopped) {
      machine.current.phase = "wait";
      arm(geoTour.autoDelay * 1000);
    }
  }

  const onVisibility = useEffectEvent((on: boolean) => {
    const was = machine.current.visible;
    machine.current.visible = on;
    if (on && !drawn.current) draw();
    if (!on && was && !machine.current.stopped && machine.current.phase !== "idle") {
      window.clearTimeout(machine.current.timer);
      machine.current.remain = Math.max(0, machine.current.remain - (clockNow() - machine.current.startedAt));
      setPaused(true);
    }
    if (on && !was && !machine.current.stopped && machine.current.phase !== "idle") {
      arm(machine.current.remain);
    }
  });

  useLayoutEffect(() => {
    prime();
  }, [geo]);

  useEffect(() => {
    const node = mapRef.current;
    if (!node || !geo) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const on = Boolean(entry?.isIntersecting && entry.intersectionRatio >= geoTour.view);
        onVisibility(on);
      },
      { threshold: [0, geoTour.view] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [geo]);

  useEffect(() => {
    const scroller = chipsRef.current;
    const chip = chipRefs.current[step];
    if (!scroller || !chip) return;
    scroller.scrollTo({
      left: chip.offsetLeft - scroller.clientWidth / 2 + chip.clientWidth / 2,
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  }, [step]);

  useEffect(() => {
    const card = mapRef.current;
    if (!card) return;
    const fit = () => {
      const bar = card.querySelector<HTMLElement>(".geo-scale i");
      const svg = card.querySelector("svg");
      if (!bar || !svg) return;
      bar.style.width = `${(100 / 1190) * svg.getBoundingClientRect().width}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(card);
    return () => observer.disconnect();
  }, [geo]);

  function onKeys(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      halt();
      return;
    }
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End", "Enter", " "];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    halt();
    const last = GEO_TOUR_STEPS.length - 1;
    if (event.key === "Enter" || event.key === " ") {
      select(focus);
      return;
    }
    let next = focus;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(last, focus + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, focus - 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    setFocus(next);
    chipRefs.current[next]?.focus();
  }

  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);

  function onSwipe(event: React.PointerEvent) {
    const start = swipe.current;
    if (!start || event.pointerId !== start.id) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    swipe.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    halt();
    const next = dx < 0 ? Math.min(GEO_TOUR_STEPS.length - 1, stepRef.current + 1) : Math.max(0, stepRef.current - 1);
    select(next);
  }

  function replay() {
    const svg = svgRef.current;
    if (svg) gsap.killTweensOf(svg.querySelectorAll(".geo-ol, .geo-dr, .geo-st, .geo-bd"));
    window.clearTimeout(machine.current.timer);
    machine.current.stopped = reducedMotion();
    machine.current.phase = "idle";
    machine.current.remain = 0;
    drawn.current = false;
    stepRef.current = 0;
    setStep(0);
    setFocus(0);
    setPlaying(false);
    setPaused(false);
    requestAnimationFrame(() => {
      prime();
      if (machine.current.visible) draw();
    });
  }

  const units = geo?.GEO_UNITS ?? [];
  const legendUnits = current.group ? units.filter((unit) => unit.group === current.group) : [];
  const concessionLegend = current.id === "concession";

  return (
    <Section id="geology" tone="ink" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{localGeology.eyebrow}</Eyebrow>
          <SplitHeading>{localGeology.title}</SplitHeading>
          <Lede>{localGeology.lede}</Lede>
        </div>
        <div className="geo-stage">
          <div>
            <div
              ref={mapRef}
              className="geo-card"
              onPointerDown={(event) => {
                swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
              }}
              onPointerUp={onSwipe}
              onPointerCancel={() => {
                swipe.current = null;
              }}
            >
              {geoFailed ? (
                <p className="geo-error">{"The geology map didn't load. Reload the page to try again."}</p>
              ) : (
              <svg
                ref={svgRef}
                className="geo-svg"
                viewBox={geo?.GEO_VIEWBOX ?? "0 0 1190 831"}
                data-step={current.id}
                role="img"
                aria-label="Geology map of the Badu concession, coloured by the rock units in the tour"
              >
                {geo && <GeoLayers geo={geo} />}
              </svg>
              )}
              <div className="geo-north" aria-hidden="true">
                <svg viewBox="0 0 10 14">
                  <path d="M5 0 10 14 5 10 0 14Z" fill="currentColor" />
                </svg>
                N
              </div>
              <div className="geo-scale" aria-hidden="true">
                <i />
                <span>2 km</span>
                <span>UTM 30N</span>
              </div>
            </div>
            <div
              ref={chipsRef}
              className="geo-chips"
              role="tablist"
              aria-label="Map layers"
              onKeyDown={onKeys}
            >
              {GEO_TOUR_STEPS.map((item, index) => (
                <button
                  key={item.id}
                  ref={(node) => {
                    chipRefs.current[index] = node;
                  }}
                  type="button"
                  className={playing && step === index ? "geo-chip is-playing" : "geo-chip"}
                  role="tab"
                  id={`geo-chip-${item.id}`}
                  aria-selected={step === index}
                  aria-controls="geo-panel"
                  tabIndex={focus === index ? 0 : -1}
                  data-paused={paused && step === index ? "" : undefined}
                  style={{ ["--dwell" as string]: `${geoTour.dwell}s` }}
                  onClick={() => select(index)}
                >
                  {item.chip}
                  <span className="geo-bar" />
                </button>
              ))}
            </div>
          </div>
          <div className="geo-panel" id="geo-panel" role="tabpanel" aria-live="polite" aria-labelledby={`geo-chip-${current.id}`}>
            <div className="geo-step" key={current.id}>
              <p className="geo-count">
                {String(step + 1).padStart(2, "0")} / {String(GEO_TOUR_STEPS.length).padStart(2, "0")}
              </p>
              <h3>{current.title}</h3>
              <p>{current.body}</p>
              {current.group && geo && (
                <p className="geo-stat">≈{Math.round(groupTotal(units, current.group))}% of the concession</p>
              )}
              {geo && (legendUnits.length > 0 || concessionLegend) && (
                <ul className="geo-legend">
                  {concessionLegend
                    ? GROUP_ORDER.map((group) => {
                        const sample = units.find((unit) => unit.group === group);
                        return (
                          <li key={group}>
                            <i style={{ background: sample?.site }} />
                            <span>{group[0].toUpperCase() + group.slice(1)}</span>
                            <span>≈{Math.round(groupTotal(units, group))}%</span>
                          </li>
                        );
                      })
                    : legendUnits.map((unit) => (
                        <li key={unit.code}>
                          <i style={{ background: unit.site }} />
                          <span>{unit.name}</span>
                          <span>{shareLabel(unit.sharePct)}</span>
                        </li>
                      ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <Caption className="geo-source is-sentence">{localGeology.source}</Caption>
        <button type="button" className="geo-replay" onClick={replay}>
          {localGeology.replay}
        </button>
      </Container>
    </Section>
  );
}
