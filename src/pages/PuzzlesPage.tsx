import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TwistyCube from "../components/TwistyCube";
import LazyMount from "../components/LazyMount";
import { puzzleDefs, puzzleProgressIds } from "../data/puzzles";
import { accents } from "../lib/accents";
import { useProgress } from "../lib/progress";

export default function PuzzlesPage() {
  const { countLearned } = useProgress();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
      <div className="max-w-2xl">
        <p className="font-display text-sm font-bold tracking-wide text-cube-orange uppercase">
          Beyond the 3×3
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Other puzzles, same instincts
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Everything you build on the 3×3 transfers. The 2×2 uses algorithms
          you already know, the 4×4 <em>becomes</em> a 3×3 halfway through, and the
          Pyraminx needs three short algorithms total. Every algorithm on these
          pages is machine-verified against the real puzzle engines.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {puzzleDefs.map((p, i) => {
          const a = accents[p.accent];
          const ids = puzzleProgressIds[p.id] ?? [];
          const learned = countLearned(ids);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <Link
                to={p.route}
                className="group relative block h-full overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)]"
              >
                <div
                  className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-[var(--glow-strength)] blur-3xl transition-opacity duration-300 group-hover:opacity-40 ${a.bg}`}
                  aria-hidden
                />
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-2xl font-bold tracking-tight">{p.name}</h2>
                  {ids.length > 0 && (
                    <span className="text-xs font-semibold text-faint tabular-nums">
                      {learned}/{ids.length} algs
                    </span>
                  )}
                </div>
                <div className="mx-auto my-3 aspect-square w-full max-w-[170px]">
                  <LazyMount className="h-full w-full">
                    <TwistyCube
                      alg=""
                      puzzle={p.puzzleId}
                      controls={false}
                      hintFacelets="none"
                      cameraLatitude={30}
                      label={`A ${p.name} puzzle`}
                      className="h-full"
                    />
                  </LazyMount>
                </div>
                <p className={`font-display text-sm font-bold ${a.text}`}>{p.tagline}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.blurb}</p>
                <span className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${a.text}`}>
                  Learn it
                  <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-xl font-bold tracking-tight">
              Stuck cube? The solver will un-stick it.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Paste the scramble from your timer app and watch your exact cube —
              2×2 up to 5×5 — get solved move by move on screen, so you can
              follow along on yours.
            </p>
          </div>
          <Link
            to="/puzzles/4x4#solver"
            className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-bg transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            Open the solver
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
