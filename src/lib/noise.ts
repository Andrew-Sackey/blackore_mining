/** Seeded 2D gradient noise, ported from the opening-sequence prototype. */
export function createNoise2(seed: number): (x: number, y: number) => number {
  const p = new Uint8Array(512);
  const perm = [...Array(256).keys()];
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const g = (h: number, x: number, y: number) => {
    const a = (h & 7) * (Math.PI / 4);
    return Math.cos(a) * x + Math.sin(a) * y;
  };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const A = p[X] + Y;
    const B = p[X + 1] + Y;
    return lerp(
      lerp(g(p[A], xf, yf), g(p[B], xf - 1, yf), u),
      lerp(g(p[A + 1], xf, yf - 1), g(p[B + 1], xf - 1, yf - 1), u),
      v,
    );
  };
}

export const n2 = createNoise2(1957);
