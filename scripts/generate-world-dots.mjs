/**
 * Regenerates src/components/site/world-dots.json.
 *
 * Every dot is classified by real country geometry (dotted-map ships Natural
 * Earth outlines), so the highlighted corridors follow actual national borders
 * instead of a rectangular bounding box.
 *
 *   t = 0  base landmass
 *   t = 1  live corridors   — India, the Middle East, Africa
 *   t = 2  coming soon      — Europe, Australia
 *
 * Run with:  node scripts/generate-world-dots.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getMapJSON } from "dotted-map";

const HEIGHT = 120;
const GRID = "diagonal";

const INDIA = ["IND"];

const MIDDLE_EAST = [
  "SAU", "ARE", "OMN", "QAT", "KWT", "YEM",
  "IRQ", "IRN", "JOR", "ISR", "PSE", "LBN", "SYR",
];

const AFRICA = [
  "DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CMR", "CPV", "CAF", "TCD",
  "COM", "COG", "COD", "DJI", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GAB",
  "GMB", "GHA", "GIN", "GNB", "CIV", "KEN", "LSO", "LBR", "LBY", "MDG",
  "MWI", "MLI", "MRT", "MUS", "MAR", "MOZ", "NAM", "NER", "NGA", "RWA",
  "STP", "SEN", "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "TZA", "TGO",
  "TUN", "UGA", "ZMB", "ZWE", "ESH",
];

const EUROPE = [
  "ALB", "AND", "AUT", "BLR", "BEL", "BIH", "BGR", "HRV", "CYP", "CZE",
  "DNK", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "ISL", "IRL", "ITA",
  "XKX", "LVA", "LIE", "LTU", "LUX", "MLT", "MDA", "MCO", "MNE", "NLD",
  "MKD", "NOR", "POL", "PRT", "ROU", "SMR", "SRB", "SVK", "SVN", "ESP",
  "SWE", "CHE", "UKR", "GBR",
];

const AUSTRALIA = ["AUS"];

const world = JSON.parse(getMapJSON({ height: HEIGHT, grid: GRID }));
const REGION = world.region;

// Only ask dotted-map for codes it actually ships, or it throws.
const KNOWN = new Set(
  [...fs.readFileSync(
    path.join(process.cwd(), "node_modules/dotted-map/dist/index.mjs"),
    "utf8",
  ).matchAll(/"id"\s*:\s*"([A-Z]{3})"/g)].map((m) => m[1]),
);

function keysFor(codes, label) {
  const known = codes.filter((c) => KNOWN.has(c));
  const skipped = codes.filter((c) => !KNOWN.has(c));
  if (skipped.length) console.log(`  ${label}: no outline for ${skipped.join(", ")}`);
  const j = JSON.parse(
    getMapJSON({ height: HEIGHT, grid: GRID, region: REGION, countries: known }),
  );
  return new Set(Object.keys(j.points));
}

console.log("classifying…");
const active = new Set([
  ...keysFor(INDIA, "India"),
  ...keysFor(MIDDLE_EAST, "Middle East"),
  ...keysFor(AFRICA, "Africa"),
]);
const soon = new Set([...keysFor(EUROPE, "Europe"), ...keysFor(AUSTRALIA, "Australia")]);

const points = [];
const tally = [0, 0, 0];
for (const [key, p] of Object.entries(world.points)) {
  const t = active.has(key) ? 1 : soon.has(key) ? 2 : 0;
  tally[t] += 1;
  points.push(t ? { x: p.x, y: +p.y.toFixed(2), t } : { x: p.x, y: +p.y.toFixed(2) });
}

const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/site/world-dots.json",
);
fs.writeFileSync(out, JSON.stringify({ width: world.width, height: HEIGHT, points }));

const bounds = (t) => {
  const ps = points.filter((p) => (p.t ?? 0) === t);
  if (!ps.length) return "none";
  const xs = ps.map((p) => p.x), ys = ps.map((p) => p.y);
  return `x ${Math.min(...xs)}–${Math.max(...xs)}, y ${Math.min(...ys)}–${Math.max(...ys)}`;
};
console.log(`base ${tally[0]}  active ${tally[1]}  soon ${tally[2]}  (total ${points.length})`);
console.log("  active bounds:", bounds(1));
console.log("  soon   bounds:", bounds(2));
console.log("  canvas:", world.width, "x", HEIGHT);
