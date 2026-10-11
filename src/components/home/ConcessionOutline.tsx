"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { CountUp, type CountUpHandle } from "@/components/motion/CountUp";
import { Caption } from "@/components/type/Caption";
import {
  CONCESSION_PATH,
  CONCESSION_VIEWBOX,
  LOCAL_SCALE_KM,
  LOCAL_TOWNS,
  PILLAR_POINTS,
  PILLARS,
} from "@/content/geo/concession-boundary";
import { gsap } from "@/lib/gsap";
import { dur, ease, mapMotion, rise, stagger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";

export type ConcessionOutlineHandle = { play: () => void };

type Presentation = "card" | "explorer";

const VIEW_W = 1000;
const VIEW_H = 844;
const METRES_PER_UNIT = 1000 / LOCAL_SCALE_KM;

/** UTM origin fitted so pillar 1 lands on its surveyed easting and northing. */
const ORIGIN_E = PILLARS[0].e - PILLAR_POINTS[0][0] * METRES_PER_UNIT;
const ORIGIN_N = PILLARS[0].n + PILLAR_POINTS[0][1] * METRES_PER_UNIT;

const GRID_LINES = (() => {
  const lines: { axis: "e" | "n"; at: number; label: string }[] = [];
  const e0 = Math.ceil(ORIGIN_E / 1000) * 1000;
  const e1 = ORIGIN_E + VIEW_W * METRES_PER_UNIT;
  for (let e = e0; e <= e1; e += 1000) {
    const x = (e - ORIGIN_E) / METRES_PER_UNIT;
    if (x < 24 || x > VIEW_W - 24) continue;
    if (e % 2000 === 0) lines.push({ axis: "e", at: x, label: `${e / 1000} kmE` });
    else lines.push({ axis: "e", at: x, label: "" });
  }
  const n1 = ORIGIN_N;
  const n0 = ORIGIN_N - VIEW_H * METRES_PER_UNIT;
  const start = Math.ceil(n0 / 1000) * 1000;
  for (let n = start; n <= n1; n += 1000) {
    const y = (ORIGIN_N - n) / METRES_PER_UNIT;
    if (y < 24 || y > VIEW_H - 24) continue;
    if (n % 2000 === 0) lines.push({ axis: "n", at: y, label: `${n / 1000} kmN` });
    else lines.push({ axis: "n", at: y, label: "" });
  }
  return lines;
})();

function formatUtm(value: number, axis: "E" | "N") {
  return `${value.toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m${axis}`;
}

export const ConcessionOutline = forwardRef<
  ConcessionOutlineHandle,
  { presentation?: Presentation }
>(function ConcessionOutline({ presentation = "card" }, handle) {
  const root = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const played = useRef(false);
  const playRef = useRef<() => void>(() => {});
  const area = useRef<CountUpHandle>(null);
  const explorer = presentation === "explorer";
  const [tip, setTip] = useState<{
    id: string;
    dms: string;
    easting: string;
    northing: string;
    x: number;
    y: number;
    pinned: boolean;
  } | null>(null);
  const [labelSize, setLabelSize] = useState(14);

  function show(index: number, pinned: boolean) {
    const pillar = PILLARS[index];
    const point = PILLAR_POINTS[index];
    setTip({
      id: pillar.id,
      dms: pillar.dms,
      easting: formatUtm(pillar.e, "E"),
      northing: formatUtm(pillar.n, "N"),
      x: point[0],
      y: point[1],
      pinned,
    });
  }

  function move(index: number, event: React.KeyboardEvent<SVGCircleElement>) {
    if (!explorer) return;
    const key = event.key;
    if (key !== "ArrowRight" && key !== "ArrowDown" && key !== "ArrowLeft" && key !== "ArrowUp") return;
    event.preventDefault();
    const step = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
    const next = (index + step + PILLARS.length) % PILLARS.length;
    const node = event.currentTarget.ownerSVGElement?.querySelector<SVGCircleElement>(
      `[data-pillar="${PILLARS[next].id}"]`,
    );
    node?.focus();
    show(next, window.matchMedia("(max-width: 767px)").matches);
  }

  const play = useCallback(() => {
    const node = root.current;
    if (!node || played.current) return;
    played.current = true;
    if (reducedMotion()) {
      gsap.set(node, { opacity: 1, y: 0 });
      return;
    }
    const stroke = node.querySelector(".concession-stroke");
    const dots = node.querySelectorAll(".pillar-dot");
    const fill = node.querySelector(".concession-fill");
    gsap.fromTo(
      node,
      explorer ? { opacity: 0 } : { opacity: 0, y: rise.md },
      { opacity: 1, y: 0, duration: dur.slow, ease: ease.out },
    );
    if (stroke) {
      const length = (stroke as SVGPathElement).getTotalLength();
      gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(stroke, { strokeDashoffset: 0, duration: mapMotion.boundary, ease: ease.inOut });
    }
    gsap.fromTo(
      dots,
      { opacity: 0 },
      { opacity: 1, duration: dur.fast, stagger: stagger.tight, delay: mapMotion.boundary * 0.45 },
    );
    if (fill) {
      gsap.fromTo(
        fill,
        { fillOpacity: 0 },
        { fillOpacity: 0.16, duration: dur.slow, delay: mapMotion.boundary * 0.82 },
      );
    }
    area.current?.play();
  }, [explorer]);

  playRef.current = play;

  useImperativeHandle(handle, () => ({ play }), [play]);

  useEffect(() => {
    if (!explorer) return;
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        playRef.current();
        observer.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [explorer]);

  useGSAP(() => {
    if (!explorer) return;
    const fit = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const width = svg.getBoundingClientRect().width;
      if (width > 0) setLabelSize((9 * VIEW_W) / width);
      const bar = svg.parentElement?.querySelector<HTMLElement>(".explorer-scale i");
      if (bar && width > 0) bar.style.width = `${((2 * LOCAL_SCALE_KM) / VIEW_W) * width}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, { dependencies: [explorer] });

  return (
    <div ref={root} className={explorer ? "concession-explorer" : "concession-card"}>
      <div className="concession-svg-wrap">
        <svg
          ref={svgRef}
          className="concession-svg"
          viewBox={CONCESSION_VIEWBOX}
          role="img"
          aria-label={
            explorer
              ? "Surveyed boundary of the Badu concession, with 70 pillars"
              : "Outline of the Badu concession"
          }
        >
          {explorer && (
            <g className="utm-grid" aria-hidden="true">
              {GRID_LINES.map((line) =>
                line.axis === "e" ? (
                  <g key={`e-${line.at}`}>
                    <line x1={line.at} y1={0} x2={line.at} y2={VIEW_H} />
                    {line.label && (
                      <text x={line.at + 6} y={VIEW_H - 10} fontSize={labelSize}>
                        {line.label}
                      </text>
                    )}
                  </g>
                ) : (
                  <g key={`n-${line.at}`}>
                    <line x1={0} y1={line.at} x2={VIEW_W} y2={line.at} />
                    {line.label && (
                      <text x={8} y={line.at - 6} fontSize={labelSize}>
                        {line.label}
                      </text>
                    )}
                  </g>
                ),
              )}
            </g>
          )}
          <path className="concession-fill" d={CONCESSION_PATH} />
          <path className="concession-stroke" d={CONCESSION_PATH} />
          {PILLAR_POINTS.map(([x, y], index) => (
            <circle key={PILLARS[index].id} className="pillar-dot" cx={x} cy={y} r={explorer ? 3.2 : 4.5} />
          ))}
          {PILLAR_POINTS.map(([x, y], index) => {
            const pillar = PILLARS[index];
            const label = explorer
              ? `${pillar.id}, ${pillar.dms}, ${formatUtm(pillar.e, "E")}, ${formatUtm(pillar.n, "N")}`
              : `${pillar.id}, ${pillar.dms}`;
            return (
              <circle
                key={`${pillar.id}-hit`}
                className="pillar-hit"
                data-pillar={pillar.id}
                cx={x}
                cy={y}
                r={explorer ? 18 : 14}
                tabIndex={0}
                role="button"
                aria-label={label}
                onMouseEnter={() => {
                  if (explorer && window.matchMedia("(max-width: 767px)").matches) return;
                  show(index, false);
                }}
                onMouseLeave={() => setTip(null)}
                onFocus={() => show(index, explorer && window.matchMedia("(max-width: 767px)").matches)}
                onBlur={() => setTip(null)}
                onClick={() => show(index, explorer && window.matchMedia("(max-width: 767px)").matches)}
                onKeyDown={(event) => move(index, event)}
              />
            );
          })}
          {!explorer && (
            <g className="wenchi-arrow">
              <text x={LOCAL_TOWNS.Wenchi[0]} y={28} textAnchor="middle">
                Wenchi ↑
              </text>
            </g>
          )}
        </svg>
        {tip && !tip.pinned && (
          <div
            className={explorer ? "explorer-tip is-float" : "pillar-tip"}
            style={{ left: `${(tip.x / VIEW_W) * 100}%`, top: `${(tip.y / VIEW_H) * 100}%` }}
          >
            {explorer ? (
              <>
                <strong>{tip.id}</strong>
                <span>{tip.dms}</span>
                <span>
                  {tip.easting} · {tip.northing}
                </span>
              </>
            ) : (
              `${tip.id} · ${tip.dms}`
            )}
          </div>
        )}
        {explorer && tip?.pinned && (
          <div className="explorer-tip is-pinned" role="status">
            <strong>{tip.id}</strong>
            <span>{tip.dms}</span>
            <span>
              {tip.easting} · {tip.northing}
            </span>
          </div>
        )}
        {explorer && (
          <>
            <div className="explorer-north" aria-hidden="true">
              <svg viewBox="0 0 10 14">
                <path d="M5 0 10 14 5 10 0 14Z" fill="currentColor" />
              </svg>
              N
            </div>
            <div className="explorer-scale" aria-hidden="true">
              <i />
              <span>2 km</span>
            </div>
          </>
        )}
      </div>
      {!explorer && (
        <>
          <div className="scale-bar" aria-hidden="true">
            <span />
            <Caption as="span">1 km</Caption>
          </div>
          <p className="concession-area">
            <CountUp ref={area} value={41.09} decimals={2} when="manual" /> km²
          </p>
          <Caption className="is-sentence">196 blocks · 70 surveyed pillars</Caption>
        </>
      )}
    </div>
  );
});
