import { n2 } from "@/lib/noise";
import type { PlaceholderVariant } from "@/content/media";

type Ctx = CanvasRenderingContext2D;

function ridgeLine(
  ctx: Ctx,
  width: number,
  height: number,
  base: number,
  amp: number,
  freq: number,
  seed: number,
  drift: number,
  color: string,
) {
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width + 8; x += 8) {
    const u = x / width;
    const y =
      height *
      (base -
        amp *
          (n2(u * freq + seed + drift, seed) * 1.5 + n2(u * freq * 2.7, seed + 4) * 0.4));
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function paintDawn(ctx: Ctx, width: number, height: number, time: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#140E0C");
  sky.addColorStop(0.42, "#3A2416");
  sky.addColorStop(0.72, "#C47A3D");
  sky.addColorStop(1, "#E7B07A");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.62, height * 0.7, 0, width * 0.62, height * 0.7, width * 0.45);
  glow.addColorStop(0, "rgba(255, 214, 170, 0.9)");
  glow.addColorStop(0.2, "rgba(227, 165, 108, 0.45)");
  glow.addColorStop(1, "rgba(227, 165, 108, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  const cols = ["#6A3A22", "#4A2818", "#2C1810", "#1A0E0A", "#0C0706"];
  cols.forEach((color, i) => {
    ridgeLine(ctx, width, height, 0.62 + i * 0.07, 0.045 + i * 0.012, 1.3 + i * 0.35, i * 2.2, time * (0.03 + i * 0.01), color);
  });
}

function paintRidge(ctx: Ctx, width: number, height: number, time: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#12181E");
  sky.addColorStop(0.45, "#243038");
  sky.addColorStop(1, "#8EA0AA");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const light = ctx.createRadialGradient(width * 0.3, height * 0.28, 0, width * 0.3, height * 0.28, width * 0.4);
  light.addColorStop(0, "rgba(210, 224, 230, 0.35)");
  light.addColorStop(1, "rgba(210, 224, 230, 0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, width, height);

  const cols = ["#5E7380", "#445560", "#2C3A44", "#1A242C", "#10161C"];
  cols.forEach((color, i) => {
    ridgeLine(ctx, width, height, 0.38 + i * 0.1, 0.06 + i * 0.02, 1.1 + i * 0.4, 8 + i * 3, time * (0.02 + i * 0.008), color);
  });
}

function paintSavanna(ctx: Ctx, width: number, height: number, time: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.78);
  sky.addColorStop(0, "#1A120E");
  sky.addColorStop(0.55, "#8A4E2A");
  sky.addColorStop(1, "#F0C48A");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const sunY = height * 0.74;
  const sun = ctx.createRadialGradient(width * 0.5, sunY, 0, width * 0.5, sunY, width * 0.18);
  sun.addColorStop(0, "rgba(255, 236, 200, 0.95)");
  sun.addColorStop(0.4, "rgba(255, 196, 120, 0.35)");
  sun.addColorStop(1, "rgba(255, 196, 120, 0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#1C140C";
  ctx.fillRect(0, height * 0.78, width, height);

  const ground = height * 0.78;
  for (let x = 0; x < width; x += 5) {
    const n = n2(x * 0.02 + time * 0.15, 3.2);
    const blade = height * (0.05 + Math.abs(n) * 0.16);
    ctx.strokeStyle = n > 0 ? "rgba(196, 168, 92, 0.55)" : "rgba(74, 92, 48, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, ground + 2);
    ctx.lineTo(x + n * 6, ground - blade);
    ctx.stroke();
  }
}

function paintStream(ctx: Ctx, width: number, height: number, time: number) {
  ctx.fillStyle = "#07080A";
  ctx.fillRect(0, 0, width, height);

  const cols = ["#1A221C", "#121814", "#0C100E", "#080A09"];
  cols.forEach((color, i) => {
    ridgeLine(ctx, width, height, 0.2 + i * 0.16, 0.08, 1.6 + i * 0.5, 20 + i, time * 0.015, color);
  });

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const trace = (widthScale: number, color: string) => {
    ctx.beginPath();
    for (let x = -10; x <= width + 10; x += 8) {
      const u = x / width;
      const y = height * (0.58 + n2(u * 1.4 + time * 0.04, 12) * 0.16 + Math.sin(u * 6.2) * 0.04);
      if (x === -10) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = widthScale;
    ctx.stroke();
  };
  trace(Math.max(18, width * 0.03), "rgba(180, 196, 188, 0.18)");
  trace(Math.max(4, width * 0.006), "rgba(236, 228, 210, 0.85)");
}

function paintForest(ctx: Ctx, width: number, height: number, time: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.46);
  sky.addColorStop(0, "#E4D2BC");
  sky.addColorStop(1, "#F3E6D4");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height * 0.5);

  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width + 6; x += 6) {
    const u = x / width;
    const edge =
      height *
      (0.34 -
        Math.abs(n2(u * 3 + time * 0.02, 7)) * 0.08 -
        Math.abs(n2(u * 9, 2)) * 0.05);
    ctx.lineTo(x, edge);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = "#101610";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width + 6; x += 6) {
    const u = x / width;
    const edge = height * (0.48 - Math.abs(n2(u * 4 + 2 + time * 0.025, 9)) * 0.1);
    ctx.lineTo(x, edge);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = "#070B08";
  ctx.fill();
}

const painters: Record<PlaceholderVariant, (ctx: Ctx, width: number, height: number, time: number) => void> = {
  dawn: paintDawn,
  ridge: paintRidge,
  savanna: paintSavanna,
  stream: paintStream,
  forest: paintForest,
};

export function paintScene(ctx: Ctx, width: number, height: number, variant: PlaceholderVariant, time: number) {
  painters[variant](ctx, width, height, time);
}
