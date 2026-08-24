import { Eyebrow, ParallaxGlow, Reveal, Section, useThemeDial } from "./primitives";
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

export function Approach() {
  // Scrolling this section dials the whole page from dark to light and back.
  const dialRef = useThemeDial<HTMLDivElement>();

  return (
    <div ref={dialRef}>
      <Section className="hairline-top relative overflow-hidden">
        <ParallaxGlow speed={0.55} intensity={12} />
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>The Corridor One X Approach</Eyebrow>
            <h2 className="mt-6 font-display text-3xl leading-[1.1] tracking-[-0.03em] text-foreground md:text-4xl lg:text-[2.75rem]">
              Verified before contact. Autonomous through settlement.
            </h2>
            <p className="mt-7 font-sans text-base leading-relaxed text-secondary-foreground">
              Corridor One X does not digitise the old way of trading. It replaces it. Identity is verified before any
              deal begins. Counterparties are matched by AI across commodity, volume, corridor, and trust history.
              Terms are locked in a signed Letter of Intent. Payment is held in escrow and released only on confirmed
              delivery. All of it executes through the platform, without a chain of unverified hands.
            </p>
          </Reveal>
        </div>

        {/* One card per pillar, equal height, copy and diagram trading sides. */}
        <div className="mt-16 flex flex-col gap-6 md:gap-8">
          {pillars.map((p, i) => {
            const flipped = i % 2 === 1;
            return (
              <Reveal key={p.title} delay={i * 90}>
                <article className="glass-card glass-float grid items-center gap-6 rounded-2xl p-6 sm:p-8 md:min-h-[260px] md:grid-cols-2 md:gap-10">
                  <div className={flipped ? "md:order-2" : "md:order-1"}>
                    <span className="font-display text-xs tracking-[0.02em] text-accent">{p.step}</span>
                    <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-secondary-foreground md:text-base">
                      {p.body}
                    </p>
                  </div>
                  <div className={`flex justify-center ${flipped ? "md:order-1" : "md:order-2"}`}>
                    <p.diagram />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
