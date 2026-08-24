/**
 * Thin-line vignettes for the three Problem cards. Same technical language as
 * ApproachDiagrams: hairline strokes on the border tone, lime reserved for the
 * detail that carries the meaning.
 */

const line = "stroke-border";
const faint = "stroke-border/55";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="-42 -4 284 124"
      fill="none"
      className="h-full w-full text-muted-foreground"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** 01 — an identity badge that was never checked. */
export function UnverifiedIdentityDiagram() {
  return (
    <Frame>
      {/* badge body */}
      <rect x="58" y="18" width="84" height="80" rx="4" className={line} strokeWidth="0.85" />
      {/* lanyard clip */}
      <path d="M92 18 v-6 a8 8 0 0 1 16 0 v6" className={faint} strokeWidth="0.85" />
      {/* silhouette, dashed = never confirmed */}
      <circle cx="100" cy="46" r="11" className={faint} strokeWidth="0.85" strokeDasharray="3 3" />
      <path d="M84 68 a16 13 0 0 1 32 0" className={faint} strokeWidth="0.85" strokeDasharray="3 3" />
      {/* the unknown */}
      <text
        x="100"
        y="52"
        textAnchor="middle"
        className="fill-accent font-display"
        fontSize="16"
        style={{ animation: "dgm-blink 3.2s ease-in-out infinite" }}
      >
        ?
      </text>
      {/* redacted detail lines */}
      <rect x="70" y="76" width="42" height="3" rx="1.5" className="fill-border" stroke="none" />
      <rect x="70" y="84" width="26" height="3" rx="1.5" className="fill-border" stroke="none" />
      {/* empty verification chip */}
      <circle cx="127" cy="84" r="7.5" className="stroke-accent" strokeWidth="0.9" strokeDasharray="2.5 2.5" />
      <path d="M123.5 84.5 l7 -7 M123.5 77.5 l7 7" className="stroke-accent" strokeWidth="0.9" />
      {/* scan sweep that never lands */}
      <path d="M58 34 h84" className="stroke-accent/40" strokeWidth="0.75" strokeDasharray="5 4">
        <animate attributeName="y1" values="30;92;30" dur="4.5s" repeatCount="indefinite" />
        <animate attributeName="y2" values="30;92;30" dur="4.5s" repeatCount="indefinite" />
      </path>
    </Frame>
  );
}

/** 02 — a signed contract torn in half, still in hand. */
export function NoRecourseDiagram() {
  return (
    <Frame>
      {/* left half of the contract */}
      <path
        d="M46 14 h44 l-4 8 l5 8 l-5 8 l4 8 l-4 8 l4 8 l-4 8 l4 8 v10 H46 Z"
        className={line}
        strokeWidth="0.85"
      />
      {/* right half, torn away and tilted */}
      <g transform="rotate(7 132 52)">
        <path
          d="M112 14 h42 v66 h-42 l4 -8 l-4 -8 l4 -8 l-4 -8 l5 -8 l-5 -8 l4 -8 Z"
          className={line}
          strokeWidth="0.85"
        />
        {/* broken seal */}
        <circle cx="140" cy="64" r="7" className="stroke-accent" strokeWidth="0.9" strokeDasharray="3 2.5" />
      </g>
      {/* clause lines, cut short at the tear */}
      <rect x="54" y="26" width="26" height="2.6" rx="1.3" className="fill-border" stroke="none" />
      <rect x="54" y="36" width="22" height="2.6" rx="1.3" className="fill-border" stroke="none" />
      <rect x="54" y="46" width="28" height="2.6" rx="1.3" className="fill-border" stroke="none" />
      <rect x="122" y="26" width="24" height="2.6" rx="1.3" className="fill-border" stroke="none" />
      <rect x="126" y="36" width="20" height="2.6" rx="1.3" className="fill-border" stroke="none" />
      {/* the tear itself */}
      <path
        d="M100 12 l-4 9 l5 8 l-5 8 l4 8 l-4 8 l4 8 l-4 8 l4 9"
        className="stroke-accent"
        strokeWidth="1"
        style={{ animation: "dgm-pulse 3s ease-in-out infinite", transformOrigin: "100px 52px" }}
      />
      {/* hand still holding the left half */}
      <g className={line} strokeWidth="0.85" strokeLinecap="round">
        <path d="M40 96 a10 10 0 0 1 10 -10 h20" />
        <path d="M70 86 a5 5 0 0 1 0 10 h-14" />
        <path d="M62 96 a4.5 4.5 0 0 1 0 9 h-12" />
        <path d="M56 105 a4 4 0 0 1 0 8 H40" />
        <path d="M40 96 v17" />
      </g>
    </Frame>
  );
}

/** 03 — a corridor with no bridge across it. */
export function NoInfrastructureDiagram() {
  return (
    <Frame>
      {/* two shores */}
      <path d="M6 82 h58 v20 H6 Z" className={faint} strokeWidth="0.85" />
      <path d="M136 82 h58 v20 h-58 Z" className={faint} strokeWidth="0.85" />
      {/* bridge piers */}
      <path d="M40 82 V60 M156 82 V60" className={line} strokeWidth="0.85" />
      {/* deck, built from both sides and stopping short */}
      <path d="M14 60 h60" className={line} strokeWidth="1.1" />
      <path d="M126 60 h60" className={line} strokeWidth="1.1" />
      {/* the missing span */}
      <path d="M74 60 h52" className="stroke-accent/45" strokeWidth="1" strokeDasharray="4 5" />
      {/* broken ends */}
      <path d="M74 55 v10 M126 55 v10" className="stroke-accent" strokeWidth="1" />
      {/* suspension that never met */}
      <path d="M14 60 q28 -26 60 -14" className={faint} strokeWidth="0.75" />
      <path d="M186 60 q-28 -26 -60 -14" className={faint} strokeWidth="0.75" />
      {/* a container waiting on the near shore */}
      <g className={line} strokeWidth="0.85">
        <rect x="20" y="44" width="26" height="14" rx="1" />
        <path d="M26 44 v14 M32 44 v14 M38 44 v14" className={faint} strokeWidth="0.6" />
      </g>
      {/* it tries to cross, and falls short */}
      <circle cx="74" cy="60" r="3" className="fill-accent" stroke="none">
        <animate attributeName="cx" values="74;96;74" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="cy" values="60;72;60" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.15;1" dur="3.6s" repeatCount="indefinite" />
      </circle>
      {/* water */}
      <path d="M64 96 h72" className="stroke-border/40" strokeWidth="0.75" strokeDasharray="3 4" />
    </Frame>
  );
}
