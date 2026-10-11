"use client";

import { useEffect, useRef, type RefObject } from "react";
import { n2 } from "@/lib/noise";

function drawContours(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const step = width < 600 ? 10 : 12;
  const cols = Math.ceil(width / step) + 1;
  const rows = Math.ceil(height / step) + 1;
  const scale = 1 / (Math.max(width, height) * 0.42);
  const field = new Float32Array(cols * rows);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const sx = x * step * scale;
      const sy = y * step * scale;
      field[y * cols + x] = n2(sx, sy) * 0.75 + n2(sx * 2.3 + 9, sy * 2.3) * 0.25;
    }
  }

  context.lineWidth = 1;
  context.lineCap = "round";

  for (let level = -6; level <= 6; level++) {
    const value = level * 0.075;
    context.strokeStyle = level === 0 ? "rgba(196,122,61,.55)" : "rgba(245,245,247,.5)";
    context.beginPath();

    for (let y = 0; y < rows - 1; y++) {
      for (let x = 0; x < cols - 1; x++) {
        const a = field[y * cols + x];
        const b = field[y * cols + x + 1];
        const d = field[(y + 1) * cols + x];
        const e = field[(y + 1) * cols + x + 1];
        const index = (a > value ? 1 : 0) | ((b > value ? 1 : 0) << 1) | ((e > value ? 1 : 0) << 2) | ((d > value ? 1 : 0) << 3);
        if (index === 0 || index === 15) continue;

        const originX = x * step;
        const originY = y * step;
        const mix = (p: number, q: number) => (value - p) / (q - p);
        const top: [number, number] = [originX + mix(a, b) * step, originY];
        const right: [number, number] = [originX + step, originY + mix(b, e) * step];
        const bottom: [number, number] = [originX + mix(d, e) * step, originY + step];
        const left: [number, number] = [originX, originY + mix(a, d) * step];
        const segments: Record<number, [number, number][]> = {
          1: [left, top],
          2: [top, right],
          3: [left, right],
          4: [right, bottom],
          5: [left, top, right, bottom],
          6: [top, bottom],
          7: [left, bottom],
          8: [left, bottom],
          9: [top, bottom],
          10: [top, right, left, bottom],
          11: [right, bottom],
          12: [left, right],
          13: [top, right],
          14: [left, top],
        };
        const points = segments[index];
        for (let s = 0; s < points.length; s += 2) {
          context.moveTo(points[s][0], points[s][1]);
          context.lineTo(points[s + 1][0], points[s + 1][1]);
        }
      }
    }
    context.stroke();
  }
}

export function ContourField({
  canvasRef,
  className = "intro-contours",
}: {
  canvasRef?: RefObject<HTMLCanvasElement | null>;
  className?: string;
}) {
  const ownRef = useRef<HTMLCanvasElement>(null);
  const ref = canvasRef ?? ownRef;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => drawContours(canvas);
    draw();
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(draw, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [ref]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
