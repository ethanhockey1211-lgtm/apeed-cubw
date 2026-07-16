import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TwistyCube from "./TwistyCube";
import { accents } from "../lib/accents";
import type { AlgCase, SectionDef } from "../lib/types";
import { useProgress } from "../lib/progress";

function pickRandom(pool: AlgCase[], excludeId?: string): AlgCase | null {
  const candidates = pool.length > 1 && excludeId ? pool.filter((c) => c.id !== excludeId) : pool;
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function QuizMode({ section }: { section: SectionDef }) {
  const { isLearned, toggle } = useProgress();
  const [unlearnedOnly, setUnlearnedOnly] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ seen: 0, known: 0 });
  const accent = accents[section.accent];

  const pool = useMemo(
    () => (unlearnedOnly ? section.cases.filter((c) => !isLearned(c.id)) : section.cases),
    [section.cases, unlearnedOnly, isLearned],
  );

  const [current, setCurrent] = useState<AlgCase | null>(() => pickRandom(section.cases));

  const next = (knewIt?: boolean) => {
    if (knewIt !== undefined) {
      setScore((s) => ({ seen: s.seen + 1, known: s.known + (knewIt ? 1 : 0) }));
    }
    setRevealed(false);
    setCurrent(pickRandom(pool, current?.id));
  };

  if (!current || pool.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface p-10 text-center">
        <p className="font-display text-lg font-bold">Nothing left to quiz 🎉</p>
        <p className="mt-2 text-sm text-muted">
          You've marked every {section.name} case as learned. Turn off “unlearned
          only” to keep drilling the full set.
        </p>
        <button
          type="button"
          onClick={() => {
            setUnlearnedOnly(false);
            setCurrent(pickRandom(section.cases));
          }}
          className="mt-5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-bg"
        >
          Quiz the full set
        </button>
      </div>
    );
  }

  const learned = isLearned(current.id);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted">
          <input
            type="checkbox"
            checked={unlearnedOnly}
            onChange={(e) => {
              setUnlearnedOnly(e.target.checked);
              const nextPool = e.target.checked
                ? section.cases.filter((c) => !isLearned(c.id))
                : section.cases;
              setRevealed(false);
              setCurrent(pickRandom(nextPool));
            }}
            className="h-4 w-4 accent-[var(--c-green)]"
          />
          Unlearned cases only
        </label>
        {score.seen > 0 && (
          <p className="text-sm font-semibold text-muted tabular-nums">
            <span className="text-cube-green">{score.known}</span>/{score.seen} recalled
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + String(revealed)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <div className="p-5 pb-0 text-center">
            {revealed ? (
              <>
                <h3 className="font-display text-2xl font-bold tracking-tight">{current.name}</h3>
                {current.nickname && (
                  <p className={`mt-0.5 text-sm font-semibold ${accent.text}`}>{current.nickname}</p>
                )}
              </>
            ) : (
              <h3 className="font-display text-lg font-bold tracking-tight text-muted">
                Which case is this — and what's the algorithm?
              </h3>
            )}
          </div>

          <div className="mx-auto aspect-square w-full max-w-[280px] py-2">
            <TwistyCube
              key={current.id}
              alg={current.alg}
              setupAlg="z2"
              stickering={section.stickering}
              stickeringMask={section.stickeringMask}
              controls={revealed}
              tempo={1.2}
              label={revealed ? `Solution for ${current.name}` : "Mystery case — recall the algorithm"}
              className="h-full"
            />
          </div>

          <div className="p-5 pt-2">
            {revealed ? (
              <>
                <div className="rounded-xl bg-surface-2/70 px-4 py-3 text-center">
                  <p className="font-mono text-sm break-words">{current.alg}</p>
                </div>
                <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-ink/80">Spot it: </span>
                  {current.recognition}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!learned) toggle(current.id);
                      next(true);
                    }}
                    className="rounded-xl bg-cube-green/15 py-3 text-sm font-bold text-cube-green transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ✓ Knew it
                  </button>
                  <button
                    type="button"
                    onClick={() => next(false)}
                    className="rounded-xl bg-surface-2 py-3 text-sm font-bold text-muted transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Still learning
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="rounded-xl bg-ink py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Reveal algorithm
                </button>
                <button
                  type="button"
                  onClick={() => next()}
                  title="Skip this case"
                  className="rounded-xl border border-line px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-2"
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-faint">
        Drag the cube to inspect it from any angle before answering.
      </p>
    </div>
  );
}
