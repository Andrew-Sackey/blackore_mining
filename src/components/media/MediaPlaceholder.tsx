"use client";

import { useEffect, useRef } from "react";
import type { PlaceholderVariant } from "@/content/media";
import { acquireCanvas } from "@/lib/canvas-budget";
import { paintScene } from "@/components/media/scenes";

export function MediaPlaceholder({
  variant,
  shot,
  animate,
}: {
  variant: PlaceholderVariant;
  shot: string;
  animate: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = document.documentElement.classList.contains("is-reduced");

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let time = 0;
    let last = 0;
    let frame = 0;
    let running = false;
    let want = false;
    let onScreen = false;
    let release = () => {};

    const paint = () => {
      if (!ctx || width === 0) return;
      paintScene(ctx, width, height, variant, animate && !reduced ? time : 0);
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    };

    const loop = (now: number) => {
      if (!running) return;
      if (!document.hidden && now - last > 33) {
        time += (now - last) / 1000;
        last = now;
        paint();
      } else if (!document.hidden) {
        last = now;
      }
      if (!document.hidden && running) frame = window.requestAnimationFrame(loop);
      else running = false;
    };

    const stop = () => {
      want = false;
      running = false;
      window.cancelAnimationFrame(frame);
      release();
      release = () => {};
    };

    const start = () => {
      if (!animate || reduced || want) return;
      want = true;
      release = acquireCanvas(1, () => {
        if (!want) return;
        running = true;
        last = performance.now();
        frame = window.requestAnimationFrame(loop);
      });
    };

    size();

    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      sync();
    });
    observer.observe(canvas);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(size, 150);
    };
    const onVis = () => sync();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [animate, variant]);

  return (
    <div className="media-placeholder" aria-hidden="true">
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="media-chip media-placeholder-chip">Placeholder · {shot}</span>
    </div>
  );
}
