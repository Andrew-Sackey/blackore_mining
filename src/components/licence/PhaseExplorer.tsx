"use client";

import { useEffect, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Caption } from "@/components/type/Caption";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";
import { Subheading } from "@/components/type/Subheading";
import { licenceProgramme } from "@/content/licence";
import { CONCESSION_PATH } from "@/content/geo/concession-boundary";
import { ScrollTrigger } from "@/lib/gsap";

export function PhaseExplorer() {
  const [index, setIndex] = useState(0);
  const [Art, setArt] = useState<ComponentType<{ phase: number }> | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const slot = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const phase = licenceProgramme.phases[index];
  useTagline(licenceProgramme.title);

  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    let alive = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        import("./PhaseArt").then((mod) => {
          if (!alive) return;
          setArt(() => mod.PhaseArt);
          window.requestAnimationFrame(() => ScrollTrigger.refresh());
        });
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  function select(next: number, focus = false) {
    const count = licenceProgramme.phases.length;
    const wrapped = (next + count) % count;
    setIndex(wrapped);
    if (focus) tabs.current[wrapped]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      select(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      select(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(licenceProgramme.phases.length - 1, true);
    }
  }

  return (
    <Section tone="ink" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{licenceProgramme.eyebrow}</Eyebrow>
          <SplitHeading>{licenceProgramme.title}</SplitHeading>
          <Lede>{licenceProgramme.lede}</Lede>
        </div>
        <div className="phase-layout">
          <div
            className="phase-tabs"
            role="tablist"
            aria-label="Exploration phases"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
          >
            {licenceProgramme.phases.map((item, itemIndex) => (
              <button
                key={item.number}
                ref={(node) => {
                  tabs.current[itemIndex] = node;
                }}
                type="button"
                role="tab"
                id={`phase-tab-${item.number}`}
                aria-controls="phase-panel"
                aria-selected={itemIndex === index}
                tabIndex={itemIndex === index ? 0 : -1}
                className="phase-tab"
                onClick={() => setIndex(itemIndex)}
              >
                <span className="phase-tab-num">{item.number}</span>
                <span className="phase-tab-title">{item.title}</span>
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id="phase-panel"
            aria-labelledby={`phase-tab-${phase.number}`}
            className="phase-panel"
            onPointerDown={(event) => {
              swipe.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={(event) => {
              const start = swipe.current;
              swipe.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
              setIndex((current) => {
                const count = licenceProgramme.phases.length;
                return dx < 0 ? Math.min(count - 1, current + 1) : Math.max(0, current - 1);
              });
            }}
          >
            <figure className="phase-figure">
              <div ref={slot} className="phase-art-slot">
                {Art ? (
                  <Art phase={phase.number} />
                ) : (
                  <svg
                    className="phase-art"
                    viewBox="0 0 1000 844"
                    role="img"
                    aria-label={`Illustration of ${phase.title.toLowerCase()} on the concession boundary. Not actual data.`}
                  >
                    <path className="phase-boundary" d={CONCESSION_PATH} />
                  </svg>
                )}
              </div>
              <Caption as="figcaption" className="is-sentence phase-note">
                {licenceProgramme.illustrative}
              </Caption>
            </figure>
            {licenceProgramme.phases.map((item) => (
              <div key={item.number} className="phase-copy" data-active={item.number === phase.number ? "true" : "false"}>
                <p className="phase-kicker">{String(item.number).padStart(2, "0")}</p>
                <Subheading>{item.title}</Subheading>
                <Lede>
                  <Copy value={item.objective} />
                </Lede>
                <ul className="phase-activities">
                  {item.activities.map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
                <p className="phase-moves-label">{licenceProgramme.movesLabel}</p>
                <p className="phase-moves">
                  <Copy value={item.movesOn} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
