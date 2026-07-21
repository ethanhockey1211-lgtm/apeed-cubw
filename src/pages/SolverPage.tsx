import { Link } from "react-router-dom";
import StateSolver from "../components/StateSolver";
import ScrambleSolver from "../components/ScrambleSolver";

export default function SolverPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
      <div className="max-w-2xl">
        <p className="font-display text-sm font-bold tracking-wide text-cube-orange uppercase">
          The solver
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Solve my cube
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Two ways in: photograph or paint your 3×3's stickers and get a real
          computed solution, or paste the scramble string from your timer app
          for any cube from 2×2 to 5×5. Every solution is verified against the
          puzzle engine before you see it.
        </p>
      </div>

      {/* State solver */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          From a photo or by hand — 3×3
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          No scramble string needed: enter your cube exactly as it looks. Tap
          📷 on each face to fill it from a photo (then fix any sticker the
          camera got wrong), or paint the stickers directly. The solver
          computes a fresh solution for that exact state — usually around 20
          moves.
        </p>
        <div className="mt-5">
          <StateSolver />
        </div>
      </section>

      {/* Scramble solver */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          From a scramble string — 2×2 to 5×5
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          If a timer app scrambled you, its scramble string is a complete
          record of your cube's state — paste it and follow the exact undo. If
          you've made moves since, add them below the scramble and the
          solution accounts for them too.
        </p>
        <div className="mt-5">
          <ScrambleSolver />
        </div>
      </section>

      {/* Honest limits */}
      <section className="mt-14 max-w-2xl rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-base font-bold tracking-tight">
          Why no photo solver for the 4×4?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Honest answer: computing a solution for an <em>arbitrary</em> 4×4 state is a
          server-grade search problem — its state space is about 7×10⁴⁵, and no
          in-browser engine can crack it. What always works: keep the scramble
          string (every timer shows one) and use the tool above — or better,
          learn{" "}
          <Link to="/puzzles/4x4" className="font-semibold text-cube-orange hover:underline">
            the 4×4 reduction method
          </Link>
          , which needs exactly three algorithms beyond your 3×3 skills. For
          the 3×3, the photo solver is the real deal.
        </p>
      </section>
    </div>
  );
}
