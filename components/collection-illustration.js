const baseProps = {
  viewBox: "0 0 96 72",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  className: "h-20 w-20 text-ink"
};

function Shell({ slug, children }) {
  const filterId = `soft-sketch-${slug}`;

  return (
    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[1.65rem] bg-white/80 shadow-sm transition group-hover:bg-white">
      <svg {...baseProps}>
        <defs>
          <filter id={filterId} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.18" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>{children}</g>
      </svg>
    </div>
  );
}

function Stroke({ d, width = 2.15 }) {
  return (
    <>
      <path d={d} stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.16" transform="translate(0.55 -0.35)" />
    </>
  );
}

function Circle({ cx, cy, r, muted = false }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="2.1" fill={muted ? "rgba(227, 218, 204, 0.45)" : "none"} />
      <circle cx={Number(cx) + 0.45} cy={Number(cy) - 0.3} r={Number(r) * 0.96} stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.18" />
    </>
  );
}

function Dot({ cx, cy, r = 3.5 }) {
  return <circle cx={cx} cy={cy} r={r} fill="#E3DACC" />;
}

export function CollectionIllustration({ slug }) {
  if (slug === "accounts-communities") {
    return (
      <Shell slug={slug}>
        <Dot cx="22" cy="22" />
        <Circle cx="28" cy="35" r="12" muted />
        <Circle cx="62" cy="22" r="9" />
        <Circle cx="66" cy="51" r="11" muted />
        <Stroke d="M39 31C45 29 50 26 54 25M40 40C45 43 50 45 55 47" />
        <Stroke d="M23 35H33M28 30V40" width={2} />
      </Shell>
    );
  }

  if (slug === "reading-learning") {
    return (
      <Shell slug={slug}>
        <Dot cx="72" cy="17" />
        <Stroke d="M21 21C32 17 40 20 48 27V56C40 50 32 47 21 51V21Z" />
        <Stroke d="M75 21C64 17 56 20 48 27V56C56 50 64 47 75 51V21Z" />
        <Stroke d="M30 30H40M30 38H41M56 30H66M56 38H65" width={1.75} />
        <Circle cx="48" cy="14" r="4" muted />
      </Shell>
    );
  }

  if (slug === "tools-plugins") {
    return (
      <Shell slug={slug}>
        <Dot cx="70" cy="18" />
        <Stroke d="M24 49L45 28" width={2.5} />
        <Stroke d="M39 23L45 17L55 27L49 33" />
        <Stroke d="M58 20L72 34L58 48L44 34" />
        <Stroke d="M58 29L63 34L58 39" width={1.9} />
        <Circle cx="28" cy="53" r="7" muted />
      </Shell>
    );
  }

  if (slug === "life-admin-portals") {
    return (
      <Shell slug={slug}>
        <Dot cx="68" cy="19" />
        <Stroke d="M24 57H72M30 57V28H66V57" />
        <Stroke d="M25 28L48 15L71 28" />
        <Stroke d="M38 57V42H58V57" />
        <Stroke d="M38 32H43M46 32H51M54 32H59" width={1.75} />
        <Circle cx="48" cy="24" r="3" muted />
      </Shell>
    );
  }

  if (slug === "inspiration-references") {
    return (
      <Shell slug={slug}>
        <Dot cx="24" cy="20" />
        <Stroke d="M48 16L53 31L69 31L56 40L61 56L48 46L35 56L40 40L27 31L43 31L48 16Z" />
        <Circle cx="24" cy="20" r="5" muted />
        <Circle cx="73" cy="50" r="6" muted />
        <Stroke d="M19 51C28 43 34 42 43 47" width={1.9} />
      </Shell>
    );
  }

  if (slug === "sources-to-monitor") {
    return (
      <Shell slug={slug}>
        <Dot cx="76" cy="17" />
        <Circle cx="48" cy="39" r="7" muted />
        <Stroke d="M48 46V59" />
        <Stroke d="M34 32C42 24 54 24 62 32M25 24C38 10 58 10 71 24M39 53H57" />
        <Circle cx="76" cy="17" r="4" />
      </Shell>
    );
  }

  return (
    <Shell slug={slug}>
      <Dot cx="67" cy="18" />
      <Stroke d="M27 19H69V53H27V19Z" />
      <Stroke d="M35 30H61M35 39H54" width={1.8} />
      <Circle cx="67" cy="18" r="7" muted />
      <Stroke d="M64 18H70M67 15V21" width={1.8} />
    </Shell>
  );
}
