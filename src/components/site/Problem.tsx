import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { Eyebrow, ParallaxGlow, Reveal, useInView, useStickyProgress } from "./primitives";

const headline = "Multi-crore deals. Still closed on a phone call and blind trust.";

const body =
  "Every year, thousands of producers, exporters, and importers negotiate deals worth hundreds of thousands of dollars through unverified contacts and informal arrangements. No verified identity. No enforceable terms. No protection on the payment. When a deal collapses, and they do, there is no recourse, and the goods, the margin, or the money are simply gone.";

const cards = [
  "Deals negotiated with zero identity verification.",
  "No recourse when a deal fails mid-transaction.",
  "No infrastructure built for cross-border SME commodity trade, until now.",
];

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

const headlineClass =
  "font-display text-[1.75rem] leading-[1.15] font-medium tracking-[-0.03em] text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]";

/** One glyph of the typewriter: resolves from blurred to crisp as it lands. */
function Glyph({ ch, on, caret }: { ch: string; on: boolean; caret: boolean }) {
  return (
    <span
      className="relative inline-block transition-[opacity,filter,transform] duration-[420ms] ease-out"
      style={{
        opacity: on ? 1 : 0,
        filter: on ? "blur(0px)" : "blur(12px)",
        transform: on ? "none" : "translateY(0.14em)",
      }}
    >
      {ch}
      {caret ? (
        <span
          aria-hidden
          className="type-caret absolute bg-accent"
          style={{ right: "-0.08em", top: "0.14em", height: "0.82em", width: "2px" }}
        />
      ) : null}
    </span>
  );
}

/**
 * Types `text` out one glyph at a time once `start` flips true. Every glyph is
 * always in the DOM (invisible until typed) so the block never reflows mid-run.
 */
function TypewriterBlur({ text, start, speed = 30 }: { text: string; start: boolean; speed?: number }) {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(text.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [start, text, speed]);

  const words = text.split(" ");
  const done = typed >= text.length;
  let index = -1;

  return (
    <h2 className={headlineClass} aria-label={text}>
      <span aria-hidden>
        {words.map((word, w) => {
          const glyphs = word.split("").map((ch) => {
            index += 1;
            return <Glyph key={index} ch={ch} on={index < typed} caret={!done && index === typed - 1} />;
          });
          index += 1; // the space that follows this word
          return (
            <Fragment key={w}>
              <span className="inline-block whitespace-nowrap">{glyphs}</span>
              {w < words.length - 1 ? " " : null}
            </Fragment>
          );
        })}
      </span>
    </h2>
  );
}

function ProblemCard({ index, text, reveal }: { index: number; text: string; reveal: number }) {
  const style: CSSProperties = {
    opacity: reveal,
    filter: `blur(${(1 - reveal) * 12}px)`,
    transform: `translateY(${(1 - reveal) * 26}px)`,
  };
  return (
    <div
      className="rounded-lg border border-border bg-card p-5 transition-[opacity,filter,transform] duration-700 ease-out"
      style={style}
    >
      <span className="font-display text-xs tracking-[0.02em] text-accent">0{index + 1}</span>
      <p className="mt-3 font-display text-base leading-snug tracking-tight text-foreground">{text}</p>
    </div>
  );
}

function BodyCopy() {
  return (
    <p className="max-w-[58ch] font-sans text-base leading-relaxed text-secondary-foreground lg:text-lg">{body}</p>
  );
}

export function Problem() {
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);
  const { ref: headlineRef, inView } = useInView(0.3);
  const { ref: pinRef, progress: pHead } = useStickyProgress<HTMLDivElement>(ready && !compact);
  const { ref: bodyRef, progress: pBody } = useStickyProgress<HTMLDivElement>(ready && !compact);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px), (prefers-reduced-motion: reduce)");
    const sync = () => setCompact(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Headline holds, then dissolves away as the reader scrolls off it.
  const out = clamp((pHead - 0.42) / 0.42);
  const headlineStyle: CSSProperties = {
    opacity: 1 - out,
    filter: `blur(${out * 14}px)`,
    transform: `translateY(${out * -34}px)`,
  };

  const glow = (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <ParallaxGlow speed={0.55} intensity={14} />
    </div>
  );

  if (ready && compact) {
    return (
      <section id="problem" className="relative px-5 py-20 sm:px-6 sm:py-24">
        {glow}
        <div className="mx-auto w-full max-w-6xl">
          <div ref={headlineRef} className="text-center">
            <Eyebrow>The Status Quo</Eyebrow>
            <div className="mt-6">
              <TypewriterBlur text={headline} start={inView} />
            </div>
          </div>
          <Reveal className="mt-14">
            <BodyCopy />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {cards.map((c, i) => (
              <Reveal key={c} delay={i * 140}>
                <ProblemCard index={i} text={c} reveal={1} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="problem" className="relative">
      {glow}

      {/* Stage one — the statement types itself in, then clears the way. */}
      <div ref={pinRef} className="relative h-[165vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center px-5 sm:px-6">
          <div ref={headlineRef} className="mx-auto w-full max-w-4xl text-center" style={headlineStyle}>
            <Eyebrow>The Status Quo</Eyebrow>
            <div className="mt-7">
              <TypewriterBlur text={headline} start={inView} />
            </div>
          </div>
        </div>
      </div>

      {/* Stage two — the detail sits left while the three cards land in turn. */}
      <div ref={bodyRef} className="relative h-[195vh]">
        <div className="sticky top-0 flex h-screen items-center px-5 sm:px-6">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[70%_30%] items-start gap-x-10">
            <Reveal>
              <BodyCopy />
            </Reveal>
            <div className="flex flex-col gap-4">
              {cards.map((c, i) => (
                <ProblemCard key={c} index={i} text={c} reveal={clamp((pBody - (0.14 + i * 0.21)) / 0.15)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
