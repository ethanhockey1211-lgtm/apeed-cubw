import { useState } from "react";
import { motion } from "framer-motion";
import LessonShell from "../components/LessonShell";
import MoveDemo from "../components/MoveDemo";
import TwistyCube from "../components/TwistyCube";
import AlgNotation from "../components/AlgNotation";
import MarkLearnedButton from "../components/MarkLearnedButton";
import CubePlayground from "../components/CubePlayground";
import { notationGroups, SEXY_MOVE } from "../data/learn";

export default function NotationPage() {
  const [activeMove, setActiveMove] = useState<number | null>(null);

  return (
    <LessonShell
      kicker="Stage 1 · The language"
      title="Cube notation"
      lede="Every algorithm in speedcubing is written in the same tiny language: a letter names a layer, an apostrophe reverses it, a 2 doubles it. Twenty minutes here and you can read anything this site — or any other — throws at you."
      accent="green"
      next={{
        to: "/cross",
        label: "Stage 2: the cross",
        blurb:
          "Now that you can read moves, learn the one CFOP step that doesn't need them written down: four edges, solved on intuition.",
      }}
    >
      {/* Orientation convention */}
      <div className="mt-10 rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold tracking-tight">
          First: how you hold the cube
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Notation is always relative to <em>your</em> point of view — R is
          whatever face is on your right when the move happens. On this site,
          cubes are shown the way speedcubers hold them: <strong className="text-ink/90">white on the
          bottom, yellow on top</strong>. Hold yours the same way and every animation
          will match your hands.
        </p>
      </div>

      {/* Move families */}
      {notationGroups.map((group, gi) => (
        <section key={group.id} className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="mb-4 max-w-2xl"
          >
            <h2 className="font-display text-xl font-bold tracking-tight">
              <span className="mr-2 text-sm font-bold text-faint">0{gi + 1}</span>
              {group.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{group.blurb}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {group.moves.map((m) => (
              <MoveDemo key={m.move} move={m} />
            ))}
          </div>
        </section>
      ))}

      {/* First algorithm walkthrough */}
      <section className="mt-14 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="grid md:grid-cols-2">
          <div className="p-6 sm:p-8">
            <p className="font-display text-sm font-bold tracking-wide text-cube-orange uppercase">
              Put it together
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
              Your first algorithm
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Cubers call this the <strong className="text-ink/90">sexy move</strong> — the most common
              four moves in all of speedcubing. Press play and follow along; the
              moving token lights up in the notation.
            </p>
            <div className="mt-4 rounded-xl bg-surface-2/70 px-4 py-3">
              <AlgNotation alg={SEXY_MOVE.alg} activeIndex={activeMove} />
            </div>
            <ul className="mt-4 space-y-2">
              {SEXY_MOVE.steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span
                    className={`w-8 shrink-0 rounded px-1 py-0.5 text-center font-mono text-xs font-bold transition-colors duration-100 ${
                      activeMove === i ? "bg-cube-yellow/25 text-ink" : "bg-surface-2 text-muted"
                    }`}
                  >
                    {s.move}
                  </span>
                  <span className="text-muted">{s.meaning}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-faint">
              Party trick: repeat it six times and the cube returns to where it
              started. That's why algorithms work — every sequence has a cycle.
            </p>
          </div>
          <div className="flex items-center justify-center bg-surface-2/40 p-6">
            <div className="aspect-square w-full max-w-[300px]">
              <TwistyCube
                alg={SEXY_MOVE.alg}
                setupAlg="z2"
                setupAnchor="start"
                tempo={0.8}
                onMoveIndex={setActiveMove}
                label="The sexy move R U R' U' animated"
                className="h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Free play */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          Free play — drive it yourself
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Reading about moves isn't knowing them. Tap buttons, watch layers
          turn, guess what a move will do <em>before</em> pressing it. Try: what does{" "}
          <span className="font-mono text-ink/90">R U R' U'</span> six times in a row do?
        </p>
        <CubePlayground className="mt-5" />
      </section>

      {/* Mark done */}
      <div className="mt-12 text-center">
        <p className="mb-4 text-sm text-muted">
          Can you read <span className="font-mono text-ink/90">R U R' U' R' F R F'</span> without
          looking anything up? Then you're ready.
        </p>
        <MarkLearnedButton
          id="lesson-notation"
          todoLabel="I can read notation — mark stage 1 done"
          doneLabel="Stage 1 complete"
        />
      </div>
    </LessonShell>
  );
}
