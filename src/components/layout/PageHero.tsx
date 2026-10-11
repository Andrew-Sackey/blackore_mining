"use client";

import { useRef } from "react";
import type { MediaId } from "@/content/media";
import { copyText, isPlaceholder, type CopyValue } from "@/content/placeholder";
import { Copy } from "@/components/content/Copy";
import { useTagline } from "@/components/content/TaglineWatch";
import { Container } from "@/components/layout/Container";
import { ContourField } from "@/components/intro/ContourField";
import { Media } from "@/components/media/Media";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { dur, ease, scale, stagger, trigger } from "@/lib/motion";
import { reducedMotion } from "@/lib/motion-flags";
import { gsap, useGSAP } from "@/lib/gsap";
import { Eyebrow } from "@/components/type/Eyebrow";
import { Lede } from "@/components/type/Lede";

export function PageHero({
  eyebrow,
  title,
  lede,
  mediaId,
  survey = false,
  drawIn = false,
}: {
  eyebrow: string;
  title: CopyValue;
  lede?: CopyValue;
  mediaId?: MediaId;
  /** Pointer-led drift and a survey reticle. Used on the About hero. */
  survey?: boolean;
  /** Slow zoom into the picture. Used on the Contact hero. */
  drawIn?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const titleText = copyText(title);
  useTagline(titleText);

  useGSAP(
    () => {
      const media = ref.current?.querySelector("[data-hero-media]");
      if (!media || reducedMotion()) return;
      if (drawIn) {
        const frame = media.querySelector("[data-draw-frame]");
        if (!frame) return;
        gsap.fromTo(
          frame,
          { scale: 1, transformOrigin: "50% 42%" },
          { scale: 1.18, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 },
        );
        return;
      }
      gsap.fromTo(
        media,
        { scale: scale.enter },
        {
          scale: 1,
          duration: dur.cinematic,
          ease: ease.out,
          scrollTrigger: {
            trigger: media,
            start: trigger.start,
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !survey || reducedMotion()) return;
      const frame = root.querySelector<HTMLElement>("[data-survey-frame]");
      const reticle = root.querySelector<HTMLElement>("[data-survey-reticle]");
      const copy = root.querySelector<HTMLElement>("[data-survey-copy]");
      if (!frame) return;

      const motion = gsap.matchMedia();
      motion.add(
        {
          isFine: "(hover: hover) and (pointer: fine)",
          isTouch: "(hover: none), (pointer: coarse)",
        },
        (context) => {
          if (!context.conditions?.isFine) {
            gsap.fromTo(
              frame,
              { x: -18 },
              { x: 18, duration: 16, ease: "sine.inOut", yoyo: true, repeat: -1 },
            );
            return;
          }
          const frameX = gsap.quickTo(frame, "x", { duration: 1.15, ease: "power3.out" });
          const frameY = gsap.quickTo(frame, "y", { duration: 1.15, ease: "power3.out" });
          const copyX = copy ? gsap.quickTo(copy, "x", { duration: 1.4, ease: "power3.out" }) : null;
          const copyY = copy ? gsap.quickTo(copy, "y", { duration: 1.4, ease: "power3.out" }) : null;
          const reticleX = reticle ? gsap.quickTo(reticle, "x", { duration: 0.45, ease: "power3.out" }) : null;
          const reticleY = reticle ? gsap.quickTo(reticle, "y", { duration: 0.45, ease: "power3.out" }) : null;
          const mark = reticle?.querySelector("svg");
          if (reticle) gsap.set(reticle, { autoAlpha: 0 });
          if (mark) gsap.to(mark, { rotation: 360, duration: 28, repeat: -1, ease: "none" });

          const onMove = (event: PointerEvent) => {
            const bounds = root.getBoundingClientRect();
            const px = (event.clientX - bounds.left) / bounds.width - 0.5;
            const py = (event.clientY - bounds.top) / bounds.height - 0.5;
            frameX(px * -48);
            frameY(py * -28);
            copyX?.(px * 14);
            copyY?.(py * 8);
            reticleX?.(event.clientX - bounds.left);
            reticleY?.(event.clientY - bounds.top);
          };
          const onEnter = () => {
            if (reticle) gsap.to(reticle, { autoAlpha: 1, duration: 0.35 });
          };
          const onLeave = () => {
            frameX(0);
            frameY(0);
            copyX?.(0);
            copyY?.(0);
            if (reticle) gsap.to(reticle, { autoAlpha: 0, duration: 0.35 });
          };
          root.addEventListener("pointermove", onMove);
          root.addEventListener("pointerenter", onEnter);
          root.addEventListener("pointerleave", onLeave);
          return () => {
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerenter", onEnter);
            root.removeEventListener("pointerleave", onLeave);
          };
        },
      );
      return () => motion.revert();
    },
    { scope: ref, dependencies: [survey] },
  );

  return (
    <section
      ref={ref}
      className={mediaId ? (survey ? "page-hero page-hero-survey" : "page-hero") : "page-hero page-hero-plain"}
      aria-label={titleText}
    >
      {mediaId ? (
        <div className="page-hero-media" data-hero-media>
          {survey || drawIn ? (
            <div className="page-hero-drift" data-survey-frame={survey ? "" : undefined} data-draw-frame={drawIn ? "" : undefined}>
              <Media id={mediaId} sizes="100vw" />
            </div>
          ) : (
            <Media id={mediaId} sizes="100vw" />
          )}
        </div>
      ) : (
        <ContourField className="page-hero-contours" />
      )}
      {mediaId ? <div className="hero-shade" /> : null}
      {survey ? (
        <div className="survey-reticle" data-survey-reticle aria-hidden="true">
          <svg viewBox="0 0 80 80" width="80" height="80">
            <circle cx="40" cy="40" r="27" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="40" cy="40" r="2.2" fill="currentColor" />
            <path d="M40 8v10M40 62v10M8 40h10M62 40h10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      ) : null}
      <Container>
        <div className="page-hero-copy" data-survey-copy={survey ? "" : undefined}>
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <SplitHeading
            as="h1"
            className="type-display page-hero-title"
            note={isPlaceholder(title) ? (title.note ?? "Placeholder") : undefined}
          >
            {titleText}
          </SplitHeading>
          {lede ? (
            <Reveal delay={stagger.base}>
              <Lede>
                <Copy value={lede} />
              </Lede>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
