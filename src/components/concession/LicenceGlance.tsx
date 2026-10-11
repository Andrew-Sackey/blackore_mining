"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { ConcessionOutline } from "@/components/home/ConcessionOutline";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Caption } from "@/components/type/Caption";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { licenceGlance, licenceRows, surveyCaption } from "@/content/concession";
import { PILLARS } from "@/content/geo/concession-boundary";
import { SHOW_PILLAR_DOWNLOAD, SHOW_SURVEY_PLAN } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { dur, ease, rise, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";

function SurveyPlan() {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  useEffect(() => {
    const node = stage.current;
    const box = dialog.current;
    if (!node || !box) return;
    const onWheel = (event: WheelEvent) => {
      if (!box.open) return;
      event.preventDefault();
      setScale((value) => Math.min(4, Math.max(1, value * (event.deltaY < 0 ? 1.08 : 0.92))));
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  function open() {
    setScale(1);
    dialog.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    dialog.current?.close();
    document.documentElement.style.overflow = "";
    setScale(1);
    pinch.current = null;
    pointers.current.clear();
  }

  function pointerDistance() {
    const points = [...pointers.current.values()];
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }

  return (
    <figure className="survey-figure">
      <button type="button" className="survey-frame" onClick={open}>
        <Image
          src="/docs/survey-plan.webp"
          alt="Stand-in for the surveyed plan of the concession, FS 0703B4. The sealed survey drawing is not published yet."
          width={1600}
          height={1100}
        />
      </button>
      <Caption as="figcaption" className="is-sentence">
        {surveyCaption}
      </Caption>
      <dialog ref={dialog} className="survey-lightbox" onClose={close} aria-label={surveyCaption}>
        <button type="button" className="survey-close" onClick={close}>
          Close
        </button>
        <div
          ref={stage}
          className="survey-stage"
          onPointerDown={(event) => {
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            if (pointers.current.size === 2) pinch.current = { distance: pointerDistance(), scale };
          }}
          onPointerMove={(event) => {
            if (!pointers.current.has(event.pointerId) || !pinch.current) return;
            pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
            const distance = pointerDistance();
            if (!distance || !pinch.current.distance) return;
            setScale(Math.min(4, Math.max(1, pinch.current.scale * (distance / pinch.current.distance))));
          }}
          onPointerUp={(event) => {
            pointers.current.delete(event.pointerId);
            if (pointers.current.size < 2) pinch.current = null;
          }}
        >
          <Image src="/docs/survey-plan.webp" alt="" width={1600} height={1100} style={{ transform: `scale(${scale})` }} />
        </div>
      </dialog>
    </figure>
  );
}

function downloadPillars() {
  const header = "id,lat,lon,dms,easting,northing";
  const lines = PILLARS.map((pillar) =>
    [pillar.id, pillar.lat, pillar.lon, `"${pillar.dms}"`, pillar.e, pillar.n].join(","),
  );
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "badu-pillar-coordinates.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function LicenceGlance() {
  const sheet = useRef<HTMLDListElement>(null);
  useTagline(licenceGlance.title);

  useGSAP(
    () => {
      const root = sheet.current;
      if (!root || reducedMotion()) return;
      gsap.fromTo(
        root.querySelectorAll(".data-row"),
        { opacity: 0, y: rise.sm },
        {
          opacity: 1,
          y: 0,
          duration: dur.base,
          stagger: stagger.tight,
          ease: ease.out,
          scrollTrigger: { trigger: root, start: trigger.start, once: true },
        },
      );
    },
    { scope: sheet },
  );

  return (
    <Section id="boundary" tone="ink" space="lg">
      <Container>
        <div className="section-intro">
          <Eyebrow>{licenceGlance.eyebrow}</Eyebrow>
          <SplitHeading>{licenceGlance.title}</SplitHeading>
        </div>
        <div className="licence-grid">
          <dl ref={sheet} className="data-sheet">
            {licenceRows.map((row) => (
              <div className="data-row" key={row.label}>
                <dt className="type-caption is-sentence">{row.label}</dt>
                <dd className="data-value">
                  {row.parts.map((part, index) => (
                    <Copy key={index} value={part} />
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <div>
            <ConcessionOutline presentation="explorer" />
            {SHOW_PILLAR_DOWNLOAD && (
              <button type="button" className="text-link pillar-download" onClick={downloadPillars}>
                Download pillar coordinates (CSV)
              </button>
            )}
          </div>
        </div>
        {SHOW_SURVEY_PLAN && <SurveyPlan />}
      </Container>
    </Section>
  );
}
