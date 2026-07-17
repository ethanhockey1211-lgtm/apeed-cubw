import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import TwistyCube from "../components/TwistyCube";
import LazyMount from "../components/LazyMount";
import { f2lBasicIds } from "../data/learn";
import { sectionById } from "../data/sections";
import { f2lCases } from "../data/f2l";
import { useProgress } from "../lib/progress";

const ideas = [
  {
    title: "Corner + edge = a pair",
    body: "Every slot needs one white corner and its matching edge. Solved separately that's ~16 moves; joined on the top layer and inserted together, it's 7 or fewer.",
  },
  {
    title: "The top layer is free",
    body: "U turns never break your cross or finished slots. Everything else (R, F…) must be undone. That's the grammar of F2L: borrow a layer, use the free top, give it back.",
  },
  {
    title: "Every case reduces to basic",
    body: "There are 41 positions a pair can be in, but you never memorize them: a couple of setup moves turns any of them into one of the four basic inserts below.",
  },
];

const rules = [
  "Solve the cross on the bottom and keep it there — no rotations to “check” it.",
  "Find both pieces of a pair before you touch the cube. Chasing one piece at a time is where seconds die.",
  "Bring each case to the front-right slot with U turns, not cube rotations, whenever you can.",
  "Go slow on purpose. Smooth, pause-free F2L at 50% speed beats jerky bursts every time.",
];

export default function F2LBasicsPage() {
  const { countLearned } = useProgress();
  const section = sectionById.f2l;
  const basics = f2lBasicIds
    .map((id) => f2lCases.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const example = f2lCases.find((c) => c.id === "f2l-5");

  return (
    <LessonShell
      kicker="Stage 3 · Intuitive F2L"
      title="F2L, understood"
      lede="First Two Layers is where CFOP stops being memorization and starts being a skill. You don't learn 41 algorithms today — you learn one idea and four tiny inserts, and derive the rest with your own hands."
      accent="blue"
      progress={{ learned: countLearned(f2lBasicIds), total: f2lBasicIds.length }}
      next={{
        to: "/learn/2-look-oll",
        label: "Stage 4: 2-Look OLL",
        blurb:
          "Cross plus four F2L pairs leaves only the last layer. Ten algorithms make the whole top yellow — in two quick looks.",
      }}
    >
      {/* The idea */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {ideas.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-2xl border border-line bg-surface p-5"
          >
            <span className="font-display text-sm font-bold text-cube-blue">0{i + 1}</span>
            <h3 className="mt-1 font-display text-base font-bold tracking-tight">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
          </motion.div>
        ))}
      </div>

      {/* The four basic inserts */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          The four basic inserts
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          These are the four ways a ready pair drops into its slot. Learn them
          as <em>motions</em>, not letter sequences — watch the pair travel, then do it
          on your cube until your fingers know it. Mark each one learned when it
          feels automatic.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {basics.map((c) => (
            <AlgCard
              key={c.id}
              algCase={c}
              accent={section.accent}
              stickering={section.stickering}
              stickeringMask={section.stickeringMask}
            />
          ))}
        </div>
      </section>

      {/* Derivation example */}
      {example && (
        <section className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="grid md:grid-cols-2">
            <div className="p-6 sm:p-8">
              <p className="font-display text-sm font-bold tracking-wide text-cube-blue uppercase">
                See the reduction
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                A “new” case that isn't
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Here the pair starts split: corner at the front-right, edge at
                the back. Watch the first two moves — they don't insert anything,
                they just <em>set up</em>: pull the corner out of the way and bring the
                edge around. By move three you're looking at a basic insert you
                already know.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                That's the whole trick to intuitive F2L. Ask: <em>what's stopping
                this pair from being basic?</em> Fix that with the free top layer, then
                insert. Step through it move by move and find the moment it
                becomes case #1.
              </p>
              <div className="mt-4 rounded-xl bg-surface-2/70 px-4 py-3">
                <p className="font-mono text-sm">{example.alg}</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-surface-2/40 p-6">
              <div className="aspect-square w-full max-w-[300px]">
                <LazyMount className="h-full w-full">
                  <TwistyCube
                    alg={example.alg}
                    setupAlg="z2"
                    stickeringMask={section.stickeringMask}
                    tempo={0.8}
                    label="An F2L case reducing to a basic insert"
                    className="h-full"
                  />
                </LazyMount>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Golden rules */}
      <section className="mt-14 max-w-2xl">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          The rules that make it fast
        </h2>
        <ul className="mt-4 space-y-3">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
              <span className="font-display font-bold text-cube-blue">{i + 1}</span>
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-muted">
          Practice with slow solves for a week or two. When a particular pair
          keeps fighting you, look up just that case in{" "}
          <Link to="/f2l" className="font-semibold text-cube-blue hover:underline">
            the full F2L library
          </Link>{" "}
          — that's what it's for. You don't need it all today.
        </p>
      </section>
    </LessonShell>
  );
}
