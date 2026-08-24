import { Eyebrow, Reveal, useInView, useRawCountUp } from "./primitives";

const breakdown = [
  { label: "KYC and identity", value: 30 },
  { label: "Trade history", value: 30 },
  { label: "On-time delivery", value: 25 },
  { label: "Dispute rate", value: 15 },
];

const columns = [
  {
    title: "Verification",
    body: "Every counterparty cleared before they can transact.",
    items: [
      "Business KYB & beneficial ownership",
      "Export/import licence checks",
      "Bank & GST validation",
      "Trade-reference cross-verification",
    ],
  },
  {
    title: "Escrow & Payment Safety",
    body: "Regulated, licensed escrow with segregated accounts.",
    items: [
      "Milestone-based release (load, ship, deliver)",
      "Dispute window before final release",
      "Full audit trail",
      "Segregated client accounts",
    ],
  },
];

function TrustScoreCard() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const score = useRawCountUp(1000, inView, 3000);

  return (
    <div ref={ref} className="h-full border-t border-ink/15 pt-7">
      <h3 className="font-display text-xl font-medium tracking-tight text-ink">Trust Score (0 to 1000)</h3>
      <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65">
        A single number every trader carries, built only from verified, closed-loop signals.
      </p>
      <p className="mt-6 font-display text-5xl leading-none font-medium tracking-[-0.04em] text-ink tabular-nums md:text-6xl">
        {score}
      </p>
      <ul className="mt-6 space-y-4">
        {breakdown.map((b, i) => (
          <li key={b.label}>
            <div className="flex items-baseline justify-between font-sans text-sm text-ink/80">
              <span>{b.label}</span>
              <span className="tabular-nums text-ink/60">{b.value}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="relative h-full rounded-full bg-accent"
                style={{
                  width: inView ? `${b.value}%` : "0%",
                  transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${i * 180 + 400}ms`,
                }}
              >
                {/* light sweeping along the filled bar */}
                <span
                  aria-hidden
                  className="kpi-sheen absolute inset-y-0 w-1/3 rounded-full"
                  style={{ animationDelay: `${i * 180 + 900}ms` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrustProtection() {
  return (
    <section id="trust" className="relative px-5 py-20 sm:px-6 sm:py-24 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        {/* A frosted white panel that floats over the dark page rather than
            painting the whole viewport light. */}
        <Reveal>
          <div className="trust-panel relative overflow-hidden rounded-3xl px-6 py-12 text-ink sm:px-10 sm:py-14 md:px-14 md:py-16">
            <div className="max-w-3xl">
              <Eyebrow tone="light">Trust, Verified. Money, Protected.</Eyebrow>
              <h2 className="mt-6 font-display text-3xl leading-[1.1] tracking-[-0.03em] text-ink md:text-4xl lg:text-[2.75rem]">
                Every counterparty verified. Every rupee in escrow.
              </h2>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              <TrustScoreCard />
              {columns.map((c, i) => (
                <Reveal key={c.title} delay={(i + 1) * 120}>
                  <div className="h-full border-t border-ink/15 pt-7">
                    <h3 className="font-display text-xl font-medium tracking-tight text-ink">{c.title}</h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-ink/65">{c.body}</p>
                    <ul className="mt-6 space-y-3">
                      {c.items.map((it) => (
                        <li key={it} className="flex gap-3 font-sans text-sm text-ink/80">
                          <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
