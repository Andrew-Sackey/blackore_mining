"use client";

import { useId, useRef } from "react";
import {
  CONCESSION_MARKER,
  GHANA_OUTLINE,
  GHANA_VIEWBOX,
  NEIGHBOURS,
  ROUTE_ACCRA_BADU,
  ROUTE_SUNYANI,
  TOWNS,
} from "@/content/geo/ghana-map";
import { ConcessionOutline, type ConcessionOutlineHandle } from "@/components/home/ConcessionOutline";
import { Caption } from "@/components/type/Caption";
import { dur, ease, mapMotion } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";

const TOWN_ORDER = ["Accra", "Kumasi", "Techiman", "Sunyani", "Wenchi"] as const;

const labelOffset: Record<(typeof TOWN_ORDER)[number], { dx: number; dy: number; anchor: "start" | "end" }> = {
  Accra: { dx: -22, dy: -6, anchor: "end" },
  Kumasi: { dx: 8, dy: 4, anchor: "start" },
  Techiman: { dx: 8, dy: -8, anchor: "start" },
  Sunyani: { dx: -8, dy: 14, anchor: "end" },
  Wenchi: { dx: -8, dy: -12, anchor: "end" },
};

function asPath(node: Element | null) {
  return node instanceof SVGPathElement ? node : null;
}

