import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import ScrambleSolver from "../components/ScrambleSolver";
import TwistyCube from "../components/TwistyCube";
import LazyMount from "../components/LazyMount";
import { fourCases, fourByFourIds } from "../data/puzzles";
import { useProgress } from "../lib/progress";

const stages = [
  {
    title: "Centers",
    body:
      "Build the six 2×2 center blocks — white first, then yellow opposite it, then the sides in the right order (peek at a solved 3×3: white bottom, green front means red on the right). Wide moves (Rw, Uw…) are your tool: they carry center pieces without breaking finished centers if you pair up your motions.",
    demo: "Rw U Rw' U' Rw U2 Rw'",
  },
  {
    title: "Edge pairing",
    body:
      "Each edge exists twice; put the twins together. Line two halves of the same edge up on the left and right of the front face, join them with a slice move (Uw or Dw), store the finished pair in the top layer, and undo the slice. Repeat twelve times — it's slower than it sounds and faster every session.",
    demo: "Dw R F' U R' F Dw'",
  },
  {
    title: "Now it's a 3×3",
    body:
      "Centers done, edges paired: turn only the outer faces and the 4×4 behaves exactly like a 3×3. Cross, F2L, OLL, PLL — everything from the guided path applies unchanged. Except, occasionally, the cube throws a state that can't exist on a 3×3. That's parity, and the two fixes are below.",
    demo: "",
  },
];

export default function FourByFourPage() {
  const { countLearned } = useProgress();

  return (
    <LessonShell
      kicker="Puzzles · 4×4"
      title="The 4×4: reduce, then finish"
      lede="The whole method in one sentence: build the centers, pair up the doubled edges, and solve what remains as a 3×3. Two extra algorithms handle the parity cases a 3×3 can never produce. And if you just want your cube fixed right now — the solver is first."
      accent="orange"
      progress={{ learned: countLearned(fourByFourIds), total: fourByFourIds.length }}
      backTo="/puzzles"
      backLabel="All puzzles"
      next={{
        to: "/puzzles/pyraminx",
        label: "Next puzzle: Pyraminx",
        blurb: "From the biggest beginner puzzle to the friendliest — three algorithms, one afternoon.",
      }}
    >
      {/* Solver */}
      <section id="solver" className="mt-10 scroll-mt-20">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          The solver — paste a scramble, watch it solved
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Scrambled from an app and want out? Paste the exact scramble it gave
          you. You'll see your cube in 3D and a move-by-move solution you can
          follow on the real thing — correct by construction, every time. (Got
          a scrambled <em>3×3</em> with no scramble string? The{" "}
          <Link to="/solver" className="font-semibold text-cube-orange hover:underline">
            photo &amp; paint solver
          </Link>{" "}
          reads the cube itself.)
        </p>
        <div className="mt-5">
          <ScrambleSolver />
        </div>
      </section>

      {/* Method */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          The reduction method
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Three stages. The first two are intuitive — no case lists, just
          technique. The third is everything you already know.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stages.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex flex-col rounded-2xl border border-line bg-surface p-5"
            >
              <span className="font-display text-sm font-bold text-cube-orange">0{i + 1}</span>
              <h3 className="mt-1 font-display text-base font-bold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              <div className="mx-auto mt-3 aspect-square w-full max-w-[160px]">
                <LazyMount className="h-full w-full">
                  <TwistyCube
                    alg={s.demo}
                    puzzle="4x4x4"
                    setupAlg="z2"
                    setupAnchor="start"
                    controls={Boolean(s.demo)}
                    replayOnClick={Boolean(s.demo)}
                    tempo={0.8}
                    hintFacelets="none"
                    label={`4x4 ${s.title} demonstration`}
                    className="h-full"
                  />
                </LazyMount>
              </div>
              {s.demo && (
                <p className="mt-1 text-center text-[10px] font-semibold tracking-wide text-faint uppercase">
                  Wide + slice moves in action — tap to replay
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* The three algorithms */}
      <section className="mt-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            The only four algorithms
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Two helpers for edge pairing (the flip, and the last-two-edges
            finisher built from it), and the two parity fixes. That's the
            complete list of things to memorize on a 4×4 beyond your 3×3 set.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {fourCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="orange" puzzle="4x4x4" />
          ))}
        </div>
      </section>
    </LessonShell>
  );
}
