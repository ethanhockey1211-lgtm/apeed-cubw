import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import { intuitionById, tlPllCornerCases, tlPllEdgeCases, twoLookPllIds } from "../data/learn";
import { sectionById } from "../data/sections";
import { useProgress } from "../lib/progress";

export default function TwoLookPllPage() {
  const { countLearned, isLearned } = useProgress();
  const pll = sectionById.pll;
  const learned = countLearned(twoLookPllIds);
  const complete = learned === twoLookPllIds.length;

  return (
    <LessonShell
      kicker="Stage 5 · 2-Look PLL"
      title="Finish every solve"
      lede="The top face is yellow — now the pieces slide into place. Six algorithms cover it: two sort the corners, four sort the edges. These six are all genuine PLL algorithms, so they count toward the full set of 21 forever."
      accent="red"
      progress={{ learned, total: twoLookPllIds.length }}
      next={{
        to: "/pll",
        label: "Stage 6: full PLL",
        blurb:
          "When 2-look feels automatic, start collapsing it: 15 more algorithms let you skip the first look entirely. It's the biggest speed jump available to you.",
      }}
    >
      {/* Look 1 */}
      <section className="mt-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            <span className="mr-2 text-cube-red">Look 1</span> Permute the corners
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Look for <strong className="text-ink/90">headlights</strong>: two corner stickers of the
            same color on one side. Found a pair? Face them <em>left</em> and do the T
            perm. No headlights anywhere means the corners are swapped
            diagonally — that's the Y perm, from any angle. (Ignore what the
            edges look like during this step; both algorithms shuffle them, and
            look 2 cleans that up.)
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
          {tlPllCornerCases.map((c) => (
            <AlgCard
              key={c.id}
              algCase={c}
              accent="red"
              stickering={pll.stickering}
              stickeringMask={pll.stickeringMask}
              intuition={intuitionById[c.id]}
            />
          ))}
        </div>
      </section>

      {/* Look 2 */}
      <section className="mt-14">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            <span className="mr-2 text-cube-red">Look 2</span> Permute the edges
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Corners solved — only edges left, and there are just four
            possibilities: three edges cycling one way (Ua), the other way
            (Ub), opposite edges trading (H), or adjacent edges trading (Z).
            All four run on M and U moves only, so they share the same
            fingertrick. Then align the top and enjoy the click.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tlPllEdgeCases.map((c) => (
            <AlgCard
              key={c.id}
              algCase={c}
              accent="red"
              stickering={pll.stickering}
              stickeringMask={pll.stickeringMask}
              intuition={intuitionById[c.id]}
            />
          ))}
        </div>
      </section>

      {/* Milestone */}
      <div
        className={`mt-12 rounded-2xl border p-6 text-center sm:p-8 ${
          complete ? "border-cube-green/40 bg-cube-green/10" : "border-line bg-surface"
        }`}
      >
        {complete ? (
          <>
            <h2 className="font-display text-2xl font-bold tracking-tight text-cube-green">
              That's it. You solve with CFOP. 🎉
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
              Cross, F2L, 2-look OLL, 2-look PLL — a complete, legitimate CFOP
              solve, the same structure the world record uses. Everything from
              here is speed: drill recognition with the quizzes, then start
              stage 6 whenever you're hungry for more.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-display text-xl font-bold tracking-tight">
              Six algorithms from a full CFOP solve
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
              Mark each one learned as it becomes automatic. When all six are
              green, you've officially graduated from beginner method — and{" "}
              {isLearned("pll-t") ? "you already know the T perm." : "the T perm is the classic place to start."}
            </p>
          </>
        )}
      </div>
    </LessonShell>
  );
}
