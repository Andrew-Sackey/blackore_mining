"use client";

import type { ReactNode } from "react";
import { HeroMedia, type VideoSource } from "@/components/hero/HeroMedia";
import { useIntro } from "@/components/intro/IntroContext";
import { useTagline } from "@/components/content/TaglineWatch";
import { home } from "@/content/home";
import { TransitionLink } from "@/components/nav/TransitionLink";

type HeroProps = {
  srcMobile?: VideoSource;
  srcDesktop?: VideoSource;
  poster?: string;
  children?: ReactNode;
};

function StatNumber({ value, decimals = 0 }: { value: string; decimals?: number }) {
  return (
    <span className="count">
      <span data-count={value} data-dec={decimals}>
        {value}
      </span>
      <span className="count-sizer" aria-hidden="true">
        {value}
      </span>
    </span>
  );
}

export function Hero({ srcMobile, srcDesktop, poster, children }: HeroProps) {
  const { posterFallback } = useIntro();
  useTagline(home.title);
  const waitingOnFootage = !srcMobile && !srcDesktop;
  const chip = posterFallback
    ? "Poster frame · video still loading"
    : waitingOnFootage
      ? "Placeholder · drone landscape video"
      : null;

  return (
    <main id="top">
      <section className="hero" aria-label="Introduction">
        <HeroMedia srcMobile={srcMobile} srcDesktop={srcDesktop} poster={poster} />
        <div className="hero-shade" />
        {chip ? <span className="media-chip">{chip}</span> : null}
        <div className="hero-inner">
          <div>
            <p className="eyebrow" data-hero>
              {home.eyebrow}
            </p>
            <h1 aria-label={home.title}>
              <span className="line">
                <span data-line>{home.titleLead}</span>
              </span>
              <span className="line">
                <span data-line className="dim">
                  {home.titleTail}
                </span>
              </span>
            </h1>
            <p className="lede" data-hero>
              {home.lede}
            </p>
            <div className="ctas" data-hero>
              <TransitionLink className="btn" href={home.ctaPrimaryHref}>
                {home.ctaPrimary}
              </TransitionLink>
              <TransitionLink className="text-link" href={home.ctaSecondaryHref} data-cta={home.ctaSecondary}>
                {home.ctaSecondary} <span aria-hidden="true">→</span>
              </TransitionLink>
            </div>
          </div>
          <ul className="stats" aria-label="Concession at a glance">
            <li data-stat>
              <b>
                <StatNumber value={home.stats[0].value} decimals={home.stats[0].decimals} />
                <small>km²</small>
              </b>
              <span>{home.stats[0].label}</span>
            </li>
            <li data-stat>
              <b>
                <StatNumber value={home.stats[1].value} />
              </b>
              <span>{home.stats[1].label}</span>
            </li>
            <li data-stat>
              <b>
                <StatNumber value={home.stats[2].value} />
              </b>
              <span>{home.stats[2].label}</span>
            </li>
          </ul>
        </div>
      </section>
      {children}
    </main>
  );
}
