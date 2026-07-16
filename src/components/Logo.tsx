export default function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <g transform="translate(32 33)">
        <polygon points="0,-24 22,-12 0,0 -22,-12" fill="var(--c-yellow)" />
        <line x1="-14.6" y1="-16" x2="7.4" y2="-4" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="-7.4" y1="-20" x2="14.6" y2="-8" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="7.4" y1="-20" x2="-14.6" y2="-8" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="14.6" y1="-16" x2="-7.4" y2="-4" stroke="var(--c-bg)" strokeWidth="2.5" />
        <polygon points="-22,-10 0,2 0,26 -22,14" fill="var(--c-red)" />
        <line x1="-22" y1="-2" x2="0" y2="10" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="-22" y1="6" x2="0" y2="18" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="-14.7" y1="-6" x2="-14.7" y2="18" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="-7.3" y1="-2" x2="-7.3" y2="22" stroke="var(--c-bg)" strokeWidth="2.5" />
        <polygon points="22,-10 0,2 0,26 22,14" fill="var(--c-blue)" />
        <line x1="22" y1="-2" x2="0" y2="10" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="22" y1="6" x2="0" y2="18" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="14.7" y1="-6" x2="14.7" y2="18" stroke="var(--c-bg)" strokeWidth="2.5" />
        <line x1="7.3" y1="-2" x2="7.3" y2="22" stroke="var(--c-bg)" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
