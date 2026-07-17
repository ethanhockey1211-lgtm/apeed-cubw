export default function AlgNotation({
  alg,
  activeIndex,
  compact = false,
}: {
  alg: string;
  activeIndex: number | null;
  compact?: boolean;
}) {
  const tokens = alg.split(/\s+/).filter(Boolean);
  return (
    <p
      className={`font-mono leading-relaxed break-words ${compact ? "text-xs" : "text-[13px] sm:text-sm"}`}
      aria-label={`Algorithm: ${alg}`}
    >
      {tokens.map((t, i) => (
        <span
          key={i}
          className={`mr-[0.45em] inline-block rounded px-0.5 transition-colors duration-100 ${
            i === activeIndex
              ? "bg-cube-yellow/25 text-ink outline outline-cube-yellow/60"
              : "text-ink/90"
          }`}
        >
          {t}
        </span>
      ))}
    </p>
  );
}
