/**
 * Compact thin-line marks, one per step of the deal flow. Same drawing language
 * as the other diagrams: hairline strokes on the border tone, lime reserved for
 * the detail that carries the step's meaning.
 */
const line = "stroke-border";
const faint = "stroke-border/55";
const hot = "stroke-accent";

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14 shrink-0" aria-hidden="true">
      {children}
    </svg>
  );
}

/** 01 — a listing sheet with its spec filled in. */
export function ListingIcon() {
  return (
    <Mark>
      <rect x="14" y="8" width="36" height="48" rx="3" className={line} strokeWidth="1.2" />
      <path d="M21 20h22M21 28h22M21 36h14" className={faint} strokeWidth="1.2" />
      <path d="M21 45h9" className={hot} strokeWidth="1.6" />
      <circle cx="43" cy="45" r="4" className={hot} strokeWidth="1.4" />
    </Mark>
  );
}

/** 02 — two sides paired by the engine in the middle. */
export function MatchIcon() {
  return (
    <Mark>
      <rect x="6" y="14" width="16" height="11" rx="2" className={line} strokeWidth="1.2" />
      <rect x="6" y="39" width="16" height="11" rx="2" className={line} strokeWidth="1.2" />
      <rect x="42" y="26" width="16" height="11" rx="2" className={line} strokeWidth="1.2" />
      <path d="M22 20q12 0 16 11" className={hot} strokeWidth="1.3" strokeDasharray="3 3" />
      <path d="M22 45q12 0 16 -8" className={faint} strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="32" cy="31" r="3.4" className="fill-accent" stroke="none" />
    </Mark>
  );
}

/** 03 — masked relay: two speech turns, neither named. */
export function NegotiationIcon() {
  return (
    <Mark>
      <path d="M8 14h26a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H18l-6 6v-6H8a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3Z" className={line} strokeWidth="1.2" />
      <path d="M56 30H36a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12l6 6v-6h2a3 3 0 0 0 3-3V33a3 3 0 0 0-3-3Z" className={faint} strokeWidth="1.2" />
      <path d="M12 23h14" className={hot} strokeWidth="1.5" />
      <path d="M40 38h12" className={hot} strokeWidth="1.5" />
    </Mark>
  );
}

/** 04 — the letter of intent, signed. */
export function LoiIcon() {
  return (
    <Mark>
      <path d="M14 8h26l10 10v38a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" className={line} strokeWidth="1.2" />
      <path d="M40 8v10h10" className={faint} strokeWidth="1.2" />
      <path d="M19 28h24M19 35h24" className={faint} strokeWidth="1.1" />
      <path d="M19 46q5 -6 9 0t9 -3" className={hot} strokeWidth="1.5" />
    </Mark>
  );
}

/** 05 — a sample drawn from the lot and checked. */
export function SamplesIcon() {
  return (
    <Mark>
      <path d="M26 8h12M30 8v14L20 46a4 4 0 0 0 4 6h16a4 4 0 0 0 4-6L34 22V8" className={line} strokeWidth="1.2" />
      <path d="M23 40h18" className={hot} strokeWidth="1.5" />
      <circle cx="29" cy="45" r="2" className="fill-accent" stroke="none" />
      <circle cx="36" cy="47" r="1.5" className="fill-accent" stroke="none" />
    </Mark>
  );
}

/** 06 — goods on the move. */
export function LogisticsIcon() {
  return (
    <Mark>
      <rect x="6" y="22" width="26" height="20" rx="2" className={line} strokeWidth="1.2" />
      <path d="M32 28h12l8 8v6H32z" className={line} strokeWidth="1.2" />
      <circle cx="18" cy="46" r="4.5" className={faint} strokeWidth="1.2" />
      <circle cx="44" cy="46" r="4.5" className={faint} strokeWidth="1.2" />
      <path d="M4 16h18" className={hot} strokeWidth="1.5" strokeDasharray="4 3" />
    </Mark>
  );
}

/** 07 — funds locked in the vault. */
export function EscrowFundedIcon() {
  return (
    <Mark>
      <rect x="10" y="18" width="44" height="34" rx="3" className={line} strokeWidth="1.2" />
      <path d="M22 18v-4a10 10 0 0 1 20 0v4" className={hot} strokeWidth="1.4" />
      <circle cx="32" cy="33" r="6" className={faint} strokeWidth="1.2" />
      <path d="M32 33v7" className={hot} strokeWidth="1.5" />
    </Mark>
  );
}

/** 08 — shipped, documents verified. */
export function ShippedIcon() {
  return (
    <Mark>
      <path d="M8 42h48l-6 12H14z" className={line} strokeWidth="1.2" />
      <path d="M18 42V24h28v18" className={line} strokeWidth="1.2" />
      <path d="M25 24v18M32 24v18M39 24v18" className={faint} strokeWidth="1" />
      <path d="M24 16l5 5 10-10" className={hot} strokeWidth="1.8" />
    </Mark>
  );
}

/** 09 — the release, confirmed. */
export function EscrowReleasedIcon() {
  return (
    <Mark>
      <circle cx="32" cy="32" r="20" className={line} strokeWidth="1.2" />
      <path d="M23 32l6 6 13-13" className={hot} strokeWidth="2" />
      <path d="M32 4v6M32 54v6M4 32h6M54 32h6" className={faint} strokeWidth="1.2" />
    </Mark>
  );
}
