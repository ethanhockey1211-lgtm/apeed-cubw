import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TwistyCube from "../components/TwistyCube";
import LazyMount from "../components/LazyMount";
import { sections } from "../data/sections";
import { learnStages, stageFraction } from "../data/learn";
import { accents } from "../lib/accents";
import { useProgress } from "../lib/progress";

/**
 * A genuine CFOP solve, built so each phase visibly completes:
 * cross moves, four F2L pair insertions, OLL, then a T-perm + AUF.
 * The player treats the end as solved, so it starts from the scramble.
 */
const HERO_SOLVE = [
  "L D' R' F D2", // cross
  "U R U' R' U' F' U F", // F2L pair 1
  "y U' R U R' U2 R U' R'", // F2L pair 2
  "y U R U2 R' U R U' R'", // F2L pair 3
  "y U2 R U' R' U' F' U F", // F2L pair 4
  "R U2 R' U' R U R' U' R U' R'", // OLL (corners)
  "R U R' U' R' F R2 U' R' U' R U R' F' U2", // PLL (T perm) + AUF
].join(" ");

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
};

const features = [
  {
    title: "Track every case",
    body: "Tick off algorithms as you learn them. Your progress lives in your browser and shows up on every page — F2L 12/41 and counting.",
    accent: "green" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  {
    title: "Quiz mode",
    body: "See a case, recall the algorithm, then reveal the answer. The fastest way to move algs from paper into muscle memory.",
    accent: "orange" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: "Real 3D cubes",
    body: "Every case renders on an accurate, interactive 3D cube. Play the solve, step through it move by move, drag to inspect any angle.",
    accent: "blue" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M12 2 21 7v10l-9 5-9-5V7l9-5z" />
        <path d="M12 12 21 7M12 12v10M12 12 3 7" />
      </svg>
    ),
  },
];

function GuidedPathStrip() {
  const { isLearned } = useProgress();
  const fractions = learnStages.map((s) => stageFraction(s, isLearned));
  const firstIncomplete = fractions.findIndex((f) => f < 1);

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div {...fadeUp}>
        <Link
          to="/learn"
          className="group block rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.45)] sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold tracking-wide text-cube-green uppercase">
                New here? Don't guess the order.
              </p>
              <h2 className="mt-1 font-display text-xl font-bold tracking-tight sm:text-2xl">
                The guided path: 8 stages from scrambled to speed
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-cube-green">
              {firstIncomplete <= 0 ? "Start stage 1" : "Continue the path"}
              <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </span>
          </div>
          <ol className="mt-4 flex flex-wrap gap-2" aria-label="Learning stages">
            {learnStages.map((s, i) => {
              const done = fractions[i] === 1;
              const isNext = i === firstIncomplete;
              return (
                <li
                  key={s.id}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                    done
                      ? "border-cube-green/40 bg-cube-green/10 text-cube-green"
                      : isNext
                        ? "border-line-strong text-ink"
                        : "border-line text-faint"
                  }`}
                >
                  {done ? "✓" : `${s.step}.`} {s.title}
                </li>
              );
            })}
          </ol>
        </Link>
      </motion.div>
    </section>
  );
}

export default function Landing() {
  const { countLearned } = useProgress();
  const totalCases = sections.reduce((n, s) => n + s.cases.length, 0);

  return (
    <div>
      {/* ——— Hero ——— */}
      <section className="relative overflow-hidden">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-10 sm:px-6 md:grid-cols-2 md:pt-20 md:pb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold tracking-wide text-muted uppercase"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cube-green" />
              The CFOP method, interactive
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Four steps.
              <br />
              <span className="text-cube-blue">Cross</span> ·{" "}
              <span className="text-cube-green">F2L</span> ·{" "}
              <span className="text-cube-yellow">OLL</span> ·{" "}
              <span className="text-cube-red">PLL</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
            >
              CFOP is the method behind nearly every speedcubing world record —
              and it's learnable by reasoning, not rote. Guided solves that
              explain <em>why</em> every move happens, a cube you can drive yourself,
              and all {totalCases || 119} cases on real 3D cubes when you want
              them. No static diagrams, no 2012 forum energy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/learn"
                className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-bg transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
              >
                Start the guided path
                <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                to="/pll"
                className="inline-flex items-center gap-2 rounded-xl border border-line-strong px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface"
              >
                Browse algorithms
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto aspect-square w-full max-w-[420px] [animation:float-slow_7s_ease-in-out_infinite]"
          >
            <TwistyCube
              alg={HERO_SOLVE}
              setupAlg="z2"
              setupAnchor="end"
              controls={false}
              loop
              tempo={3}
              hintFacelets="none"
              label="A full CFOP solve playing on loop"
              className="h-full"
            />
          </motion.div>
        </div>
      </section>

      {/* ——— Guided path teaser ——— */}
      <GuidedPathStrip />

      {/* ——— Pipeline ——— */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <motion.div {...fadeUp} className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              The pipeline
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              Every CFOP solve runs the same four stages, in order. Click a
              stage to start learning it.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((s, i) => {
            const a = accents[s.accent];
            const learned = countLearned(s.cases.map((c) => c.id));
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link
                  to={`/${s.id}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)]"
                >
                  <div
                    className={`pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-[var(--glow-strength)] blur-3xl transition-opacity duration-300 group-hover:opacity-40 ${a.bg}`}
                    aria-hidden
                  />
                  <div className="flex items-baseline justify-between">
                    <span className={`font-display text-sm font-bold ${a.text}`}>
                      0{s.step}
                    </span>
                    <span className="text-xs font-medium text-faint">
                      {s.cases.length > 0 ? `${s.cases.length} cases` : "intuitive"}
                    </span>
                  </div>
                  <div className="mx-auto my-3 aspect-square w-full max-w-[150px]">
                    <LazyMount className="h-full w-full">
                      <TwistyCube
                        alg=""
                        setupAlg="z2"
                        stickering={s.stickering}
                        stickeringMask={s.stickeringMask}
                        controls={false}
                        hintFacelets="none"
                        cameraLatitude={35}
                        label={`Cube showing the ${s.name} stage`}
                        className="h-full"
                      />
                    </LazyMount>
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.tagline}</p>
                  {s.cases.length > 0 && learned > 0 && (
                    <div className="mt-3">
                      <div className="h-1 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className={`h-full rounded-full ${a.bg}`}
                          style={{ width: `${(learned / s.cases.length) * 100}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] font-semibold text-faint tabular-nums">
                        {learned}/{s.cases.length} learned
                      </p>
                    </div>
                  )}
                  <span
                    className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${a.text}`}
                  >
                    {s.cases.length > 0 ? "Learn the cases" : "Learn the technique"}
                    <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ——— Features ——— */}
      <section className="border-y border-line bg-surface/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 md:py-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accents[f.accent].bgSoft} ${accents[f.accent].text}`}
              >
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-bold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ——— Bottom CTA ——— */}
      <section className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 md:py-20">
        <motion.h2 {...fadeUp} className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
          Your first sub-20 starts here.
        </motion.h2>
        <motion.p {...fadeUp} className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          Follow the guided path: notation, cross, intuitive F2L, then 16
          algorithms to your first real CFOP solve — with honest time
          estimates at every stage.
        </motion.p>
        <motion.div {...fadeUp} className="mt-7">
          <Link
            to="/learn"
            className="group inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3.5 text-sm font-semibold text-bg transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            Start stage 1
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-line py-8 text-center text-xs text-faint">
        CubeFlow — CFOP trainer with real 3D cubes, powered by cubing.js.
        Progress is stored locally in your browser.
      </footer>
    </div>
  );
}
