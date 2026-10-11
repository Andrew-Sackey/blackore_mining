"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TransitionLink } from "@/components/nav/TransitionLink";
import { Body } from "@/components/type/Body";
import { Eyebrow } from "@/components/type/Eyebrow";
import { reportGlance } from "@/content/concession";
import { CONCESSION_PATH, CONCESSION_VIEWBOX } from "@/content/geo/concession-boundary";
import { CONCESSION_MARKER, GHANA_OUTLINE, GHANA_VIEWBOX } from "@/content/geo/ghana-map";
import { track } from "@/lib/analytics";
import { reducedMotion } from "@/lib/motion-flags";
import coverImage from "../../../public/docs/report-cover.webp";

const LINE_WIDTHS = [100, 96, 88, 100, 72, 94, 60];

const chapters = [
  {
    pages: "p. 4–5",
    title: "Location, access and setting",
    description: "Roads, power, water, climate and vegetation around Badu.",
    link: "Location map",
    href: "/#location",
    section: "SECTION 2–5",
    pageNo: "4",
    figure: "ghana",
  },
  {
    pages: "p. 5–6",
    title: "Regional geology",
    description: "Where Badu sits among Ghana's Birimian belts.",
    link: "Regional setting",
    href: "#regional",
    section: "SECTION 6",
    pageNo: "5",
    figure: "lines",
  },
  {
    pages: "p. 7–8",
    title: "Local geology",
    description: "Rock units, structures and drainage across the tenement.",
    link: "Geology map",
    href: "#geology",
    section: "SECTION 7",
    pageNo: "7",
    figure: "geology",
  },
  {
    pages: "p. 8–9",
    title: "Prospectivity",
    description: "How the setting compares with Ghana's gold mines.",
    link: "Comparison",
    href: "#comparable",
    section: "SECTION 8",
    pageNo: "9",
    figure: "table",
  },
  {
    pages: "p. 9–10",
    title: "Exploration strategy",
    description: "Four phases, 12 to 18 months, indicative budget.",
    link: "Roadmap",
    href: "/licence#programme",
    section: "SECTION 9",
    pageNo: "9",
    figure: "steps",
  },
  {
    pages: "p. 11–12",
    title: "Boundary pillar schedule",
    description: "All 70 pillar coordinates, from the surveyed plan.",
    link: "Licence boundary",
    href: "/licence#boundary",
    section: "APPENDIX A",
    pageNo: "11",
    figure: "pillars",
  },
] as const;

type FigureKind = (typeof chapters)[number]["figure"];

function Lines({ count }: { count: number }) {
  return (
    <div className="rg-lines">
      {Array.from({ length: count }, (_, index) => (
        <i key={index} style={{ width: `${LINE_WIDTHS[index % LINE_WIDTHS.length]}%` }} />
      ))}
    </div>
  );
}

