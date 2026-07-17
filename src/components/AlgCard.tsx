import { memo, useState } from "react";
import { motion } from "framer-motion";
import TwistyCube from "./TwistyCube";
import LazyMount from "./LazyMount";
import AlgNotation from "./AlgNotation";
import { accents, difficultyMeta } from "../lib/accents";
import type { AccentColor, AlgCase } from "../lib/types";
import { useProgress } from "../lib/progress";

function LearnedCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`Mark ${label} as learned`}
      onClick={onChange}
      title={checked ? "Learned — click to unmark" : "Mark as learned"}
      className={`group/check flex shrink-0 items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1.5 text-xs font-semibold transition-all duration-200 ${
        checked
          ? "border-cube-green/50 bg-cube-green/15 text-cube-green"
          : "border-line text-faint hover:border-line-strong hover:text-muted"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-200 ${
          checked
            ? "border-cube-green bg-cube-green text-white dark:text-black"
            : "border-line-strong group-hover/check:border-faint"
        }`}
      >
        {checked && (
          <motion.svg
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            width="9"
            height="9"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </motion.svg>
        )}
      </span>
      {checked ? "Learned" : "Learn"}
    </button>
  );
}

function DifficultyBadge({ level }: { level: AlgCase["difficulty"] }) {
  const meta = difficultyMeta[level];
  const a = accents[meta.accent];
  return (
    <span
      title={meta.label}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${a.bgSoft} ${a.text}`}
    >
      {meta.short}
    </span>
  );
}

interface AlgCardProps {
  algCase: AlgCase;
  accent: AccentColor;
  /** cubing.js stickering / mask, same semantics as SectionDef */
  stickering?: string;
  stickeringMask?: string;
}

function AlgCardInner({ algCase, accent: accentColor, stickering = "full", stickeringMask }: AlgCardProps) {
  const { isLearned, toggle } = useProgress();
  const learned = isLearned(algCase.id);
  const [activeMove, setActiveMove] = useState<number | null>(null);
  const [showAlts, setShowAlts] = useState(false);
  const [solvedPulse, setSolvedPulse] = useState(0);
  const accent = accents[accentColor];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.45)] ${
        learned ? "border-cube-green/30" : "border-line hover:border-line-strong"
      }`}
    >
      <div className="flex items-start justify-between gap-2 p-4 pb-0">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-tight font-bold tracking-tight">
            {algCase.name}
          </h3>
          {algCase.nickname && (
            <p className={`mt-0.5 text-xs font-semibold ${accent.text}`}>{algCase.nickname}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DifficultyBadge level={algCase.difficulty} />
          <LearnedCheckbox checked={learned} onChange={() => toggle(algCase.id)} label={algCase.name} />
        </div>
      </div>

      <div
        key={solvedPulse || "cube"}
        className={`mx-auto my-2 aspect-square w-full max-w-[240px] rounded-xl ${
          solvedPulse ? "animate-solved-pulse" : ""
        }`}
        style={{ "--pulse-color": accent.cssVar } as React.CSSProperties}
      >
        <LazyMount className="h-full w-full">
          <TwistyCube
            alg={algCase.alg}
            setupAlg="z2"
            stickering={stickering}
            stickeringMask={stickeringMask}
            tempo={1.2}
            label={`3D cube showing the ${algCase.name} case`}
            onMoveIndex={setActiveMove}
            onSolved={() => setSolvedPulse((n) => n + 1)}
            className="h-full"
          />
        </LazyMount>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-1">
        <div className="rounded-xl bg-surface-2/70 px-3 py-2.5">
          <AlgNotation alg={algCase.alg} activeIndex={activeMove} />
          {algCase.altAlgs && algCase.altAlgs.length > 0 && (
            <div className="mt-1.5">
              <button
                type="button"
                onClick={() => setShowAlts((v) => !v)}
                className="text-[11px] font-semibold text-faint transition-colors hover:text-muted"
                aria-expanded={showAlts}
              >
                {showAlts
                  ? "Hide alternatives"
                  : `${algCase.altAlgs.length} alternative${algCase.altAlgs.length > 1 ? "s" : ""} ▾`}
              </button>
              {showAlts && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 space-y-1 overflow-hidden border-t border-line pt-1.5"
                >
                  {algCase.altAlgs.map((a) => (
                    <AlgNotation key={a} alg={a} activeIndex={null} compact />
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        <p className="mt-auto flex gap-2 text-xs leading-relaxed text-muted">
          <svg
            className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent.text}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>
            <span className="font-semibold text-ink/80">Spot it: </span>
            {algCase.recognition}
          </span>
        </p>
      </div>
    </motion.article>
  );
}

const AlgCard = memo(AlgCardInner);
export default AlgCard;
