import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { learnStages, stageFraction } from "../data/learn";
import { accents } from "../lib/accents";
import { useProgress } from "../lib/progress";

export default function LearnPage() {
  const { isLearned, countLearned } = useProgress();

  const fractions = learnStages.map((s) => stageFraction(s, isLearned));
  const journeyPct = (fractions.reduce((a, b) => a + b, 0) / learnStages.length) * 100;
  const firstIncomplete = fractions.findIndex((f) => f < 1);
  const continueStage = firstIncomplete === -1 ? null : learnStages[firstIncomplete];
  const started = journeyPct > 0;
  const cfopMilestoneDone = learnStages
    .filter((s) => s.milestone)
    .every((s) => stageFraction(s, isLearned) === 1);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 md:pt-12">
      {/* Header */}
      <div className="max-w-2xl">
        <p className="font-display text-sm font-bold tracking-wide text-cube-green uppercase">
          The guided path
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Learn CFOP in the right order
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Nobody learns 119 algorithms from a list. You learn CFOP in stages —
          each one gives you a complete, working way to solve the cube, and each
          one makes you faster than the last. Follow the path top to bottom; the
          time estimates are honest.
        </p>
      </div>

      {/* Journey progress + continue */}
      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5">
        <div className="min-w-0 flex-1 basis-60">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">Your journey</span>
            <span className="font-mono text-xs text-faint tabular-nums">{Math.round(journeyPct)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full rounded-full bg-cube-green"
              initial={false}
              animate={{ width: `${journeyPct}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            />
          </div>
        </div>
        {continueStage ? (
          <Link
            to={continueStage.route}
            className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-bg transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            {started ? `Continue: ${continueStage.title}` : "Start stage 1"}
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        ) : (
          <p className="text-sm font-bold text-cube-green">Every stage complete. Go set a PB. 🏆</p>
        )}
      </div>

      {/* Stages */}
      <ol className="relative mt-10 space-y-4">
        {/* connector line */}
        <div
          className="absolute top-4 bottom-4 left-[19px] w-px bg-line md:left-[23px]"
          aria-hidden
        />
        {learnStages.map((stage, i) => {
          const a = accents[stage.accent];
          const fraction = fractions[i];
          const complete = fraction === 1;
          const isNext = i === firstIncomplete;
          const learned = countLearned(stage.trackIds);

          return (
            <motion.li
              key={stage.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.2) }}
              className="relative flex gap-4 md:gap-6"
            >
              {/* Node */}
              <div
                className={`relative z-10 mt-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-sm font-bold md:h-12 md:w-12 ${
                  complete
                    ? "border-cube-green bg-cube-green text-white dark:text-black"
                    : isNext
                      ? `${a.border} bg-surface text-ink`
                      : "border-line bg-surface text-faint"
                }`}
                aria-hidden
              >
                {complete ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  stage.step
                )}
              </div>

              {/* Card */}
              <Link
                to={stage.route}
                className={`group min-w-0 flex-1 rounded-2xl border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.45)] ${
                  isNext ? "border-line-strong" : "border-line hover:border-line-strong"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display text-lg font-bold tracking-tight sm:text-xl">
                    {stage.title}
                  </h2>
                  <span className={`text-[11px] font-bold tracking-wide uppercase ${a.text}`}>
                    {stage.estimate}
                  </span>
                  {isNext && (
                    <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold tracking-wide text-bg uppercase">
                      Up next
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{stage.subtitle}</p>

                {stage.trackIds.length > 0 ? (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={`h-full rounded-full ${complete ? "bg-cube-green" : a.bg}`}
                        style={{ width: `${fraction * 100}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-faint tabular-nums">
                      {learned}/{stage.trackIds.length}
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-xs font-semibold text-faint">
                    {complete ? "Marked as done" : "Mark it done on the lesson page when it clicks"}
                  </p>
                )}

                <span className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${a.text}`}>
                  {complete ? "Review" : fraction > 0 ? "Continue" : stage.cta}
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ol>

      {/* Milestone note */}
      <div
        className={`mt-10 rounded-2xl border p-6 text-center sm:p-8 ${
          cfopMilestoneDone ? "border-cube-green/40 bg-cube-green/10" : "border-line bg-surface"
        }`}
      >
        {cfopMilestoneDone ? (
          <>
            <h2 className="font-display text-xl font-bold tracking-tight text-cube-green">
              You solve with CFOP now. 🎉
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
              Everything after stage 5 makes you <em>faster</em>, not just able. From
              here: time yourself daily, learn full PLL one alg at a time, and
              let the quiz modes resurface what you miss.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold tracking-tight">
              The finish line is closer than it looks
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
              Stages 1–5 are just 16 algorithms plus intuition — most people get
              there in about a month of casual practice. Everything after that is
              optional speed, learned at whatever pace you enjoy.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
