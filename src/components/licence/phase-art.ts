import { CONCESSION_PATH, LOCAL_SCALE_KM, PILLAR_POINTS } from "@/content/geo/concession-boundary";

/** Fixed seed so the illustrative overlays match on every load and on the server. */
const SEED = 0xbad0c0de;

const M50 = 0.05 * LOCAL_SCALE_KM;
const M200 = 0.2 * LOCAL_SCALE_KM;
const M400 = 0.4 * LOCAL_SCALE_KM;

const DIR_X = Math.SQRT1_2;
const DIR_Y = Math.SQRT1_2;
const PERP_X = -Math.SQRT1_2;
const PERP_Y = Math.SQRT1_2;

export type ArtBlob = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate: number;
};

export type ArtPoint = { x: number; y: number };

export type PhaseArtwork = {
  boundary: string;
  traverses: string[];
  diamonds: string[];
  sampleLines: string[];
  blobs: ArtBlob[];
  infill: string;
  trenches: string[];
  rings: ArtPoint[];
  holes: { x: number; y: number; d: string }[];
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inside(x: number, y: number) {
  let hit = false;
  const poly = PILLAR_POINTS;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

function n(value: number) {
  return value.toFixed(1);
}

function circlePath(x: number, y: number, r: number) {
  const d = (r * 2).toFixed(2);
  const radius = r.toFixed(2);
  return `M${n(x)} ${n(y)}m-${radius} 0a${radius} ${radius} 0 1 1 ${d} 0a${radius} ${radius} 0 1 1 -${d} 0`;
}

function diamondPath(x: number, y: number, s = 5.5) {
  return `M${n(x)} ${n(y - s)}L${n(x + s)} ${n(y)}L${n(x)} ${n(y + s)}L${n(x - s)} ${n(y)}Z`;
}

function crossings(px: number, py: number, dx: number, dy: number) {
  const hits: number[] = [];
  const poly = PILLAR_POINTS;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j];
    const [bx, by] = poly[i];
    const ex = bx - ax;
    const ey = by - ay;
    const denom = dx * ey - dy * ex;
    if (Math.abs(denom) < 1e-8) continue;
    const t = ((ax - px) * ey - (ay - py) * ex) / denom;
    const u = ((ax - px) * dy - (ay - py) * dx) / denom;
    if (u >= 0 && u <= 1) hits.push(t);
  }
  hits.sort((a, b) => a - b);
  const unique: number[] = [];
  for (const t of hits) {
    if (unique.length === 0 || Math.abs(t - unique[unique.length - 1]) > 0.4) unique.push(t);
  }
  return unique;
}

