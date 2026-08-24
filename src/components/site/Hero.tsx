import { useEffect, useRef, useState, type CSSProperties } from "react";
// Phones get the short loop (2.5 MB) rather than the scrub master (7.3 MB): it is
// the same footage, and nothing on mobile seeks through the timeline.
import heroMobileVideo from "@/assets/hero-loop.mp4";
import heroPoster from "@/assets/hero-port.jpg";
// Frame pulled from hero-desktop.mp4 at the point the container wireframe is
// lit, so the ship is on screen the moment the page paints.
import heroShipPoster from "@/assets/hero-ship-poster.jpg";
import heroDesktopVideo from "@/assets/hero-desktop.mp4";
import { REDUCED_MOTION_MQ } from "./primitives";

const headline = "Trade direct. Settle certain. No unverified hands in between.";
const subhead =
  "Corridor One X connects verified producers, exporters, and importers directly. AI matching, autonomous settlement, and escrow-secured payment. The deal you agree to is the deal that closes.";

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

function HeroCta() {
  return (
    <a
      href="/book-a-demo"
      // transparent border so this sits at exactly the same height as the ghost
      // button beside it, which gains 2px from its own border
      className="inline-block rounded-md border border-transparent bg-accent px-6 py-3.5 text-center font-display text-sm font-medium tracking-tight text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover active:bg-accent-pressed"
    >
      Book a Demo
    </a>
  );
}

function HeroSecondaryCta() {
  return (
    <a
      href="/#how-it-works"
      className="inline-block rounded-md border border-border px-6 py-3.5 text-center font-display text-sm font-medium tracking-tight text-foreground transition-colors duration-300 hover:border-accent/50 hover:text-accent"
    >
      See How It Works
    </a>
  );
}

function Overlay() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklab, var(--background) 92%, transparent) 0%, color-mix(in oklab, var(--background) 55%, transparent) 45%, transparent 85%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, color-mix(in oklab, var(--background) 88%, transparent) 0%, color-mix(in oklab, var(--background) 45%, transparent) 46%, transparent 78%)",
        }}
      />
    </>
  );
}

// Anchored to the stacked containers on deck (cargo runs diagonally
// from upper-left to lower-right of the ship as the wireframe reveals).
const CALLOUTS = [
  { label: "Verified", at: 0.42, x: "56%", y: "17%" },
  { label: "Matched", at: 0.6, x: "64%", y: "32%" },
  { label: "Secured", at: 0.78, x: "72%", y: "49%" },
];

function WireCallout({
  label,
  x,
  y,
  progress,
}: {
  label: string;
  x: string;
  y: string;
  progress: number;
}) {
  const o = clamp(progress);
  return (
    <div
      className="pointer-events-none absolute flex items-center gap-0 transition-opacity duration-500"
      style={{ left: x, top: y, opacity: o, transform: `translate(-4px, -50%)` }}
    >
      <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
        <span className="absolute h-2 w-2 rounded-full bg-accent" />
        <span className="deal-callout-pulse absolute h-2 w-2 rounded-full bg-accent" />
      </span>
      <span
        className="h-px bg-accent/70 origin-left transition-transform duration-700"
        style={{ width: 44, transform: `scaleX(${o})` }}
      />
      <span
        className="ml-2 font-display text-[0.68rem] tracking-[0.02em] whitespace-nowrap text-accent uppercase transition-transform duration-500"
        style={{ transform: `translateX(${(1 - o) * 8}px)` }}
      >
        {label}
      </span>
    </div>
  );
}

// Blurred fade-in: each hero element eases from blurred/soft-offset to crisp
// as its reveal value goes 0 -> 1.
const revealStyle = (o: number): CSSProperties => ({
  opacity: o,
  filter: `blur(${(1 - o) * 14}px)`,
  transform: `translateY(${(1 - o) * 22}px)`,
});

