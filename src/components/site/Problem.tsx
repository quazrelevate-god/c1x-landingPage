import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { Eyebrow, ParallaxGlow, Reveal, useInView, useStickyProgress } from "./primitives";
import {
  UnverifiedIdentityDiagram,
  NoRecourseDiagram,
  NoInfrastructureDiagram,
} from "./ProblemDiagrams";

const headline = "Multi-crore deals. Still closed on a phone call and blind trust.";

const body =
  "Every year, thousands of producers, exporters, and importers negotiate deals worth hundreds of thousands of dollars through unverified contacts and informal arrangements. No verified identity. No enforceable terms. No protection on the payment. When a deal collapses, and they do, there is no recourse, and the goods, the margin, or the money are simply gone.";

const cards = [
  { text: "Deals negotiated with zero identity verification.", diagram: UnverifiedIdentityDiagram },
  { text: "No recourse when a deal fails mid-transaction.", diagram: NoRecourseDiagram },
  {
    text: "No infrastructure built for cross-border SME commodity trade, until now.",
    diagram: NoInfrastructureDiagram,
  },
];

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

// Scroll bands inside the pinned span.
const BODY_AT = 0.12;
const BODY_LEN = 0.1;
const CARD_AT = 0.3;
const CARD_STEP = 0.2;
const CARD_LEN = 0.15;

const headlineClass =
  "font-display text-[1.75rem] leading-[1.15] font-medium tracking-[-0.03em] text-foreground sm:text-4xl md:text-5xl lg:text-[3.1rem]";

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

function CardFace({ index, text, Diagram }: { index: number; text: string; Diagram: () => React.ReactElement }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]">
      <div className="h-[150px] shrink-0 border-b border-border/70 bg-elevated/40">
        <Diagram />
      </div>
      <div className="flex flex-1 flex-col justify-center p-6">
        <span className="font-display text-xs tracking-[0.02em] text-accent">0{index + 1}</span>
        <p className="mt-3 font-display text-base leading-snug tracking-tight text-foreground">{text}</p>
      </div>
    </div>
  );
}

/**
 * The three cards share one footprint. Each new card rises over the last, which
 * stays visible as a slightly smaller, dimmer slab behind it.
 */
function CardStack({ progress }: { progress: number }) {
  const enters = cards.map((_, i) => clamp((progress - (CARD_AT + i * CARD_STEP)) / CARD_LEN));

  return (
    <div className="relative h-[320px] w-full" aria-hidden={enters[0] === 0}>
      {cards.map((c, i) => {
        const enter = enters[i] ?? 0;
        // How many later cards have started covering this one.
        const covered = enters.slice(i + 1).reduce((sum, e) => sum + e, 0);
        const style: CSSProperties = {
          zIndex: i + 1,
          opacity: enter * Math.max(1 - covered * 0.45, 0),
          filter: `blur(${(1 - enter) * 10 + covered * 1.5}px)`,
          transform: `translateY(${(1 - enter) * 56 - covered * 16}px) scale(${1 - covered * 0.05})`,
        };
        return (
          <div
            key={c.text}
            className="absolute inset-0 transition-[opacity,filter,transform] duration-500 ease-out"
            style={style}
          >
            <CardFace index={i} text={c.text} Diagram={c.diagram} />
          </div>
        );
      })}

      {/* which card of three is on top */}
      <div className="absolute -bottom-8 left-0 flex gap-1.5">
        {cards.map((c, i) => (
          <span
            key={c.text}
            className="h-[3px] w-7 rounded-full transition-colors duration-500"
            style={{ background: (enters[i] ?? 0) > 0.5 ? "var(--accent)" : "var(--border)" }}
          />
        ))}
      </div>
    </div>
  );
}

function BodyCopy({ style }: { style?: CSSProperties }) {
  return (
    <p
      className="max-w-[54ch] font-sans text-base leading-relaxed text-secondary-foreground transition-[opacity,filter,transform] duration-700 ease-out lg:text-lg"
      style={style}
    >
      {body}
    </p>
  );
}

export function Problem() {
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);
  const { ref: headlineRef, inView } = useInView(0.3);
  const { ref: pinRef, progress } = useStickyProgress<HTMLDivElement>(ready && !compact);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px), (prefers-reduced-motion: reduce)");
    const sync = () => setCompact(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const bodyIn = clamp((progress - BODY_AT) / BODY_LEN);
  const bodyStyle: CSSProperties = {
    opacity: bodyIn,
    filter: `blur(${(1 - bodyIn) * 10}px)`,
    transform: `translateY(${(1 - bodyIn) * 20}px)`,
  };

  const glow = (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <ParallaxGlow speed={0.55} intensity={14} />
    </div>
  );

  const heading = (
    <div ref={headlineRef} className="mx-auto w-full max-w-4xl text-center">
      <Eyebrow>The Status Quo</Eyebrow>
      <div className="mt-6">
        <TypewriterBlur text={headline} start={inView} />
      </div>
    </div>
  );

  if (ready && compact) {
    return (
      <section id="problem" className="relative px-5 py-20 sm:px-6 sm:py-24">
        {glow}
        <div className="mx-auto w-full max-w-6xl">
          {heading}
          <Reveal className="mt-10">
            <BodyCopy />
          </Reveal>
          <div className="mt-10 flex flex-col gap-5">
            {cards.map((c, i) => (
              <Reveal key={c.text} delay={i * 120}>
                <div className="h-[320px]">
                  <CardFace index={i} text={c.text} Diagram={c.diagram} />
                </div>
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
      <div ref={pinRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-screen items-center px-5 sm:px-6">
          <div className="mx-auto w-full max-w-6xl">
            {heading}
            <div className="mt-14 grid grid-cols-[1fr_minmax(0,340px)] items-start gap-x-14">
              <BodyCopy style={bodyStyle} />
              <CardStack progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