function inBlob(x: number, y: number, blob: ArtBlob) {
  const dx = x - blob.cx;
  const dy = y - blob.cy;
  const rad = (blob.rotate * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;
  return (lx * lx) / (blob.rx * blob.rx) + (ly * ly) / (blob.ry * blob.ry) <= 1;
}

function build(): PhaseArtwork {
  const rand = mulberry32(SEED);
  let minP = Infinity;
  let maxP = -Infinity;
  let minD = Infinity;
  let maxD = -Infinity;
  for (const [x, y] of PILLAR_POINTS) {
    const p = x * PERP_X + y * PERP_Y;
    const d = x * DIR_X + y * DIR_Y;
    minP = Math.min(minP, p);
    maxP = Math.max(maxP, p);
    minD = Math.min(minD, d);
    maxD = Math.max(maxD, d);
  }

  const traverses: string[] = [];
  const diamonds: string[] = [];
  const traverseCount = 7;
  const span = maxP - minP;
  for (let i = 0; i < traverseCount; i += 1) {
    const p = minP + span * ((i + 0.5) / traverseCount);
    const px = PERP_X * p;
    const py = PERP_Y * p;
    const hits = crossings(px, py, DIR_X, DIR_Y);
    if (hits.length < 2) continue;
    const t0 = hits[0];
    const t1 = hits[hits.length - 1];
    if (t1 - t0 < 40) continue;
    const x0 = px + DIR_X * t0;
    const y0 = py + DIR_Y * t0;
    const x1 = px + DIR_X * t1;
    const y1 = py + DIR_Y * t1;
    const bow = (rand() - 0.5) * 36;
    const tm = (t0 + t1) / 2;
    const cx = px + DIR_X * tm + PERP_X * bow;
    const cy = py + DIR_Y * tm + PERP_Y * bow;
    traverses.push(`M${n(x0)} ${n(y0)}Q${n(cx)} ${n(cy)} ${n(x1)} ${n(y1)}`);

    if (i % 2 === 0) {
      for (const t of [0.28, 0.62]) {
        const u = t;
        const a = (1 - u) * (1 - u);
        const b = 2 * (1 - u) * u;
        const c = u * u;
        diamonds.push(diamondPath(a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1));
      }
    }
  }

  const sampleLines: string[] = [];
  for (let p = minP + M400 * 0.35; p < maxP - M400 * 0.15; p += M400) {
    const parts: string[] = [];
    for (let d = minD; d <= maxD; d += M50) {
      const x = PERP_X * p + DIR_X * d;
      const y = PERP_Y * p + DIR_Y * d;
      if (inside(x, y)) parts.push(circlePath(x, y, 0.85));
    }
    if (parts.length > 8) sampleLines.push(parts.join(""));
  }

  const candidates: ArtPoint[] = [];
  for (let y = 80; y < 780; y += 28) {
    for (let x = 80; x < 940; x += 28) {
      if (inside(x, y) && inside(x + 36, y) && inside(x - 36, y) && inside(x, y + 36) && inside(x, y - 36)) {
        candidates.push({ x, y });
      }
    }
  }
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    const swap = candidates[i];
    candidates[i] = candidates[j];
    candidates[j] = swap;
  }
  const blobs: ArtBlob[] = [];
  for (const point of candidates) {
    if (blobs.length === 3) break;
    const clear = blobs.every((blob) => {
      const dx = blob.cx - point.x;
      const dy = blob.cy - point.y;
      return dx * dx + dy * dy > 170 * 170;
    });
    if (!clear) continue;
    blobs.push({
      cx: point.x,
      cy: point.y,
      rx: 78 + rand() * 46,
      ry: 42 + rand() * 18,
      rotate: -42,
    });
  }

  const infillParts: string[] = [];
  for (let p = minP; p <= maxP; p += M200) {
    for (let d = minD; d <= maxD; d += M200) {
      const x = PERP_X * p + DIR_X * d;
      const y = PERP_Y * p + DIR_Y * d;
      if (!inside(x, y)) continue;
      if (blobs.some((blob) => inBlob(x, y, blob))) infillParts.push(circlePath(x, y, 2.1));
    }
  }

  const trenches: string[] = [];
  const rings: ArtPoint[] = [];
  blobs.forEach((blob, index) => {
    const count = index === 2 ? 1 : 2;
    for (let k = 0; k < count; k += 1) {
      const along = (k - (count - 1) / 2) * 28;
      const angle = (-42 + (rand() - 0.5) * 18) * (Math.PI / 180);
      const len = 54 + rand() * 22;
      const ox = blob.cx + Math.cos(angle + Math.PI / 2) * along;
      const oy = blob.cy + Math.sin(angle + Math.PI / 2) * along;
      const dx = (Math.cos(angle) * len) / 2;
      const dy = (Math.sin(angle) * len) / 2;
      trenches.push(`M${n(ox - dx)} ${n(oy - dy)}L${n(ox + dx)} ${n(oy + dy)}`);
      rings.push({
        x: ox + (rand() - 0.5) * 16,
        y: oy + (rand() - 0.5) * 16,
      });
    }
  });

  const holes: PhaseArtwork["holes"] = [];
  for (const blob of blobs.slice(0, 2)) {
    const want = holes.length === 0 ? 6 : 5;
    let guard = 0;
    while (holes.filter((hole) => inBlob(hole.x, hole.y, blob)).length < want && guard < 80) {
      guard += 1;
      const x = blob.cx + (rand() - 0.5) * blob.rx * 1.3;
      const y = blob.cy + (rand() - 0.5) * blob.ry * 1.6;
      if (!inBlob(x, y, blob) || !inside(x, y)) continue;
      holes.push({
        x,
        y,
        d: `M${n(x)} ${n(y)}L${n(x + 14)} ${n(y + 18)}`,
      });
    }
  }

  return {
    boundary: CONCESSION_PATH,
    traverses,
    diamonds,
    sampleLines,
    blobs,
    infill: infillParts.join(""),
    trenches,
    rings,
    holes,
  };
}

export const phaseArtwork = build();