function Figure({ kind }: { kind: FigureKind }) {
  if (kind === "ghana") {
    return (
      <svg viewBox={GHANA_VIEWBOX} preserveAspectRatio="xMidYMid meet">
        <path d={GHANA_OUTLINE} fill="#DCD6CC" stroke="#6F6860" strokeWidth="2" />
        <circle cx={CONCESSION_MARKER.x} cy={CONCESSION_MARKER.y} r="14" fill="none" stroke="#C47A3D" strokeWidth="3" />
        <circle cx={CONCESSION_MARKER.x} cy={CONCESSION_MARKER.y} r="6" fill="#C47A3D" />
      </svg>
    );
  }
  if (kind === "lines") return <Lines count={9} />;
  if (kind === "geology") {
    return (
      <Image src="/docs/report-page-geology.webp" alt="" fill sizes="280px" />
    );
  }
  if (kind === "table") {
    return (
      <div className="rg-table">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className={index === 1 ? "is-badu" : undefined}>
            <i />
            <i />
            <i />
            <i />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "steps") {
    const widths = [80, 90, 70, 85];
    return (
      <div className="rg-steps">
        {widths.map((width, index) => (
          <div key={width}>
            <b>{index + 1}</b>
            <i style={{ width: `${width}%` }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <svg viewBox={CONCESSION_VIEWBOX} preserveAspectRatio="xMidYMid meet">
      <path d={CONCESSION_PATH} fill="rgba(196,122,61,.18)" stroke="#C47A3D" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

function Paper({
  section,
  title,
  pageNo,
  figure,
}: {
  section: string;
  title: string;
  pageNo: string;
  figure: FigureKind;
}) {
  return (
    <div className="rg-page">
      <div className="rg-pin">
        <div className="rg-phead">
          <span>BADU GEOLOGICAL DESKTOP STUDY REPORT</span>
          <span>September 8, 2026</span>
        </div>
        <div className="rg-pnum">{section}</div>
        <div className="rg-ptitle">{title}</div>
        <Lines count={3} />
        <div className="rg-fig">
          <Figure kind={figure} />
        </div>
        <Lines count={2} />
        <div className="rg-pfoot">
          <span>PREPARED BY BERNARD ASARE - GEOXPERT LIMITED</span>
          <span>{pageNo}</span>
        </div>
      </div>
    </div>
  );
}

export function ReportGlance() {
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(-1);
  const [active, setActive] = useState(-1);
  const api = useRef<{ hover: boolean; set: (index: number) => void }>({
    hover: false,
    set: () => {},
  });
  useTagline(reportGlance.title);

  useLayoutEffect(() => {
    const reduced = reducedMotion();
    const hoverQuery = window.matchMedia("(hover: hover)");
    const dealt = { current: reduced };
    const fanned = { current: reduced };
    const inView = { current: false };
    const started = { current: false };
    const timers: number[] = [];
    api.current.hover = hoverQuery.matches;

    const slots = () => slotRefs.current.filter((slot): slot is HTMLDivElement => Boolean(slot));

    function rest(index: number, spread: boolean) {
      const step = window.innerWidth < 600 ? 9 : 16;
      const base = -2.5 * step;
      if (!spread) return `translate3d(${base}px,0,${-index * 2}px)`;
      return `translate3d(${base + index * step}px,${-index * step * 0.45}px,${-index * 30}px) rotateZ(${index * (step / 7)}deg) rotateY(${-10 - index * 1.5}deg)`;
    }

    function breeze() {
      const stage = stageRef.current;
      if (!stage) return;
      const on = inView.current && dealt.current && activeRef.current < 0 && !reduced && !document.hidden;
      stage.classList.toggle("is-breeze", on);
    }

    function layout() {
      const list = slots();
      list.forEach((slot, index) => {
        if (reduced) {
          const show = activeRef.current < 0 ? index === 0 : index === activeRef.current + 1;
          slot.style.transform = "none";
          slot.style.filter = "none";
          slot.style.opacity = show ? "1" : "0";
          slot.style.zIndex = show ? "2" : "1";
          return;
        }
        if (!dealt.current) {
          if (!fanned.current) {
            slot.style.transform = `translate3d(${-10 + index * 4}px,-150px,${-index * 30}px) rotateZ(${-12 + index * 3}deg) rotateX(18deg)`;
            slot.style.opacity = "0";
            slot.style.zIndex = String(100 - index);
            slot.style.filter = "none";
          }
          return;
        }
        let transform = rest(index, true);
        let z = 100 - index;
        let filter = "brightness(1)";
        if (activeRef.current >= 0) {
          const lifted = activeRef.current + 1;
          if (index === lifted) {
            transform = "translate3d(-6%,-2%,140px) rotateZ(-2deg) rotateY(0deg) scale(1.02)";
            z = 200;
          } else {
            transform = `${rest(index, true)} translate3d(18px,0,-40px)`;
            filter = "brightness(.72)";
          }
        }
        slot.style.transform = transform;
        slot.style.zIndex = String(z);
        slot.style.filter = filter;
        slot.style.opacity = "1";
      });
      breeze();
    }

    function deal() {
      if (started.current) return;
      started.current = true;
      if (reduced) {
        fanned.current = true;
        dealt.current = true;
        layout();
        return;
      }
      fanned.current = true;
      const list = slots();
      const count = list.length;
      [...list].reverse().forEach((slot, order) => {
        const index = count - 1 - order;
        timers.push(
          window.setTimeout(() => {
            slot.classList.add("is-dealing");
            slot.style.opacity = "1";
            slot.style.transform = rest(index, true);
            slot.style.zIndex = String(100 - index);
            timers.push(window.setTimeout(() => slot.classList.remove("is-dealing"), 1000));
          }, order * 110),
        );
      });
      timers.push(
        window.setTimeout(() => {
          dealt.current = true;
          layout();
        }, count * 110 + 900),
      );
    }

    slots().forEach((slot, index) => {
      const page = slot.querySelector<HTMLElement>(".rg-page");
      page?.style.setProperty("--d", `${(slots().length - 1 - index) * 0.11}s`);
    });

    api.current.set = (index) => {
      activeRef.current = index;
      setActive(index);
      if (dealt.current || reduced) layout();
    };

    layout();

    const stage = stageRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        inView.current = entries[0]?.isIntersecting ?? false;
        if (inView.current && !fanned.current) deal();
        else breeze();
      },
      { threshold: 0.35 },
    );
    if (stage) observer.observe(stage);

    const onResize = () => {
      if (dealt.current || !fanned.current) layout();
    };
    const onHide = () => breeze();
    const onHover = () => {
      api.current.hover = hoverQuery.matches;
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onHide);
    hoverQuery.addEventListener("change", onHover);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onHide);
      hoverQuery.removeEventListener("change", onHover);
    };
  }, []);

  return (
    <Section id="desktop-study" tone="ink" space="lg">
      <Container>
        <div className="rg-wrap">
          <div>
            <Eyebrow>{reportGlance.eyebrow}</Eyebrow>
            <SplitHeading>{reportGlance.title}</SplitHeading>
            <p className="rg-facts">
              <b>{reportGlance.preparedBy}</b>
              {reportGlance.facts.map((fact) => (
                <span key={fact}>{fact}</span>
              ))}
            </p>
            <dl className="rg-summary">
              {reportGlance.summary.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>
                    <Body>{row.text}</Body>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="rg-inside">
              <h3>{reportGlance.inside}</h3>
              <ul
                className="rg-toc"
                onMouseLeave={() => {
                  if (api.current.hover) api.current.set(-1);
                }}
              >
                {chapters.map((chapter, index) => (
                  <li
                    key={chapter.href}
                    className={active === index ? "is-on" : undefined}
                    onMouseEnter={() => {
                      if (api.current.hover) api.current.set(index);
                    }}
                    onFocus={() => api.current.set(index)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) api.current.set(-1);
                    }}
                  >
                    <button
                      type="button"
                      aria-pressed={active === index}
                      onClick={() => {
                        if (!api.current.hover && active === index) api.current.set(-1);
                        else api.current.set(index);
                      }}
                    >
                      <span className="rg-pg">{chapter.pages}</span>
                      <span className="rg-t">
                        {chapter.title}
                        <small>{chapter.description}</small>
                      </span>
                    </button>
                    <TransitionLink
                      href={chapter.href}
                      className="rg-go"
                      onClick={() => track("report_chapter_open", { chapter: chapter.title })}
                    >
                      {chapter.link} <span>→</span>
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rg-cta">
              <TransitionLink href={reportGlance.requestHref} className="btn" data-cta={reportGlance.request}>
                {reportGlance.request}
              </TransitionLink>
              <span className="rg-note">{reportGlance.note}</span>
            </div>
          </div>
          <div className="rg-obj">
            <div ref={stageRef} className="rg-stage" aria-hidden="true">
              <div
                className="rg-slot"
                ref={(node) => {
                  slotRefs.current[0] = node;
                }}
              >
                <div className="rg-page rg-cover">
                  <Image src={coverImage} alt="" fill sizes="330px" priority />
                </div>
              </div>
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.href}
                  className="rg-slot"
                  ref={(node) => {
                    slotRefs.current[index + 1] = node;
                  }}
                >
                  <Paper section={chapter.section} title={chapter.title} pageNo={chapter.pageNo} figure={chapter.figure} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