function HeroCopy({
  headlineReveal,
  subheadReveal,
  ctaReveal,
}: {
  headlineReveal: number;
  subheadReveal: number;
  ctaReveal: number;
}) {
  return (
    // On phones the copy lives under the video band, left aligned like the rest
    // of the page. From sm up it returns to centred over the full-bleed clip.
    <div className="relative mx-auto flex h-full w-full max-w-6xl items-end justify-center px-5 pb-14 text-left sm:items-center sm:px-6 sm:pb-0 sm:text-center">
      <div className="w-full max-w-3xl">
        <h1
          className="font-display text-[2rem] leading-[1.06] font-medium tracking-[-0.035em] text-foreground transition-[opacity,filter,transform] duration-700 ease-out sm:text-5xl lg:text-6xl"
          style={revealStyle(headlineReveal)}
        >
          {headline}
        </h1>
        <p
          className="mt-6 max-w-lg font-sans text-[0.95rem] leading-relaxed text-secondary-foreground transition-[opacity,filter,transform] duration-700 ease-out sm:mx-auto sm:mt-8 sm:text-base"
          style={revealStyle(subheadReveal)}
        >
          {subhead}
        </p>
        <div
          className="mt-8 flex flex-wrap items-center gap-3 transition-[opacity,filter,transform] duration-700 ease-out sm:mt-10 sm:justify-center"
          style={revealStyle(ctaReveal)}
        >
          <HeroCta />
          <HeroSecondaryCta />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  const current = useRef(0);
  const [p, setP] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only reduced-motion users get the static hero now. Phones scrub too — the
    // ship reveal is the point of this section, and it only exists in the scrub
    // clip, so a touch device that skipped it saw a different page entirely.
    const mq = window.matchMedia(REDUCED_MOTION_MQ);
    const sync = () => setMobile(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // scroll -> progress
  useEffect(() => {
    if (mobile) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const v = clamp(-el.getBoundingClientRect().top / Math.max(total, 1));
      target.current = v;
      setP(v);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mobile]);

  // eased seek loop — the video timeline maps directly to scroll across the
  // whole hero, so the clip scrubs from its opening frame through to the end.
  useEffect(() => {
    if (mobile) return;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const v = videoRef.current;
      if (!v) return;
      const dur = v.duration;
      if (!dur || Number.isNaN(dur)) return;
      current.current += (target.current - current.current) * 0.12;
      const t = clamp(current.current) * (dur - 0.05);
      if (Math.abs(v.currentTime - t) > 1 / 60) {
        try {
          v.currentTime = t;
        } catch {
          /* seek not ready */
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mobile]);

  // Staged reveal: the opening logo flythrough owns p 0 -> ~0.06, then the
  // headline, subhead, and CTA each blur-fade in over their own scroll band.
  const headlineReveal = clamp((p - 0.08) / 0.08);
  const subheadReveal = clamp((p - 0.18) / 0.08);
  const ctaReveal = clamp((p - 0.28) / 0.08);

  if (ready && mobile) {
    return (
      // Stacked rather than overlaid: the footage owns the top of the screen and
      // dissolves into the page, then the copy sits on the page itself, left
      // aligned. Reads far better on a phone than centred text over moving video.
      // svh (not vh) so nothing resizes when mobile browser chrome hides.
      <section id="top" className="relative flex min-h-svh flex-col overflow-hidden">
        <div className="relative h-[52svh] max-h-[520px] min-h-[280px] w-full shrink-0">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroMobileVideo}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          {/* Fades the footage out into the page so there is no hard seam. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, var(--background) 1%, color-mix(in oklab, var(--background) 62%, transparent) 26%, color-mix(in oklab, var(--background) 18%, transparent) 58%, transparent 82%)",
            }}
          />
        </div>

        <div className="relative flex flex-1 flex-col justify-center px-5 pt-2 pb-14">
          <h1 className="font-display text-[2rem] leading-[1.08] font-medium tracking-[-0.035em] text-foreground">
            {headline}
          </h1>
          <p className="mt-5 max-w-md font-sans text-[0.95rem] leading-relaxed text-secondary-foreground">
            {subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <HeroCta />
            <HeroSecondaryCta />
          </div>
        </div>
      </section>
    );
  }

  return (
    // svh so the pinned pane doesn't resize when mobile browser chrome hides,
    // which would otherwise re-run the scroll maths mid-scrub and jump the video.
    <section ref={sectionRef} id="top" className="relative h-[260svh]">
      <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-background">
        {/*
          The clip is 16:9. Stretched over a full-height portrait viewport,
          object-cover has to scale it ~4x to cover and you end up inside a
          couple of containers. Giving it a band roughly the height of the
          reference layout brings the crop back to about half the frame, which
          is the whole ship. From sm up it goes full bleed as before.
        */}
        <div className="absolute inset-x-0 top-0 h-[56svh] sm:inset-0 sm:h-full">
          <video
            ref={videoRef}
            // Ship sits around 70% across, so a centred crop cuts it out.
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center"
            poster={heroShipPoster}
            // Held back until hydration so the poster paints first and the 7.4 MB
            // clip downloads behind it rather than blocking the view.
            {...(ready ? { src: heroDesktopVideo } : {})}
            muted
            playsInline
            preload={ready ? "auto" : "none"}
          />
          {/* Dissolves the band into the page on phones; no seam from sm up. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 sm:hidden"
            style={{
              background:
                "linear-gradient(to top, var(--background) 2%, color-mix(in oklab, var(--background) 55%, transparent) 45%, transparent 100%)",
            }}
          />
        </div>
        <Overlay />

        {/* Anchored to where the deck sits in a landscape crop. Portrait crops the
            frame elsewhere, so they'd label open water — hidden below sm. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          {CALLOUTS.map((c) => (
            <WireCallout
              key={c.label}
              label={c.label}
              x={c.x}
              y={c.y}
              progress={clamp((p - c.at) / 0.09)}
            />
          ))}
        </div>

        <div className="relative h-full">
          <HeroCopy
            headlineReveal={headlineReveal}
            subheadReveal={subheadReveal}
            ctaReveal={ctaReveal}
          />
        </div>

        {/* scroll cue — only at the very top */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-8 z-40 flex flex-col items-center gap-2 transition-opacity duration-300"
          style={{ opacity: 1 - clamp(p / 0.04) }}
        >
          <span className="font-display text-[0.68rem] tracking-[0.02em] text-muted-foreground uppercase">
            Scroll
          </span>
          <span className="relative h-10 w-px bg-border">
            <span className="corridor-particle absolute inset-x-0 top-0 h-3 bg-accent" />
          </span>
        </div>
      </div>
    </section>
  );
}
