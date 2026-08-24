import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.25) {
  // A callback ref (rather than an object ref) so the observer re-attaches when
  // a component swaps the observed node — e.g. switching to a mobile layout.
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useCallback((el: T | null) => setNode(el), []);

  useEffect(() => {
    if (!node || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, threshold, inView]);

  return { ref, inView };
}

/** Smoothly counts up to `to` once `active` becomes true. */
export function useCountUp(to: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, duration]);

  return value;
}

/** Scroll progress (0 to 1) of an element travelling through the viewport. */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * 0.5;
      const p = (vh * 0.85 - r.top) / total;
      setProgress(Math.min(Math.max(p, 0), 1));
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
  }, []);

  return { ref, progress };
}

/**
 * Progress (0 to 1) across a tall wrapper whose inner child is `sticky top-0`,
 * i.e. how far through the pinned span the reader has scrolled.
 */
export function useStickyProgress<T extends HTMLElement = HTMLDivElement>(enabled = true) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const total = el.offsetHeight - window.innerHeight;
      const p = -el.getBoundingClientRect().top / Math.max(total, 1);
      setProgress(Math.min(Math.max(p, 0), 1));
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
  }, [enabled]);

  return { ref, progress };
}

/** Subtle GPU-light parallax for background glows. Disabled on small screens. */
export function Parallax({
  children,
  speed = 0.15,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      setOffset(-center * speed);
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
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ transform: `translate3d(0, ${offset.toFixed(2)}px, 0)` }}>
      {children}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView(0.15);

  return (
    <div
      ref={ref}
      data-visible={inView}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}

/** Fades and rises each word of a headline in sequence on mount. */
export function WordRise({
  text,
  className = "",
  delay = 0,
  step = 70,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="word-rise"
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={`font-display text-[0.72rem] uppercase tracking-[0.02em] ${
        tone === "dark" ? "text-muted-foreground" : "text-ink/50"
      }`}
    >
      {children}
    </p>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-6 sm:py-24 md:py-32 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/**
 * Oversized, always-clipped parallax image.
 * The image is scaled well beyond its frame so travel never reveals an edge.
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  speed = 0.28,
  scale = 1.45,
  children,
  loading = "lazy",
  width,
  height,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  speed?: number;
  scale?: number;
  children?: ReactNode;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2 - window.innerHeight / 2;
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const raw = -center * speed * (mobile ? 0.5 : 1);
      // never travel past the oversized image's hidden margin, so no edge is revealed
      const limit = Math.max(((scale - 1) / 2) * r.height - 1, 0);
      setOffset(Math.min(Math.max(raw, -limit), limit));
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
  }, [speed, scale]);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-background ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        className={`absolute inset-0 h-full w-full object-cover will-change-transform ${imgClassName}`}
        style={{
          transform: `translate3d(0, ${offset.toFixed(2)}px, 0) scale(${scale})`,
        }}
      />
      {children}
    </div>
  );
}

/** Absolutely-positioned lime glow layer that drifts at its own scroll speed. */
export function ParallaxGlow({
  speed = 0.45,
  className = "",
  intensity = 20,
}: {
  speed?: number;
  className?: string;
  intensity?: number;
}) {
  return (
    <Parallax speed={speed} className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <div
        aria-hidden
        className="h-full w-full"
        style={{
          background: `radial-gradient(50% 40% at 50% 55%, color-mix(in oklab, var(--accent) ${intensity}%, transparent) 0%, transparent 72%)`,
        }}
      />
    </Parallax>
  );
}
