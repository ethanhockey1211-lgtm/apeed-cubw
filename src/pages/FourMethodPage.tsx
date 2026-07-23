import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import GuidedSolve from "../components/GuidedSolve";
import TwistyCube from "../components/TwistyCube";
import LazyMount from "../components/LazyMount";
import { fourCases, beginnerInsertCases, l2cCases, guided4x4, CENTERS_MASK_4 } from "../data/puzzles";
import { EO_MASK, eoCases, intuitionById, ocllCases, tlPllCornerCases, tlPllEdgeCases } from "../data/learn";
import { sectionById } from "../data/sections";
import { useProgress } from "../lib/progress";

const pairingCases = fourCases.filter((c) => c.group === "pairing");
const parityCases = fourCases.filter((c) => c.group === "parity");

/** Every tracked algorithm in the full method, in learning order. */
export const fullMethodIds = [
  ...l2cCases.map((c) => c.id),
  ...pairingCases.map((c) => c.id),
  ...beginnerInsertCases.map((c) => c.id),
  ...eoCases.map((c) => c.id),
  ...ocllCases.map((c) => c.id),
  ...tlPllCornerCases.map((c) => c.id),
  ...tlPllEdgeCases.map((c) => c.id),
  ...parityCases.map((c) => c.id),
];

function StageHeader({ n, title, blurb }: { n: number; title: string; blurb: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl"
    >
      <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
        <span className="mr-2 text-cube-orange">Stage {n}</span> {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{blurb}</p>
    </motion.div>
  );
}

function GuidedBlock({ caseId }: { caseId: string }) {
  const g = guided4x4.find((x) => x.caseId === caseId);
  if (!g) return null;
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
    >
      <div className="mb-4 max-w-2xl">
        <p className="font-display text-sm font-bold text-cube-orange">Watch with reasoning</p>
        <h3 className="mt-0.5 font-display text-lg font-bold tracking-tight">{g.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{g.story}</p>
      </div>
      <GuidedSolve
        phases={g.phases}
        puzzle="4x4x4"
        setupAlg="z2"
        accent="orange"
        label={`Guided 4x4 walkthrough: ${g.title}`}
      />
    </motion.article>
  );
}

function TechniqueDemo({ label, alg, note }: { label: string; alg: string; note: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-surface p-4">
      <p className="font-display text-sm font-bold tracking-tight">{label}</p>
      <p className="mt-0.5 font-mono text-xs text-cube-orange">{alg}</p>
      <div className="mx-auto my-2 aspect-square w-full max-w-[170px]">
        <LazyMount className="h-full w-full">
          <TwistyCube
            alg={alg}
            puzzle="4x4x4"
            setupAlg="z2"
            setupAnchor="start"
            controls={false}
            replayOnClick
            tempo={0.7}
            hintFacelets="none"
            label={`Technique demo: ${label}`}
            className="h-full"
          />
        </LazyMount>
      </div>
      <p className="text-xs leading-relaxed text-muted">{note}</p>
      <p className="mt-1.5 text-center text-[10px] font-semibold tracking-wide text-faint uppercase">
        Tap the cube to replay
      </p>
    </div>
  );
}

export default function FourMethodPage() {
  const { countLearned } = useProgress();
  const oll = sectionById.oll;
  const pll = sectionById.pll;
  const f2l = sectionById.f2l;

  return (
    <LessonShell
      kicker="Puzzles · 4×4 · Complete walkthrough"
      title="The full 4×4 beginner method"
      lede="Every stage and every algorithm needed to solve a 4×4 from scratch, in order, on real cubes — nothing referenced elsewhere, nothing missing. Sixteen of these algorithms are shared with the 3×3 beginner path, so ticking them off here fills your progress there too."
      accent="orange"
      progress={{ learned: countLearned(fullMethodIds), total: fullMethodIds.length }}
      backTo="/puzzles/4x4"
      backLabel="4×4 overview"
      next={{
        to: "/solver",
        label: "Stuck mid-solve?",
        blurb: "Paint your cube into the solver and get a computed way out — then come back and finish learning the method.",
      }}
    >
      {/* Stage 1 */}
      <section className="mt-12">
        <StageHeader
          n={1}
          title="Centers — intuitive"
          blurb="Build the six 2×2 center blocks: white first, yellow opposite it, then the sides in the right order (white bottom + green front means red on the right, blue at the back, orange on the left — check any solved 3×3). No cases to memorize; these two motions do all the work."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <TechniqueDemo
            label="Join & store"
            alg="Rw U Rw'"
            note="Lift a center piece up to merge with a matching one, and park the pair in the top layer while you hunt for more."
          />
          <TechniqueDemo
            label="Insert a pair"
            alg="Rw U2 Rw'"
            note="Drop a finished pair into its face. The wide turn gives back what it borrowed, so completed centers survive."
          />
        </div>
        <div className="mt-8 max-w-2xl">
          <h3 className="font-display text-lg font-bold tracking-tight">
            Last two centers — the three cases
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            The final two faces can't borrow from anywhere, so they become real
            cases. Everything else on these cubes is grayed out — only centers
            matter here, and each algorithm is machine-verified to change{" "}
            <em>only</em> its two target faces' centers.
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {l2cCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="orange" puzzle="4x4x4" stickeringMask={CENTERS_MASK_4} />
          ))}
        </div>
      </section>

      {/* Stage 2 */}
      <section className="mt-14">
        <StageHeader
          n={2}
          title="Edge pairing — one technique, two algorithms"
          blurb="Each edge exists as two halves; reunite all twelve. The routine: line the two halves up on the front-left and front-right, join them with a slice (Uw'), store the finished pair in the top layer, undo the slice (Uw). When a half sits backwards, or only two edges remain, the algorithms below take over."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {pairingCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="orange" puzzle="4x4x4" />
          ))}
        </div>
        <div className="mt-5 space-y-5">
          <GuidedBlock caseId="4x4-edge-flip" />
          <GuidedBlock caseId="4x4-l2e" />
        </div>
      </section>

      {/* Stage 3 */}
      <section className="mt-14">
        <StageHeader
          n={3}
          title="Cross — intuitive"
          blurb="From here the 4×4 behaves as a 3×3: turn only the outer faces. Build the white cross on the bottom exactly like on a 3×3 — four edge pairs around the white centers, planned before you turn. The cross lesson teaches this skill in depth."
        />
        <Link
          to="/cross"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface"
        >
          The cross, with guided examples →
        </Link>
      </section>

      {/* Stage 4 */}
      <section className="mt-14">
        <StageHeader
          n={4}
          title="First two layers"
          blurb="Place the four white corners with simple R U R' U' repetitions, then insert the middle edges with these two classics — or skip both and learn intuitive F2L, which is faster and pays off forever."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:max-w-3xl">
          {beginnerInsertCases.map((c) => (
            <AlgCard
              key={c.id}
              algCase={c}
              accent="orange"
              stickering={f2l.stickering}
              stickeringMask={f2l.stickeringMask}
            />
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-xs leading-relaxed text-faint">
          Ready to outgrow these?{" "}
          <Link to="/learn/f2l-basics" className="font-semibold text-cube-orange hover:underline">
            Intuitive F2L
          </Link>{" "}
          replaces this whole stage with reasoning.
        </p>
      </section>

      {/* Stage 5 */}
      <section className="mt-14">
        <StageHeader
          n={5}
          title="2-Look OLL — make the top yellow (10 algorithms)"
          blurb="Look one: get the yellow cross using the edge cases (corners are grayed out — they don't matter yet). Look two: orient the corners by counting how many yellows already face up."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eoCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="yellow" stickeringMask={EO_MASK} intuition={intuitionById[c.id]} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ocllCases.map((c) => (
            <AlgCard
              key={c.id}
              algCase={c}
              accent="yellow"
              stickering={oll.stickering}
              stickeringMask={oll.stickeringMask}
              intuition={intuitionById[c.id]}
            />
          ))}
        </div>
      </section>

      {/* Stage 6 */}
      <section className="mt-14">
        <StageHeader
          n={6}
          title="2-Look PLL — finish the solve (6 algorithms)"
          blurb="Corners first: find headlights and face them left (T perm), or no headlights anywhere (Y perm). Then the edges: one of four cycles ends the solve."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:max-w-3xl">
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
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Stage 7 */}
      <section className="mt-14">
        <StageHeader
          n={7}
          title="Parity — the 4×4's two curveballs"
          blurb="Sometimes the reduced cube shows a state that's impossible on a real 3×3. That's not a mistake — it's parity, and each kind has exactly one fix. Bonus recognition: if the very end looks like two swapped corners, that's PLL parity in disguise — run its algorithm, then a normal T perm."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {parityCases.map((c) => (
            <AlgCard key={c.id} algCase={c} accent="orange" puzzle="4x4x4" />
          ))}
        </div>
        <div className="mt-5 space-y-5">
          <GuidedBlock caseId="4x4-oll-parity" />
          <GuidedBlock caseId="4x4-pll-parity" />
        </div>
      </section>
    </LessonShell>
  );
}
