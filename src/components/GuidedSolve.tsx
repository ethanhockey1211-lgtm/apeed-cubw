import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import TwistyCube from "./TwistyCube";
import LazyMount from "./LazyMount";
import AlgNotation from "./AlgNotation";
import { accents } from "../lib/accents";
import type { AccentColor, SolvePhase } from "../lib/types";

interface GuidedSolveProps {
  phases: SolvePhase[];
  puzzle?: string;
  setupAlg?: string;
  setupAnchor?: "start" | "end";
  stickering?: string;
  stickeringMask?: string;
  accent?: AccentColor;
  label: string;
  tempo?: number;
  /** Compact: cube + a single live caption (used inside cards). Full: cube + numbered phase list. */
  compact?: boolean;
}

/**
 * An algorithm animated WITH its reasoning: as the cube executes each chunk
 * of moves, the intent behind that chunk lights up. This is the site's core
 * intuitive-learning primitive — people learn the why, and the letters come
 * along for free.
 */
export default function GuidedSolve({
  phases,
  puzzle = "3x3x3",
  setupAlg = "z2",
  setupAnchor = "end",
  stickering,
  stickeringMask,
  accent = "blue",
  label,
  tempo = 0.85,
  compact = false,
}: GuidedSolveProps) {
  const a = accents[accent];
  const [activeMove, setActiveMove] = useState<number | null>(null);
  const [lastPhase, setLastPhase] = useState<number | null>(null);

  const { fullAlg, boundaries } = useMemo(() => {
    let cum = 0;
    const bounds: number[] = [];
    for (const p of phases) {
      cum += p.moves.split(/\s+/).filter(Boolean).length;
      bounds.push(cum); // first token index AFTER this phase
    }
    return { fullAlg: phases.map((p) => p.moves).join(" "), boundaries: bounds };
  }, [phases]);

  const handleMoveIndex = (idx: number | null) => {
    setActiveMove(idx);
    if (idx !== null) {
      const phase = boundaries.findIndex((b) => idx < b);
      if (phase !== -1) setLastPhase(phase);
    }
  };

  const activePhase =
    activeMove !== null ? boundaries.findIndex((b) => activeMove < b) : lastPhase;

  const cube = (
    <div className={`mx-auto aspect-square w-full ${compact ? "max-w-[220px]" : "max-w-[280px]"}`}>
      <LazyMount className="h-full w-full">
        <TwistyCube
          alg={fullAlg}
          puzzle={puzzle}
          setupAlg={setupAlg}
          setupAnchor={setupAnchor}
          stickering={stickering}
          stickeringMask={stickeringMask}
          tempo={tempo}
          label={label}
          onMoveIndex={handleMoveIndex}
          className="h-full"
        />
      </LazyMount>
    </div>
  );

  if (compact) {
    const current = activePhase !== null ? phases[activePhase] : null;
    return (
      <div>
        {cube}
        <div className="mt-1 flex items-center justify-center gap-1.5" aria-hidden>
          {phases.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === activePhase ? `w-5 ${a.bg}` : "w-1.5 bg-surface-2"
              }`}
            />
          ))}
        </div>
        <div
          className="mt-2 min-h-16 rounded-xl bg-surface-2/70 px-3 py-2.5 text-xs leading-relaxed"
          aria-live="polite"
        >
          {current ? (
            <motion.p
              key={activePhase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className={`font-mono font-bold ${a.text}`}>{current.moves}</span>{" "}
              <span className="text-muted">— {current.intent}</span>
            </motion.p>
          ) : (
            <p className="text-faint">
              Press play — the reasoning behind each chunk of moves appears here as the cube turns.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
      <div>
        {cube}
        <div className="mx-auto mt-2 max-w-[300px] rounded-xl bg-surface-2/70 px-3 py-2">
          <AlgNotation alg={fullAlg} activeIndex={activeMove} />
        </div>
      </div>
      <ol className="space-y-2.5">
        {phases.map((p, i) => {
          const active = i === activePhase;
          return (
            <li
              key={i}
              className={`flex gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
                active ? `${a.border} bg-surface-2/60` : "border-line bg-surface"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${
                  active ? `${a.bgSoft} ${a.text}` : "bg-surface-2 text-faint"
                }`}
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className={`font-mono text-sm font-bold ${active ? a.text : "text-ink/80"}`}>
                    {p.moves}
                  </span>
                  {p.echoOf && (
                    <span className="rounded-full bg-cube-green/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cube-green uppercase">
                      you know this one
                    </span>
                  )}
                </p>
                <p className={`mt-0.5 text-sm leading-relaxed ${active ? "text-ink/90" : "text-muted"}`}>
                  {p.intent}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
