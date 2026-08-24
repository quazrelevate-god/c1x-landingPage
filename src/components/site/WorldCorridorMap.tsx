import { useEffect, useState } from "react";
import data from "./world-dots.json";
import { useInView } from "./primitives";

type Dot = { x: number; y: number; t?: number };

const { width } = data;
// Trim the empty southern ocean below the last highlighted landmass (Tasmania).
const height = 106;

const BASE = "#3A3F38";
const ACTIVE = "#9CAD1F";
const SOON = "#5E6B2A";

/** How many waves the highlighted corridors switch on across. */
const WAVES = 16;

const dotAt = (x: number, y: number, r: number) =>
  `M${x.toFixed(1)} ${y.toFixed(1)}m-${r} 0a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 -${r * 2} 0`;

/**
 * The base landmass is one static path. The highlighted corridors are split
 * into concentric waves radiating out from the India–Gulf corridor, so they can
 * switch on in sequence and read as the network populating.
 */
function buildPaths() {
  let base = "";
  const live: Dot[] = [];
  const soon: Dot[] = [];

  for (const p of data.points as Dot[]) {
    if (p.y > height) continue;
    const t = p.t ?? 0;
    if (t === 1) live.push(p);
    else if (t === 2) soon.push(p);
    else base += dotAt(p.x, p.y, 0.32);
  }

  // origin roughly on the Arabian Sea, between India and the Gulf
  const ox = 160;
  const oy = 62;
  const dist = (p: Dot) => Math.hypot(p.x - ox, p.y - oy);
  const spread = (pts: Dot[], r: number) => {
    const max = pts.reduce((m, p) => Math.max(m, dist(p)), 1);
    const waves: string[] = Array.from({ length: WAVES }, () => "");
    for (const p of pts) {
      const w = Math.min(Math.floor((dist(p) / max) * WAVES), WAVES - 1);
      waves[w] += dotAt(p.x, p.y, r);
    }
    return waves;
  };

  return { base, live: spread(live, 0.38), soon: spread(soon, 0.32) };
}

const { base: basePath, live: liveWaves, soon: soonWaves } = buildPaths();

const FULL_VIEW = `0 0 ${width} ${height}`;
/**
 * Narrow screens crop to the corridors that matter (Europe through Australia)
 * so the country shapes stay legible instead of shrinking to a smudge.
 */
const CORRIDOR_VIEW = "96 4 140 102";

export function WorldCorridorMap() {
  const [view, setView] = useState(FULL_VIEW);
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

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
    <div ref={ref} className="relative w-full">
      <svg
        viewBox={view}
        className="h-auto w-full"
        role="img"
        aria-label="World map highlighting active regions in India, the Middle East and Africa, with Europe and Australia coming soon"
      >
        <path d={basePath} fill={BASE} opacity={0.85} />
        {soonWaves.map((d, i) => (
          <path
            key={`s${i}`}
            d={d}
            fill={SOON}
            style={{
              opacity: inView ? 0.7 : 0,
              transition: `opacity 420ms linear ${360 + i * 78}ms`,
            }}
          />
        ))}
        {liveWaves.map((d, i) => (
          <path
            key={`l${i}`}
            d={d}
            fill={ACTIVE}
            style={{
              opacity: inView ? 0.95 : 0,
              transition: `opacity 380ms linear ${i * 78}ms`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
