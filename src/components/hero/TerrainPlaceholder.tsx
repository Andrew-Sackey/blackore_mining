"use client";

import { useEffect, useRef } from "react";
import { acquireCanvas } from "@/lib/canvas-budget";
import { n2 } from "@/lib/noise";

type Ridge = {
  base: number;
  amp: number;
  freq: number;
  speed: number;
  seed: number;
  col: string;
};

export function TerrainPlaceholder({ animate }: { animate: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animateRef = useRef(animate);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ctx: CanvasRenderingContext2D | null = null;
    let width = 0;
    let height = 0;
    let ridges: Ridge[] = [];
    let time = 0;
    let last = 0;
    let running = false;
    let frame = 0;
    let release = () => {};
    let holding = false;

    const paint = () => {
      if (!ctx) return;
      const sky = ctx.createLinearGradient(0, 0, 0, height * 0.75);
      sky.addColorStop(0, "#08070A");
      sky.addColorStop(0.55, "#1A120D");
      sky.addColorStop(1, "#3B2414");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const sx = width * 0.72;
      const sy = height * 0.56;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, Math.max(width, height) * 0.55);
      glow.addColorStop(0, "rgba(227,165,108,.42)");
      glow.addColorStop(0.25, "rgba(196,122,61,.16)");
      glow.addColorStop(1, "rgba(196,122,61,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ridges.forEach((ridge, index) => {
        ctx!.beginPath();
        ctx!.moveTo(0, height);
        const offset = time * ridge.speed;
        for (let x = 0; x <= width + 8; x += 8) {
          const u = (x + offset) / width;
          const y =
            height *
            (ridge.base -
              ridge.amp * (n2(u * ridge.freq + ridge.seed, ridge.seed) * 1.6 + n2(u * ridge.freq * 3.1, ridge.seed + 5) * 0.45));
          ctx!.lineTo(x, y);
        }
        ctx!.lineTo(width, height);
        ctx!.closePath();
        ctx!.fillStyle = ridge.col;
        ctx!.fill();
        if (index < 3) {
          ctx!.fillStyle = `rgba(227,165,108,${0.05 - index * 0.012})`;
          ctx!.fillRect(0, height * (ridge.base - 0.06), width, height * 0.08);
        }
      });
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
      ridges = [0, 1, 2, 3, 4].map((i) => ({
        base: 0.52 + i * 0.085,
        amp: 0.05 + i * 0.018,
        freq: 1.4 + i * 0.55,
        speed: 4 + i * 7,
        seed: i * 31.7,
        col: ["#2A1D14", "#1E160F", "#15100C", "#0D0A08", "#070605"][i],
      }));
      paint();
    };

    const loop = (now: number) => {
      if (!running) return;
      if (!document.hidden && animateRef.current && !reduced && now - last > 33) {
        time += (now - last) / 1000;
        last = now;
        paint();
      } else if (!document.hidden) {
        last = now;
      }
      if (!document.hidden) frame = window.requestAnimationFrame(loop);
      else running = false;
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
      release();
      release = () => {};
      holding = false;
    };

    const start = () => {
      if (holding || reduced) return;
      holding = true;
      release = acquireCanvas(2, () => {
        if (!holding) return;
        running = true;
        last = performance.now();
        frame = window.requestAnimationFrame(loop);
      });
    };

    size();
    let onScreen = false;
    const rect = canvas.getBoundingClientRect();
    onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      if (onScreen && !document.hidden) start();
      else stop();
    });
    observer.observe(canvas);
    if (onScreen && !document.hidden) start();

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(size, 150);
    };
    const onVis = () => {
      if (document.hidden || !onScreen) stop();
      else start();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="terrain" aria-hidden="true" />;
}
