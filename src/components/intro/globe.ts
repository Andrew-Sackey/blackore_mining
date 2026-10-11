import { GLOBE, VEIN_GUIDE } from "@/components/brand/logo-paths";

const DEG = Math.PI / 180;
const TILT = GLOBE.tiltDeg * DEG;

export type Projected = [x: number, y: number, z: number];

/** Orthographic projection. `lambda` is the globe rotation in degrees. */
export function project(lat: number, lon: number, lambda: number): Projected {
  const p = lat * DEG;
  const l = (lon - lambda) * DEG;
  const x = Math.cos(p) * Math.sin(l);
  const y = Math.sin(p);
  const z = Math.cos(p) * Math.cos(l);
  const y2 = y * Math.cos(TILT) - z * Math.sin(TILT);
  const z2 = y * Math.sin(TILT) + z * Math.cos(TILT);
  return [GLOBE.cx + x * GLOBE.gridR, GLOBE.cy - y2 * GLOBE.gridR, z2];
}

function curve(pts: Projected[]): [front: string, back: string] {
  let front = "";
  let back = "";
  let onFront = false;
  let onBack = false;
  for (const [x, y, z] of pts) {
    const point = `${x.toFixed(2)} ${y.toFixed(2)}`;
    if (z >= 0) {
      front += (onFront ? "L" : "M") + point;
      onFront = true;
      onBack = false;
    } else {
      back += (onBack ? "L" : "M") + point;
      onBack = true;
      onFront = false;
    }
  }
  return [front, back];
}

export type GlobePaths = {
  front: string;
  back: string;
  dot: { x: number; y: number; z: number };
};

/** Meridians every 30° and parallels at −60, −30, 0, 30, 60, split into front and back runs. */
export function buildGlobePaths(lambda: number): GlobePaths {
  let front = "";
  let back = "";

  for (let lon = 0; lon < 360; lon += 30) {
    const pts: Projected[] = [];
    for (let lat = -90; lat <= 90; lat += 7.5) pts.push(project(lat, lon, lambda));
    const [f, b] = curve(pts);
    front += f;
    back += b;
  }

  for (const lat of [-60, -30, 0, 30, 60]) {
    const pts: Projected[] = [];
    for (let lon = 0; lon <= 360; lon += 10) pts.push(project(lat, lon, lambda));
    const [f, b] = curve(pts);
    front += f;
    back += b;
  }

  const [x, y, z] = project(GLOBE.target.lat, GLOBE.target.lon, lambda);
  return { front, back, dot: { x, y, z } };
}

/** y along the copper vein for a given x, in logo units. */
export function veinGuideY(x: number): number {
  for (let i = 1; i < VEIN_GUIDE.length; i++) {
    const a = VEIN_GUIDE[i - 1];
    const b = VEIN_GUIDE[i];
    if (x <= b[0]) {
      const t = (x - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * t;
    }
  }
  return VEIN_GUIDE[VEIN_GUIDE.length - 1][1];
}
