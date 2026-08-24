import { useEffect, useState, type CSSProperties } from "react";
import {
  ListingIcon,
  MatchIcon,
  NegotiationIcon,
  LoiIcon,
  SamplesIcon,
  LogisticsIcon,
  EscrowFundedIcon,
  ShippedIcon,
  EscrowReleasedIcon,
} from "./DealFlowIcons";
import { LITE_MOTION_MQ, Eyebrow, ParallaxGlow, Reveal, Section, useStickyProgress } from "./primitives";

const steps = [
  {
    n: "01",
    icon: ListingIcon,
    title: "Listing",
    body: "Producer or exporter submits commodity, grade, quantity, corridor, and minimum price. Identity verified against GST, IEC, and trade documents. Need a commodity that isn't listed? Corridor One X sources it directly from verified, reliable origins and brings it to you.",
  },
  {
    n: "02",
    icon: MatchIcon,
    title: "AI Match",
    body: "Corridor One X's AI matches requirements against verified counterparties, ranked by spec fit and Trust Score. Identities stay masked.",
  },
  {
    n: "03",
    icon: NegotiationIcon,
    title: "Negotiation",
    body: "Both parties negotiate through the platform's AI-assisted masked relay. Neither identity is revealed while terms are agreed.",
  },
  {
    n: "04",
    icon: LoiIcon,
    title: "LOI Signed",
    body: "A digital Letter of Intent is signed, with two ways to structure it: directly between buyer and seller, or through Corridor One X, where the platform stands between both parties and takes responsibility for the agreement. Circumvention protection locks the deal to the platform.",
  },
  {
    n: "05",
    icon: SamplesIcon,
    title: "Samples",
    body: "Need to inspect before committing? Samples are routed through Corridor One X, so quality is confirmed without either party's identity being exposed.",
  },
  {
    n: "06",
    icon: LogisticsIcon,
    title: "Logistics",
    body: "Two ways to move the goods: the buyer arranges their own logistics, and seller details are shared to coordinate; or Corridor One X handles logistics end to end, and the seller stays fully masked.",
  },
  {
    n: "07",
    icon: EscrowFundedIcon,
    title: "Escrow Funded",
    body: "Buyer deposits into licensed escrow. Counterparty identity revealed.",
  },
  {
    n: "08",
    icon: ShippedIcon,
    title: "Shipped & Verified",
    body: "Shipping documents verified. Goods tracked across the route they move: sea, air, or road.",
  },
  {
    n: "09",
    icon: EscrowReleasedIcon,
    title: "Escrow Released",
    body: "Funds released on delivery confirmation. Trust Scores updated. Deal complete.",
  },
];

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

export function DealFlow() {
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);
  const { ref: pinRef, progress } = useStickyProgress<HTMLDivElement>(ready && !compact);

  useEffect(() => {
    const mq = window.matchMedia(LITE_MOTION_MQ);
    const sync = () => setCompact(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Copy owns the first slice of the pin, then one step at a time takes focus.
  // The live index is quantised and CSS plays the move, so any scroll — however
  // fast — comes to rest on a step rather than between two of them.
  const START = 0.12;
  const band = (1 - START) / steps.length;
  const cursor = Math.min(Math.max(Math.floor((progress - START) / band), 0), steps.length - 1);

  const header = (
    <div className="max-w-3xl">
      <Eyebrow>The Deal Flow</Eyebrow>
      <h2 className="mt-6 font-display text-3xl leading-[1.1] tracking-[-0.03em] text-foreground md:text-4xl lg:text-[2.75rem]">
        A $200,000 deal. Closed with certainty. In nine steps.
      </h2>
    </div>
  );

  if (ready && compact) {
    return (
      <Section id="how-it-works" className="hairline-top relative overflow-hidden">
        <ParallaxGlow speed={0.55} intensity={12} />
        <Reveal>{header}</Reveal>
        <div className="mt-12 flex flex-col gap-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <article className="glass-card rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-sm tracking-[0.02em] text-accent">{s.n}</span>
                    <h3 className="font-display text-lg font-medium tracking-tight text-foreground">{s.title}</h3>
                  </div>
                  <div className="shrink-0 text-muted-foreground">
                    <s.icon />
                  </div>
                </div>
                <p className="mt-3 font-sans text-sm leading-relaxed text-secondary-foreground">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <section id="how-it-works" ref={pinRef} className="hairline-top relative h-[560vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-5 sm:px-6">
        <ParallaxGlow speed={0.55} intensity={12} />
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div style={{ opacity: clamp(progress / 0.06) }}>{header}</div>

          {/* One card holds focus; everything else dims back and blurs out. */}
          <div className="relative h-[340px]">
            {steps.map((s, i) => {
              const d = cursor - i; // 0 while this step is live
              const off = Math.abs(d);
              const focus = off === 0;
              const style: CSSProperties = {
                zIndex: Math.round(100 - off * 10),
                opacity: progress < 0.04 ? 0 : Math.max(0.06, 1 - off * 0.85),
                filter: `blur(${Math.min(off * 8, 12)}px)`,
                transform: `translateY(${d * -150}px) scale(${1 - Math.min(off * 0.07, 0.2)})`,
              };
              return (
                <article
                  key={s.n}
                  data-focus={focus}
                  className="glass-card absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-2xl p-7 transition-[opacity,filter,transform] duration-[600ms] ease-out data-[focus=true]:border-accent/45"
                  style={style}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-baseline gap-4">
                        <span className="font-display text-sm tracking-[0.02em] text-accent">{s.n}</span>
                        <h3 className="font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                          {s.title}
                        </h3>
                      </div>
                      <p className="mt-4 font-sans text-sm leading-relaxed text-secondary-foreground md:text-[0.95rem]">
                        {s.body}
                      </p>
                    </div>
                    <div className="hidden text-muted-foreground sm:block">
                      <s.icon />
                    </div>
                  </div>
                </article>
              );
            })}

            {/* step rail */}
            <div className="absolute -bottom-2 left-0 right-0 flex gap-1.5">
              {steps.map((s, i) => (
                <span
                  key={s.n}
                  className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                  style={{ background: cursor === i ? "var(--accent)" : "var(--border)" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
