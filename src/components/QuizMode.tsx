import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TwistyCube from "./TwistyCube";
import { accents } from "../lib/accents";
import type { AlgCase, SectionDef } from "../lib/types";
import { useProgress } from "../lib/progress";
import { caseWeight, recordAnswer } from "../lib/quizStats";

const AUFS = ["", "U", "U'", "U2"];

/**
 * Weighted random pick: unlearned cases and cases you've missed before are
 * sampled more often, so drilling naturally focuses on weak spots.
 */
function pickWeighted(
  pool: AlgCase[],
  isLearned: (id: string) => boolean,
  excludeId?: string,
): AlgCase | null {
  const candidates = pool.length > 1 && excludeId ? pool.filter((c) => c.id !== excludeId) : pool;
  if (candidates.length === 0) return null;
  const weights = candidates.map((c) => caseWeight(c.id, isLearned(c.id)));
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 3 distractors, preferring cases from the same visual group. */
function buildOptions(all: AlgCase[], answer: AlgCase): AlgCase[] {
  const sameGroup = shuffle(all.filter((c) => c.id !== answer.id && c.group === answer.group));
  const others = shuffle(all.filter((c) => c.id !== answer.id && c.group !== answer.group));
  const distractors = [...sameGroup, ...others].slice(0, 3);
  return shuffle([answer, ...distractors]);
}

interface Round {
  c: AlgCase;
  auf: string;
  options: AlgCase[];
}

function newRound(
  pool: AlgCase[],
  all: AlgCase[],
  isLearned: (id: string) => boolean,
  excludeId?: string,
): Round | null {
  const c = pickWeighted(pool, isLearned, excludeId);
  if (!c) return null;
  return {
    c,
    auf: AUFS[Math.floor(Math.random() * AUFS.length)],
    options: buildOptions(all, c),
  };
}

export default function QuizMode({ section }: { section: SectionDef }) {
  const { isLearned, toggle } = useProgress();
  const [variant, setVariant] = useState<"recall" | "recognize">("recall");
  const [unlearnedOnly, setUnlearnedOnly] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ seen: 0, known: 0 });
  const accent = accents[section.accent];

  const pool = useMemo(
    () => (unlearnedOnly ? section.cases.filter((c) => !isLearned(c.id)) : section.cases),
    [section.cases, unlearnedOnly, isLearned],
  );

  const [round, setRound] = useState<Round | null>(() =>
    newRound(section.cases, section.cases, isLearned),
  );

  const advance = (fromPool?: AlgCase[]) => {
    setRevealed(false);
    setPicked(null);
    setRound(newRound(fromPool ?? pool, section.cases, isLearned, round?.c.id));
  };

  const answerRecall = (knewIt: boolean) => {
    if (!round) return;
    recordAnswer(round.c.id, !knewIt);
    setScore((s) => ({ seen: s.seen + 1, known: s.known + (knewIt ? 1 : 0) }));
    if (knewIt && !isLearned(round.c.id)) toggle(round.c.id);
    advance();
  };

  const answerRecognize = (id: string) => {
    if (!round || picked !== null) return;
    const correct = id === round.c.id;
    recordAnswer(round.c.id, !correct);
    setScore((s) => ({ seen: s.seen + 1, known: s.known + (correct ? 1 : 0) }));
    setPicked(id);
    setRevealed(true);
  };

  if (!round || pool.length === 0) {
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
            advance(section.cases);
          }}
          className="mt-5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-bg"
        >
          Quiz the full set
        </button>
      </div>
    );
  }

  const { c: current, auf } = round;
  const solveAlg = auf ? `${auf} ${current.alg}` : current.alg;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-line bg-surface p-1" role="tablist" aria-label="Quiz type">
          {(["recall", "recognize"] as const).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={variant === v}
              onClick={() => {
                setVariant(v);
                setRevealed(false);
                setPicked(null);
              }}
              className={`relative rounded-lg px-3 py-1 text-xs font-bold capitalize transition-colors ${
                variant === v ? "text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {variant === v && (
                <motion.span
                  layoutId={`quiz-variant-${section.id}`}
                  className="absolute inset-0 rounded-lg bg-ink"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative">{v === "recall" ? "Recall the alg" : "Name the case"}</span>
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-muted">
          <input
            type="checkbox"
            checked={unlearnedOnly}
            onChange={(e) => {
              setUnlearnedOnly(e.target.checked);
              const nextPool = e.target.checked
                ? section.cases.filter((c) => !isLearned(c.id))
                : section.cases;
              advance(nextPool);
            }}
            className="h-4 w-4 accent-[var(--c-green)]"
          />
          Unlearned only
        </label>
        {score.seen > 0 && (
          <p className="text-sm font-semibold text-muted tabular-nums">
            <span className="text-cube-green">{score.known}</span>/{score.seen}
          </p>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + variant + String(revealed)}
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
                {variant === "recall"
                  ? "Which case is this — and what's the algorithm?"
                  : "Which case is this?"}
              </h3>
            )}
          </div>

          <div className="mx-auto aspect-square w-full max-w-[280px] py-2">
            <TwistyCube
              key={current.id + auf}
              alg={solveAlg}
              setupAlg="z2"
              stickering={section.stickering}
              stickeringMask={section.stickeringMask}
              controls={revealed}
              tempo={1.2}
              label={revealed ? `Solution for ${current.name}` : "Mystery case — like mid-solve, the angle is random"}
              className="h-full"
            />
          </div>

          <div className="p-5 pt-2">
            {revealed ? (
              <>
                <div className="rounded-xl bg-surface-2/70 px-4 py-3 text-center">
                  <p className="font-mono text-sm break-words">
                    {auf && <span className="mr-1.5 text-faint">({auf})</span>}
                    {current.alg}
                  </p>
                  {auf && (
                    <p className="mt-1 text-[10px] font-semibold tracking-wide text-faint uppercase">
                      re-align the top layer first — just like a real solve
                    </p>
                  )}
                </div>
                <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                  <span className="font-semibold text-ink/80">Spot it: </span>
                  {current.recognition}
                </p>
                {variant === "recall" ? (
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => answerRecall(true)}
                      className="rounded-xl bg-cube-green/15 py-3 text-sm font-bold text-cube-green transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      ✓ Knew it
                    </button>
                    <button
                      type="button"
                      onClick={() => answerRecall(false)}
                      className="rounded-xl bg-surface-2 py-3 text-sm font-bold text-muted transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Still learning
                    </button>
                  </div>
                ) : (
                  <div className="mt-5">
                    <p
                      className={`text-center text-sm font-bold ${
                        picked === current.id ? "text-cube-green" : "text-cube-red"
                      }`}
                    >
                      {picked === current.id
                        ? "Correct — nice recognition."
                        : `Not quite — you picked ${
                            section.cases.find((x) => x.id === picked)?.name ?? "another case"
                          }.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => advance()}
                      className="mt-4 w-full rounded-xl bg-ink py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Next case →
                    </button>
                  </div>
                )}
              </>
            ) : variant === "recall" ? (
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
                  onClick={() => advance()}
                  title="Skip this case"
                  className="rounded-xl border border-line px-4 text-sm font-semibold text-muted transition-colors hover:bg-surface-2"
                >
                  Skip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {round.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => answerRecognize(o.id)}
                    className="rounded-xl border border-line px-3 py-2.5 text-left text-sm font-semibold transition-all duration-150 hover:border-line-strong hover:bg-surface-2 active:scale-[0.98]"
                  >
                    {o.name}
                    {o.nickname && (
                      <span className="ml-1.5 text-xs font-medium text-faint">{o.nickname}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-faint">
        Cases you miss come back more often. Drag the cube to inspect any angle.
      </p>
    </div>
  );
}
