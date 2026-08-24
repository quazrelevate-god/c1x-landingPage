import data from "./world-dots.json";

type Dot = { x: number; y: number; t?: number };

const { width } = data;
// Trim the empty southern ocean below the last highlighted landmass (Tasmania).
const height = 106;

const BASE = "#3A3F38";
const ACTIVE = "#9CAD1F";
const SOON = "#5E6B2A";

/**
 * The map is drawn as three static paths (one per tone) instead of thousands of
 * <circle> nodes, so it paints instantly with no entrance animation. Tones are
 * assigned per country in scripts/generate-world-dots.mjs, so the highlighted
 * corridors follow real national borders.
 */
function buildPaths() {
  const out: [string, string, string] = ["", "", ""];
  for (const p of data.points as Dot[]) {
    if (p.y > height) continue;
    const t = p.t ?? 0;
    const r = t === 1 ? 0.38 : 0.32;
    const x = p.x.toFixed(1);
    const y = p.y.toFixed(1);
    out[t] += `M${x} ${y}m-${r} 0a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 -${r * 2} 0`;
  }
  return out;
}

const [basePath, activePath, soonPath] = buildPaths();

export function WorldCorridorMap() {
  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="World map highlighting active regions in India, the Middle East and Africa, with Europe and Australia coming soon"
      >
        <path d={basePath} fill={BASE} opacity={0.85} />
        <path d={soonPath} fill={SOON} opacity={0.7} />
        <path d={activePath} fill={ACTIVE} opacity={0.95} />
      </svg>
    </div>
  );
}
