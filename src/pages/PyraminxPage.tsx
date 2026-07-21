import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import { pyraCases, pyraminxIds } from "../data/puzzles";
import { useProgress } from "../lib/progress";

export default function PyraminxPage() {
  const { countLearned } = useProgress();

  return (
    <LessonShell
      kicker="Puzzles · Pyraminx"
      title="Pyraminx in an afternoon"
      lede="The friendliest puzzle at every competition. Four tips that are literally one turn each, one layer you can solve by looking at it, and three edges at the end with three short algorithms — one of which this site found by exhaustive computer search and verified to touch nothing else."
      accent="yellow"
      progress={{ learned: countLearned(pyraminxIds), total: pyraminxIds.length }}
      backTo="/puzzles"
      backLabel="All puzzles"
      next={{
        to: "/puzzles/megaminx",
        label: "Next puzzle: Megaminx",
        blurb: "Twelve faces that solve like one very long 3×3. Your instincts already work there.",
      }}
    >
      {/* Steps 1-2 */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold tracking-tight">
            <span className="mr-2 text-cube-yellow">Step 1</span> Tips &amp; centers
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The four tips are free: each one turns independently, so just twist
            it to match the face next to it (that's the lowercase{" "}
            <span className="font-mono text-ink/90">u l r b</span> moves). Then turn the big layers
            so the three center pieces around each tip match too. No cases, no
            memory — thirty seconds of looking.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold tracking-tight">
            <span className="mr-2 text-cube-yellow">Step 2</span> One face down
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Pick a color and solve that whole face, holding it on the bottom:
            three edges, placed one at a time. If an edge is stuck somewhere
            awkward, one turn frees it — with so few pieces, you can always see
            the path. This is the intuitive heart of the puzzle; give yourself
            ten unhurried minutes.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <section className="mt-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            <span className="mr-2 text-cube-yellow">Step 3</span> The last three edges
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Only the three top edges remain, and there are just two kinds of
            situation: they need to move around (cycle), or they're in place
            but flipped. Three algorithms cover it all.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pyraCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="yellow" puzzle="pyraminx" setupAlg="" />
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-faint">
          Mixed case (edges need to move <em>and</em> flip)? Cycle first, look again,
          then flip. Two algorithms back to back always finish it.
        </p>
      </section>
    </LessonShell>
  );
}
