import { mkdirSync, writeFileSync } from "node:fs";
import { BLACKORE, COPPER_GRADIENT, LOGO_VIEWBOX, LOGO_VIEWBOX_STACKED, MARK, MINING, STACKED } from "../src/components/brand/logo-paths.ts";

const stops = COPPER_GRADIENT.stops
  .map((stop) => `<stop offset="${stop.offset}" stop-color="${stop.color}"/>`)
  .join("");

function gradient(id: string) {
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${COPPER_GRADIENT.x1}" y1="${COPPER_GRADIENT.y1}" x2="${COPPER_GRADIENT.x2}" y2="${COPPER_GRADIENT.y2}">${stops}</linearGradient>`;
}

const markPaths = [MARK.tail, MARK.lowBand, MARK.highStroke].map((d) => `<path d="${d}"/>`).join("");
const wordmark = BLACKORE.map((letter) => `<path fill="#F5F5F7" fill-rule="evenodd" d="${letter.d}"/>`).join("");
const mining = MINING.map((letter) => `<path fill="#F5F5F7" d="${letter.d}"/>`).join("");

function svg(viewBox: string, body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="BlackOre Mining">${body}</svg>\n`;
}

mkdirSync("public/brand", { recursive: true });

writeFileSync(
  "public/brand/blackore-logo-horizontal.svg",
  svg(LOGO_VIEWBOX, `<defs>${gradient("cu")}</defs><g fill="url(#cu)">${markPaths}</g>${wordmark}${mining}`),
);

writeFileSync(
  "public/brand/blackore-logo-stacked.svg",
  svg(
    LOGO_VIEWBOX_STACKED,
    `<defs>${gradient("cu")}</defs><g transform="translate(${STACKED.mark.x} ${STACKED.mark.y}) scale(${STACKED.mark.scale})" fill="url(#cu)">${markPaths}</g>${wordmark}<g transform="translate(${STACKED.mining.x} ${STACKED.mining.y})">${mining}</g>`,
  ),
);

writeFileSync(
  "public/brand/blackore-mark.svg",
  svg("36 8 754 136", `<defs>${gradient("cu")}</defs><g fill="url(#cu)">${markPaths}</g>`),
);

const o = BLACKORE.find((letter) => letter.char === "O");
if (!o || !("inner" in o)) throw new Error("O path missing");

const letters = BLACKORE.map((letter) => {
  if (letter.char !== "O") {
    return `<g class="letter"><path fill="#F5F5F7" fill-rule="evenodd" d="${letter.d}"/></g>`;
  }
  return `<g class="letter" id="oLetter"><path id="oShape" fill="#F5F5F7" fill-rule="evenodd" opacity="0" d="${letter.d}"/>
<g id="globeG"><circle cx="340.55" cy="163.65" r="15.6" fill="url(#sphere)"/>
<path id="gBack" fill="none" stroke="rgba(245,245,247,.13)" stroke-width=".3"/>
<path id="gFront" fill="none" stroke="rgba(245,245,247,.7)" stroke-width=".45" stroke-linejoin="round"/>
<circle cx="340.55" cy="163.65" r="13.9" fill="none" stroke="#F5F5F7" stroke-width="3.4"/>
<circle id="gPing" r="1.3" fill="none" stroke="#E3A56C" stroke-width=".5" opacity="0"/>
<circle id="gDot" r="1.25" fill="#E3A56C"/></g></g>`;
}).join("");

const miningAnimated = MINING.map((letter) => `<path class="mi" fill="#F5F5F7" d="${letter.d}"/>`).join("");

const introSvg = `<svg id="logo" viewBox="${LOGO_VIEWBOX}" role="img" aria-label="BlackOre Mining">
<defs>${gradient("cu")}
<linearGradient id="sheen" gradientUnits="userSpaceOnUse" x1="-260" y1="0" x2="-60" y2="0"><stop offset="0" stop-color="#FFF4E6" stop-opacity="0"/><stop offset=".5" stop-color="#FFF4E6" stop-opacity=".85"/><stop offset="1" stop-color="#FFF4E6" stop-opacity="0"/></linearGradient>
<clipPath id="reveal"><rect id="revealRect" x="30" y="-20" width="0" height="240"/></clipPath>
<clipPath id="lettersClip"><rect x="0" y="145" width="800" height="38"/></clipPath>
<radialGradient id="sphere" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#3A2A1E"/><stop offset=".55" stop-color="#120D0A"/><stop offset="1" stop-color="#030303"/></radialGradient>
<filter id="glow" x="-400%" y="-400%" width="900%" height="900%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<g id="markG"><g clip-path="url(#reveal)"><g fill="url(#cu)">${markPaths}</g><g id="sheenG" fill="url(#sheen)" opacity="0">${markPaths}</g></g>
<circle id="head" r="1.9" fill="#FFF1E0" filter="url(#glow)" opacity="0"/></g>
<g clip-path="url(#lettersClip)">${letters}</g>
<g id="miG">${miningAnimated}</g>
</svg>`;

const navSvg = `<svg viewBox="${LOGO_VIEWBOX}" aria-hidden="true"><defs>${gradient("cuN")}</defs><g fill="url(#cuN)">${markPaths}</g>${wordmark}${mining}</svg>`;

console.log("brand svgs written", introSvg.length, navSvg.length);
