import { useEffect, useState } from "react";
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

/**
 * Narrow screens crop to the corridors that matter (Europe through Australia)
 * so the country shapes stay legible instead of shrinking to a smudge.
 */
const FULL_VIEW = `0 0 ${width} ${height}`;
const CORRIDOR_VIEW = "96 4 140 102";

export function WorldCorridorMap() {
  const [view, setView] = useState(FULL_VIEW);

  useEffect(() => {
    // Matches the hero's width cutoff: the full world map is unreadable on a phone
    // or tablet, so anything under a desktop viewport gets the corridor close-up.
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setView(mq.matches ? CORRIDOR_VIEW : FULL_VIEW);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative w-full">
      <svg
        viewBox={view}
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
