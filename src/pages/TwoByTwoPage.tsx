import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import { twoOllCases, twoPblCases, twoByTwoIds } from "../data/puzzles";
import { useProgress } from "../lib/progress";

export default function TwoByTwoPage() {
  const { countLearned } = useProgress();

  return (
    <LessonShell
      kicker="Puzzles · 2×2"
      title="The 2×2, in one sitting"
      lede="A 2×2 is a 3×3 with the edges and centers removed — which means there is no cross, no F2L, and no edge algorithms. Three steps: build the bottom layer by eye, orient the top with an OLL you already know, then swap the last corners. If you've started the CFOP path, you can learn this today."
      accent="green"
      progress={{ learned: countLearned(twoByTwoIds), total: twoByTwoIds.length }}
      backTo="/puzzles"
      backLabel="All puzzles"
      next={{
        to: "/puzzles/4x4",
        label: "Next puzzle: the 4×4",
        blurb: "Bigger, but with a twist you'll like: halfway through, it literally turns into a 3×3.",
      }}
    >
      {/* Step 1 */}
      <section className="mt-10 max-w-2xl">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          <span className="mr-2 text-cube-green">Step 1</span> Bottom layer, by eye
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Pick a color (white, say) and solve those four corners so their side
          colors match each other — exactly like the first-layer corners of a
          3×3, minus the edges to work around. No algorithm: find a white
          corner, put it over where it belongs, and insert it with the same{" "}
          <span className="font-mono text-ink/90">R U R'</span>-style motions you use in F2L. With
          only eight pieces on the whole puzzle, this step takes most people
          about ten minutes to figure out from scratch.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mt-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            <span className="mr-2 text-cube-green">Step 2</span> Make the top one color
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            These are the seven corner-orientation cases — the same seven you
            meet in 2-Look OLL, minus the edges. If you've learned Sune there,
            you already have money in the bank here. Count the top-color
            stickers facing up (0, 1 or 2) and match the pattern.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {twoOllCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="green" puzzle="2x2x2" />
          ))}
        </div>
      </section>

      {/* Step 3 */}
      <section className="mt-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            <span className="mr-2 text-cube-green">Step 3</span> Swap the last corners
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The top face is one color — now fix the sides. Turn the top layer
            and look for a matching pair of side stickers: found one? Adjacent
            swap. None anywhere? Diagonal. Both algorithms are PLLs straight
            off your 3×3.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
          {twoPblCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="green" puzzle="2x2x2" />
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-faint">
          Sometimes the top layer is already correct after step 2 — turn it
          until everything lines up and enjoy the free solve. That's about 1 in
          6.
        </p>
      </section>
    </LessonShell>
  );
}
