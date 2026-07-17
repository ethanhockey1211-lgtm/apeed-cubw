import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import { EO_MASK, eoCases, ocllCases, twoLookOllIds } from "../data/learn";
import { sectionById } from "../data/sections";
import { useProgress } from "../lib/progress";

export default function TwoLookOllPage() {
  const { countLearned } = useProgress();
  const oll = sectionById.oll;

  return (
    <LessonShell
      kicker="Stage 4 · 2-Look OLL"
      title="Make the top yellow"
      lede="Full OLL is 57 algorithms. You don't need them yet. Ten algorithms, applied in two quick looks — edges first, then corners — handle every possible last layer. This is the set that gets you solving like a CFOP cuber this week."
      accent="yellow"
      progress={{ learned: countLearned(twoLookOllIds), total: twoLookOllIds.length }}
      next={{
        to: "/learn/2-look-pll",
        label: "Stage 5: 2-Look PLL",
        blurb:
          "The top is yellow — the pieces just aren't in the right spots. Six more algorithms finish every solve. This is the last stage of the core method.",
      }}
    >
      {/* Look 1 */}
      <section className="mt-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            <span className="mr-2 text-cube-yellow">Look 1</span> Orient the edges
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Ignore the corners completely — that's why they're grayed out on
            these cubes. Look only at the four yellow <em>edges</em>. There are
            exactly three things you can see: a line, an L, or nothing (the
            dot). Each has one short algorithm, and all three are the same
            sandwich: an F at the start, an F' at the end, friendly moves in
            between.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eoCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="yellow" stickeringMask={EO_MASK} />
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-faint">
          Already seeing a full yellow cross after F2L? Luck — about 1 solve in
          16. Skip straight to look 2.
        </p>
      </section>

      {/* Look 2 */}
      <section className="mt-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            <span className="mr-2 text-cube-yellow">Look 2</span> Orient the corners
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            With the yellow cross done, count the corners that already show
            yellow on top: it's always 0, 1 or 2 of a recognizable shape —
            seven cases total. Start with Sune and Anti-Sune; they're short,
            fast, and cover the two most common cases. And here's the good
            news: these seven are <em>real</em> OLL algorithms — every one you learn
            here is permanent progress toward the full set of 57.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ocllCases.map((c) => (
            <AlgCard
              key={c.id}
              algCase={c}
              accent="yellow"
              stickering={oll.stickering}
              stickeringMask={oll.stickeringMask}
            />
          ))}
        </div>
      </section>

      {/* Practice pointer */}
      <div className="mt-12 max-w-2xl rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h3 className="font-display text-base font-bold tracking-tight">How to drill these</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Do each new algorithm ten times slowly on your own cube before ever
          doing it fast. Then use the OLL section's quiz in{" "}
          <span className="font-semibold text-ink/90">“name the case”</span> mode — recognition,
          not execution, is what actually slows beginners down.
        </p>
      </div>
    </LessonShell>
  );
}