export function LocationMap() {
  const rootRef = useRef<HTMLDivElement>(null);
  const insetRef = useRef<ConcessionOutlineHandle>(null);
  const uid = useId().replace(/:/g, "");
  const routeMaskId = `${uid}-route`;
  const linkMaskId = `${uid}-link`;
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion()) return;
      const svg = root.querySelector(".ghana-svg");
      if (!(svg instanceof SVGSVGElement)) return;

      const fit = () => {
        const width = svg.getBoundingClientRect().width || 582;
        const radius = (3 * 582) / width;
        root.querySelectorAll(".map-town-dot, .map-marker-dot, .map-pulse").forEach((node) => {
          node.setAttribute("r", radius.toFixed(3));
        });
        const traveler = root.querySelector(".map-traveler");
        traveler?.setAttribute("r", ((4.5 * 582) / width).toFixed(3));
      };
      fit();

      const outline = asPath(root.querySelector(".map-outline"));
      const routeMask = asPath(root.querySelector(".map-route-mask"));
      const linkMask = asPath(root.querySelector(".map-link-mask"));
      const route = asPath(root.querySelector(".map-route"));
      const leader = asPath(root.querySelector(".map-leader-path"));

      const hideStroke = (path: SVGPathElement | null) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      };
      hideStroke(outline);
      hideStroke(routeMask);
      hideStroke(linkMask);
      hideStroke(leader);

      if (route) {
        const mid = route.getPointAtLength(route.getTotalLength() * 0.38);
        root.querySelector(".map-distance-main")?.setAttribute("x", String(mid.x + 10));
        root.querySelector(".map-distance-main")?.setAttribute("y", String(mid.y - 12));
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: mapMotion.start,
          once: true,
        },
      });

      tl.fromTo(".map-neighbours", { opacity: 0 }, { opacity: 1, duration: dur.slow, ease: ease.out }, 0);
      if (outline) {
        tl.to(outline, { strokeDashoffset: 0, duration: dur.cinematic, ease: ease.inOut }, mapMotion.outlineAt);
      }
      tl.fromTo(".map-fill", { opacity: 0 }, { opacity: 1, duration: dur.slow, ease: ease.out }, mapMotion.outlineAt);
      tl.fromTo(
        ".map-town-dot",
        { scale: 0 },
        { scale: 1, duration: dur.fast, ease: ease.out, stagger: mapMotion.townStagger },
        mapMotion.townsAt,
      );
      tl.fromTo(
        ".map-label",
        { opacity: 0 },
        { opacity: 1, duration: dur.fast, ease: ease.out, stagger: mapMotion.townStagger },
        mapMotion.townsAt,
      );

      if (routeMask) {
        tl.to(routeMask, { strokeDashoffset: 0, duration: mapMotion.routeDur, ease: ease.inOut }, mapMotion.routeAt);
      }
      const traveler = root.querySelector(".map-traveler");
      if (route && traveler) {
        gsap.set(traveler, { attr: { cx: 0, cy: 0 } });
        tl.fromTo(traveler, { opacity: 0 }, { opacity: 1, duration: dur.fast, ease: ease.out }, mapMotion.routeAt);
        tl.to(
          traveler,
          {
            duration: mapMotion.routeDur,
            ease: ease.inOut,
            motionPath: {
              path: route,
              align: route,
              alignOrigin: [0.5, 0.5],
            },
          },
          mapMotion.routeAt,
        );
      }
      tl.fromTo(
        ".map-distance-main",
        { opacity: 0 },
        { opacity: 1, duration: dur.fast, ease: ease.out },
        mapMotion.routeAt + dur.fast,
      );

      if (linkMask) {
        tl.to(linkMask, { strokeDashoffset: 0, duration: mapMotion.linkDur, ease: ease.inOut }, mapMotion.linkAt);
      }
      tl.fromTo(
        ".map-distance-link",
        { opacity: 0 },
        { opacity: 1, duration: dur.fast, ease: ease.out },
        mapMotion.linkAt,
      );

      tl.fromTo(
        ".map-pulse",
        { scale: 1, opacity: 0.8 },
        { scale: 6, opacity: 0, duration: dur.fast, ease: ease.out, repeat: 1 },
        mapMotion.markerAt,
      );
      tl.fromTo(
        ".map-marker-label",
        { opacity: 0 },
        { opacity: 1, duration: dur.fast, ease: ease.out },
        mapMotion.markerAt,
      );
      tl.add(() => insetRef.current?.play(), mapMotion.insetAt);
      if (leader) {
        tl.to(leader, { strokeDashoffset: 0, duration: dur.base, ease: ease.inOut }, mapMotion.insetAt);
      }

      const onResize = () => fit();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: rootRef },
  );

  return (
    <div className="location-map" ref={rootRef}>
      <div className="location-stage">
        <svg className="ghana-svg" viewBox={GHANA_VIEWBOX} role="img" aria-labelledby={`${uid}-title`}>
          <title id={`${uid}-title`}>Map of Ghana showing the route from Accra to Badu, about 340 km, and the concession near Wenchi.</title>
          <defs>
            <mask id={routeMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <path className="map-route-mask" d={ROUTE_ACCRA_BADU} />
            </mask>
            <mask id={linkMaskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
              <path className="map-link-mask" d={ROUTE_SUNYANI} />
            </mask>
          </defs>
          <g className="map-neighbours">
            {Object.entries(NEIGHBOURS).map(([name, d]) => (
              <path key={name} d={d} />
            ))}
          </g>
          <path className="map-fill" d={GHANA_OUTLINE} />
          <path className="map-outline" d={GHANA_OUTLINE} />
          <path className="map-route" d={ROUTE_ACCRA_BADU} mask={`url(#${routeMaskId})`} />
          <path className="map-link" d={ROUTE_SUNYANI} mask={`url(#${linkMaskId})`} />
          {TOWN_ORDER.map((name) => {
            const town = TOWNS.find((item) => item.name === name)!;
            const place = labelOffset[name];
            return (
              <g key={town.name}>
                <circle className="map-town-dot" cx={town.x} cy={town.y} r="3" />
                <text
                  className="map-label"
                  x={town.x + place.dx}
                  y={town.y + place.dy}
                  textAnchor={place.anchor}
                >
                  {town.name}
                </text>
              </g>
            );
          })}
          <text className="map-distance map-distance-main" x="248" y="560">
            ≈ 340 km
          </text>
          <text className="map-distance map-distance-link" x="18" y="448" textAnchor="start">
            ≈ 70 km
          </text>
          <g className="map-marker" transform={`translate(${CONCESSION_MARKER.x} ${CONCESSION_MARKER.y})`}>
            <circle className="map-pulse" r="3" />
            <circle className="map-marker-dot" r="3" />
          </g>
          <text className="map-marker-label" x={CONCESSION_MARKER.x + 14} y={CONCESSION_MARKER.y + 16} textAnchor="start">
            Badu concession
          </text>
          <circle className="map-traveler" r="4" cx="145.1" cy="427" />
          <g className="map-north" transform="translate(540 28)" aria-hidden="true">
            <path d="M0 18 V1" />
            <path d="M-4.5 7 L0 1 L4.5 7" />
            <text y="30" textAnchor="middle">
              N
            </text>
          </g>
        </svg>
        <svg className="map-leader" viewBox={GHANA_VIEWBOX} aria-hidden="true">
          <path className="map-leader-path" d={`M${CONCESSION_MARKER.x} ${CONCESSION_MARKER.y} C 230 500, 340 590, 400 660`} />
        </svg>
        <ConcessionOutline ref={insetRef} />
      </div>
      <Caption className="is-sentence map-note">Schematic route. Town positions approximate.</Caption>
    </div>
  );
}
