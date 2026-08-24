import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import logoInk from "@/assets/logo-ink.png";
import { LITE_MOTION_MQ, REDUCED_MOTION_MQ } from "./primitives";

const links = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Trust", href: "/#trust" },
  { label: "Logistics", href: "/#logistics" },
  { label: "Who It's For", href: "/#who-its-for" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about" },
];

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [reveal, setReveal] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Backdrop timing follows whichever hero is rendered, so this has to match
    // the hero's own gate or the two drift apart.
    const mq = window.matchMedia(REDUCED_MOTION_MQ);
    // Fading the bar in over the scrub is a desktop flourish. On a phone it just
    // reads as a missing header, so the bar stays put and only the backdrop moves.
    const touch = window.matchMedia(LITE_MOTION_MQ);
    setReady(true);

    const onScroll = () => {
      const hero = document.getElementById("top");
      // The static hero is a single screen and its copy scrolls straight under the
      // bar, so the backdrop has to come in immediately. Over the scrub the bar
      // stays clear until the pinned section is done.
      const threshold = mq.matches ? 8 : hero ? hero.offsetTop + hero.offsetHeight - 72 : 24;
      setScrolled(window.scrollY > threshold);

      if (mq.matches || touch.matches || !hero) {
        setReveal(1);
        return;
      }
      const total = hero.offsetHeight - window.innerHeight;
      const prog = clamp(-hero.getBoundingClientRect().top / Math.max(total, 1));
      setReveal(clamp(prog / 0.06));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Before hydration keep the nav visible (SSR-safe); once ready, follow the reveal.
  const opacity = ready ? reveal : 1;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
      // Clears the status bar / notch. Without it the bar's contents sit flush
      // against the very top edge of the screen on a phone.
      style={{
        opacity,
        paddingTop: "env(safe-area-inset-top)",
        ...(opacity < 0.05 ? { pointerEvents: "none" as const } : {}),
      }}
    >
      {/* Fixed row height at every scroll position, so nothing shifts as the
          backdrop fades in. py-* would let the tallest child drive the height. */}
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:h-18 sm:gap-6 sm:px-6">
        <a href="/" className="flex items-center" aria-label="Corridor One X home">
          {/*
            Two colourways cross-faded by the global light/dark dial. Both files
            are 1998x320, so a box sized by the first keeps them pixel-aligned.
            The ink copy used to be an absolutely positioned sibling with
            inset-0, which pinned it to the link's top edge and stretched it
            across the full link width — left and right both being 0 wins over
            w-auto — so it drifted out of register as the dial crossed over.
          */}
          <span className="relative inline-flex h-5 sm:h-6 md:h-7">
            <img
              src={logo}
              alt="Corridor One X"
              className="h-full w-auto"
              style={{ opacity: "calc(1 - var(--theme-t))" }}
            />
            <img
              src={logoInk}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full"
              style={{ opacity: "var(--theme-t)" }}
            />
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-sans text-sm text-secondary-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="/book-a-demo"
            className="inline-flex h-11 items-center rounded-md bg-accent px-3.5 font-display text-[0.8rem] font-medium tracking-tight text-accent-foreground transition-colors hover:bg-accent-hover active:bg-accent-pressed sm:px-4 sm:text-sm"
          >
            Book a Demo
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-md border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto flex w-full max-w-6xl flex-col px-6 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-sans text-base text-secondary-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
