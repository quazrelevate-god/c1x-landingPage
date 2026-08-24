import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { LITE_MOTION_MQ, Eyebrow, ParallaxGlow, Reveal, Section, useInView, useStickyProgress, useThemeDial } from "./primitives";
import {
  MatchingDiagram,
  VerifyDiagram,
  AutonomousDiagram,
  SettlementDiagram,
  EscrowDiagram,
} from "./ApproachDiagrams";

const pillars = [
  {
    step: "01",
    title: "Matching",
    body: "Counterparties surfaced by AI on spec fit, corridor, volume, and Trust Score.",
    diagram: MatchingDiagram,
  },
  {
    step: "02",
    title: "Verify Identity",
    body: "KYC and KYB clearance before any party can see or send a deal.",
    diagram: VerifyDiagram,
  },
  {
    step: "03",
    title: "Autonomous",
    body: "The platform executes the deal flow end to end, without a chain of intermediaries.",
    diagram: AutonomousDiagram,
  },
  {
    step: "04",
    title: "Select Settlement",
    body: "Terms and rails are chosen per deal, then routed and reconciled automatically.",
    diagram: SettlementDiagram,
  },
  {
    step: "05",
    title: "Escrow Protection",
    body: "Funds sit in licensed escrow and release only on confirmed delivery.",
    diagram: EscrowDiagram,
  },
];

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

/* Bands inside the pinned intro. */
const SETTLE_AT = 0.18; // the oversized title starts folding back into its eyebrow
const SETTLE_LEN = 0.34;
const HEAD_AT = 0.56;
const BODY_AT = 0.72;
const REVEAL_LEN = 0.14;

const blurIn = (v: number): CSSProperties => ({
  opacity: v,
  filter: `blur(${(1 - v) * 12}px)`,
  transform: `translateY(${(1 - v) * 18}px)`,
});

const introCopy = (
  <p className="max-w-3xl font-sans text-base leading-relaxed text-secondary-foreground">
    Corridor One X does not digitise the old way of trading. It replaces it. Identity is verified before any deal
    begins. Counterparties are matched by AI across commodity, volume, corridor, and trust history. Terms are locked
    in a signed Letter of Intent. Payment is held in escrow and released only on confirmed delivery. All of it
    executes through the platform, without a chain of unverified hands.
  </p>
);

const introHeading = (
  <h2 className="max-w-3xl font-display text-3xl leading-[1.1] tracking-[-0.03em] text-foreground md:text-4xl lg:text-[2.75rem]">
    Verified before contact. Autonomous through settlement.
  </h2>
);

/** Copy left, diagram right — and the other way round on every second card. */
function PillarCard({ pillar, flipped }: { pillar: (typeof pillars)[number]; flipped: boolean }) {
  return (
    <article className="glass-card glass-float grid items-center gap-6 rounded-2xl p-6 sm:p-8 md:min-h-[260px] md:grid-cols-2 md:gap-10">
      <div className={flipped ? "md:order-2" : "md:order-1"}>
        <span className="font-display text-xs tracking-[0.02em] text-accent">{pillar.step}</span>
        <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
          {pillar.title}
        </h3>
        <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-secondary-foreground md:text-base">
          {pillar.body}
        </p>
      </div>
      <div className={`flex justify-center ${flipped ? "md:order-1" : "md:order-2"}`}>
        <pillar.diagram />
      </div>
    </article>
  );
}

/** Cards slide straight up into place, one after another, at a constant rate. */
function PillarList() {
  const { ref, inView } = useInView<HTMLDivElement>(0.04);
  return (
    <div ref={ref} className="mt-16 flex flex-col gap-6 md:gap-8">
      {pillars.map((p, i) => (
        <div
          key={p.title}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translate3d(0, 56px, 0)",
            transition: `opacity 620ms linear ${i * 320}ms, transform 620ms linear ${i * 320}ms`,
          }}
        >
          <PillarCard pillar={p} flipped={i % 2 === 1} />
        </div>
      ))}
    </div>
  );
}

/**
 * The section label arrives as a full-bleed centred title, then folds back down
 * into its own eyebrow slot before the heading and body take over.
 */
function PinnedIntro() {
  const { ref: pinRef, progress } = useStickyProgress<HTMLDivElement>();
  const stageRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const [lift, setLift] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const mark = markRef.current;
      if (!stage || !mark) return;
      const s = stage.getBoundingClientRect();
      const m = mark.getBoundingClientRect();
      // vector from the eyebrow's resting spot to the middle of the stage
      setLift({
        x: s.left + s.width / 2 - (m.left + m.width / 2),
        y: s.top + s.height / 2 - (m.top + m.height / 2),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const settled = clamp((progress - SETTLE_AT) / SETTLE_LEN);
  const away = 1 - settled; // 1 = big and centred, 0 = home
  const titleStyle: CSSProperties = {
    transform: `translate(${lift.x * away}px, ${lift.y * away}px) scale(${1 + away * 5.2})`,
    opacity: clamp(progress / 0.08),
    filter: `blur(${clamp(1 - progress / 0.08) * 16}px)`,
    transformOrigin: "center",
  };

  return (
    <div ref={pinRef} className="relative h-[300vh]">
      <div ref={stageRef} className="sticky top-0 flex h-screen items-center overflow-hidden px-5 sm:px-6">
        <ParallaxGlow speed={0.55} intensity={12} />
        <div className="mx-auto w-full max-w-6xl">
          <div ref={markRef} className="inline-block will-change-transform" style={titleStyle}>
            <Eyebrow>The Corridor One X Approach</Eyebrow>
          </div>
          <div className="mt-6" style={blurIn(clamp((progress - HEAD_AT) / REVEAL_LEN))}>
            {introHeading}
          </div>
          <div className="mt-7" style={blurIn(clamp((progress - BODY_AT) / REVEAL_LEN))}>
            {introCopy}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Approach() {
  // Scrolling this section dials the whole page from dark to light and back.
  const dialRef = useThemeDial<HTMLDivElement>();
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(LITE_MOTION_MQ);
    const sync = () => setCompact(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div ref={dialRef} className="hairline-top relative">
      {ready && compact ? (
        <Section className="relative overflow-hidden">
          <ParallaxGlow speed={0.55} intensity={12} />
          <Reveal>
            <Eyebrow>The Corridor One X Approach</Eyebrow>
            <div className="mt-6">{introHeading}</div>
            <div className="mt-7">{introCopy}</div>
          </Reveal>
          <PillarList />
        </Section>
      ) : (
        <>
          <PinnedIntro />
          <Section className="pt-0">
            <PillarList />
          </Section>
        </>
      )}
    </div>
  );
}
