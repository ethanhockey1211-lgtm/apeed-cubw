import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LessonShell from "../components/LessonShell";
import AlgCard from "../components/AlgCard";
import GuidedSolve from "../components/GuidedSolve";
import CubePlayground from "../components/CubePlayground";
import { f2lBasicIds, guidedF2L } from "../data/learn";
import { sectionById } from "../data/sections";
import { f2lCases } from "../data/f2l";
import { invertMoves } from "../lib/moves";
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
  const [practiceCase, setPracticeCase] = useState<string | null>(null);
  const section = sectionById.f2l;
  const basics = f2lBasicIds
    .map((id) => f2lCases.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const practiceAlg = practiceCase
    ? f2lCases.find((c) => c.id === practiceCase)?.alg
    : undefined;

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

      {/* Guided solves with reasoning */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          Five solves that teach everything
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Every one of the 41 F2L positions is one of these five stories. Press
          play and follow the reasoning, not the letters — each chunk of moves
          lights up with <em>why</em> it happens. When a step is tagged{" "}
          <span className="rounded-full bg-cube-green/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-cube-green uppercase">
            a basic insert
          </span>{" "}
          that's not a figure of speech: it's move-for-move one of the four
          inserts above, verified by machine.
        </p>
        <div className="mt-6 space-y-5">
          {guidedF2L.map((g, i) => (
            <motion.article
              key={g.caseId}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
            >
              <div className="mb-4 max-w-2xl">
                <p className="font-display text-sm font-bold text-cube-blue">
                  Story {i + 1} of {guidedF2L.length}
                </p>
                <h3 className="mt-0.5 font-display text-lg font-bold tracking-tight">{g.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{g.story}</p>
              </div>
              <GuidedSolve
                phases={g.phases}
                setupAlg="z2"
                stickeringMask={section.stickeringMask}
                accent="blue"
                label={`Guided F2L solve: ${g.title}`}
              />
            </motion.article>
          ))}
        </div>
      </section>

      {/* Practice sandbox */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          Now you — no algorithms allowed
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Load one of the five cases and solve the pair with your own hands:
          find both pieces, ask what's blocking them, fix it, insert. Undo is
          free, resets are free, nothing can break. The last layer is grayed
          out on purpose — when no colored sticker is out of place, the pair is
          home. <em>Your</em> way counts even if it isn't the shortest.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPracticeCase(null)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
              practiceCase === null
                ? "border-transparent bg-ink text-bg"
                : "border-line text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            Free play
          </button>
          {guidedF2L.map((g) => (
            <button
              key={g.caseId}
              type="button"
              onClick={() => setPracticeCase(g.caseId)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                practiceCase === g.caseId
                  ? "border-transparent bg-ink text-bg"
                  : "border-line text-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {g.title}
            </button>
          ))}
        </div>
        <CubePlayground
          key={practiceCase ?? "free"}
          setup={practiceAlg ? invertMoves(practiceAlg) : ""}
          stickeringMask={practiceAlg ? section.stickeringMask : undefined}
          className="mt-4"
        />
      </section>

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
