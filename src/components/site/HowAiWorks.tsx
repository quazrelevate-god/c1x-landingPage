import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Search, Gauge, Repeat, ShieldAlert, Radar, Fingerprint, LineChart } from "lucide-react";
import { Eyebrow, Reveal, Section, useStickyProgress } from "./primitives";
import { XMark } from "./XMark";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";

const nodes_: TimelineItem[] = [
  {
    id: 1,
    title: "Ingest",
    date: "Step 01",
    category: "Matches on more than commodity.",
    content:
      "The AI weighs commodity type, grade, volume, corridor, price expectation, and trust history together, not just a keyword search. It finds counterparties a manual search would miss.",
    icon: Search,
    relatedIds: [2, 7],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Verify",
    date: "Step 02",
    category: "Works only with verified data.",
    content:
      "Every listing and requirement entering the model is tied to a verified entity, so matches are built on facts the network has already checked.",
    icon: Fingerprint,
    relatedIds: [1, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 3,
    title: "Score",
    date: "Step 03",
    category: "Ranks by likelihood to close.",
    content:
      "Every match is scored on fit and on both parties' verified track records, so the strongest, safest deals surface first.",
    icon: Gauge,
    relatedIds: [2, 4],
    status: "in-progress",
    energy: 88,
  },
  {
    id: 4,
    title: "Screen",
    date: "Step 04",
    category: "Flags risk before it costs you.",
    content:
      "The AI reads patterns across verified trade data to surface counterparty and delivery risk early, so a deal is protected before it's signed, not after it fails.",
    icon: ShieldAlert,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 80,
  },
  {
    id: 5,
    title: "Price",
    date: "Step 05",
    category: "Reads the corridor's real pricing.",
    content:
      "Live signals from closed trades across the network give both sides a grounded price band, so negotiation starts from evidence rather than guesswork.",
    icon: LineChart,
    relatedIds: [4, 6],
    status: "pending",
    energy: 72,
  },
  {
    id: 6,
    title: "Monitor",
    date: "Step 06",
    category: "Works while you don't.",
    content:
      "The market moves constantly. The AI monitors it continuously and alerts you the moment a matching, verified opportunity appears.",
    icon: Radar,
    relatedIds: [5, 7],
    status: "pending",
    energy: 65,
  },
  {
    id: 7,
    title: "Learn",
    date: "Step 07",
    category: "Learns from every closed deal.",
    content:
      "Each completed transaction sharpens the model: better matches, better pricing signals, better risk detection with every deal on the platform.",
    icon: Repeat,
    relatedIds: [6, 1],
    status: "pending",
    energy: 58,
  },
];

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

/* Scroll bands inside the pinned stage. */
const X_IN = 0.06;      // the mark fades up out of the dark
const X_LAND = 0.52;    // …and finishes shrinking onto the orbit centre
const HANDOFF = 0.58;   // background mark gives way to the real centre node
const NODES_AT = 0.6;
const NODES_LEN = 0.18;
const COPY_AT = 0.8;
const COPY_LEN = 0.14;

/** The centre mark is 28px (h-7); this is how many times larger it starts. */
const X_START_SCALE = 46;

const heading = (
  <>
    <Eyebrow>The Intelligence Layer</Eyebrow>
    <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-[-0.03em] text-foreground md:text-4xl lg:text-[2.75rem]">
      The AI behind every match.
    </h2>
    <p className="mt-5 font-sans text-sm leading-relaxed text-secondary-foreground md:text-base">
      Corridor One X doesn't wait for you to find the right counterparty. Its AI reads every verified listing,
      requirement, and Trust Score across the network, and surfaces the deals that actually fit, ranked by how likely
      they are to close.
    </p>
  </>
);

const pullQuote = (
  <p className="max-w-3xl border-l-2 border-accent pl-8 font-display text-xl leading-snug font-medium tracking-[-0.03em] text-accent md:text-2xl">
    You decide the deal. The AI makes sure the right one reaches you.
  </p>
);

/** Desktop: the X arrives huge, shrinks onto the orbit centre, then the ring blooms. */
function PinnedStage() {
  const { ref: pinRef, progress } = useStickyProgress<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState({ x: 0, y: 0 });

  // Where the orbit centre sits relative to the middle of the pinned viewport,
  // so the shrinking mark lands exactly on top of it.
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const orbit = orbitRef.current;
      if (!stage || !orbit) return;
      const s = stage.getBoundingClientRect();
      const o = orbit.getBoundingClientRect();
      setTarget({
        x: o.left + o.width / 2 - (s.left + s.width / 2),
        y: o.top + o.height / 2 - (s.top + s.height / 2),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const land = clamp((progress - X_IN) / (X_LAND - X_IN));
  const eased = 1 - Math.pow(1 - land, 3);
  const scale = X_START_SCALE - (X_START_SCALE - 1) * eased;
  const markStyle: CSSProperties = {
    opacity: clamp(progress / X_IN) * (1 - clamp((progress - X_LAND) / (HANDOFF - X_LAND))),
    transform: `translate(${target.x * eased}px, ${target.y * eased}px) scale(${scale})`,
  };

  const nodes = clamp((progress - NODES_AT) / NODES_LEN);
  const centre = clamp((progress - X_LAND) / (HANDOFF - X_LAND));
  const copy = clamp((progress - COPY_AT) / COPY_LEN);
  const copyStyle: CSSProperties = {
    opacity: copy,
    filter: `blur(${(1 - copy) * 12}px)`,
    transform: `translateY(${(1 - copy) * 18}px)`,
  };

  return (
    <section id="how-the-ai-works" ref={pinRef} className="hairline-top relative h-[360vh]">
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        {/* The mark lives behind everything and never competes with the copy. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 grid place-items-center">
          <XMark className="h-7 w-7 text-accent/70" style={markStyle} />
        </div>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-5 pt-20 sm:px-6 sm:pt-24">
          <div className="max-w-2xl" style={copyStyle}>
            {heading}
          </div>
          <div ref={orbitRef} className="mt-2">
            <RadialOrbitalTimeline
              timelineData={nodes_}
              centerNode={<XMark className="h-7 w-7 text-accent" />}
              heightClass="h-[430px] lg:h-[500px]"
              nodesReveal={nodes}
              centerReveal={centre}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Mobile / reduced-motion: same beats, but driven by entering the viewport. */
function FlowStage() {
  return (
    <div className="corridor-glow-center glow-animate">
      <Section id="how-the-ai-works" className="hairline-top">
        <div className="max-w-3xl">
          <Reveal>{heading}</Reveal>
        </div>
        <Reveal delay={80}>
          <RadialOrbitalTimeline
            timelineData={nodes_}
            centerNode={<XMark className="h-7 w-7 text-accent" />}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-2">{pullQuote}</div>
        </Reveal>
      </Section>
    </div>
  );
}

export function HowAiWorks() {
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px), (prefers-reduced-motion: reduce)");
    const sync = () => setCompact(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (ready && compact) return <FlowStage />;

  return (
    <div className="corridor-glow-center glow-animate">
      <PinnedStage />
      <Section className="pt-0">
        <Reveal>{pullQuote}</Reveal>
      </Section>
    </div>
  );
}
