import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LessonShell from "../components/LessonShell";
import TwistyCube from "../components/TwistyCube";
import LazyMount from "../components/LazyMount";

const stages = [
  {
    title: "The star",
    body: "Your cross, with five arms: solve the five edges around one face. Same relative-placement thinking, one more edge.",
  },
  {
    title: "First layer + second layer",
    body: "Corner-edge pairs into slots — it IS F2L. Every insert you learned on the 3×3 works verbatim; there are simply more slots to fill.",
  },
  {
    title: "The middle zone",
    body: "More layers of the same: place edges, build pairs, slot them. Nothing new is happening — this is where the puzzle quietly teaches you lookahead.",
  },
  {
    title: "Last layer, in stages",
    body: "Five edges and five corners. Do it like your first 3×3 solves: orient edges, place edges, place corners, orient corners — one stage at a time, using the 3×3-style triggers you know (Sune-like motions do Sune-like things here too).",
  },
];

export default function MegaminxPage() {
  return (
    <LessonShell
      kicker="Puzzles · Megaminx"
      title="Megaminx: big, not hard"
      lede="Twelve faces, fifty movable pieces — and almost nothing new to learn. A megaminx is solved with 3×3 thinking stretched over more territory: star instead of cross, F2L pairs everywhere, and a patient last layer. It's a marathon, not a boss fight."
      accent="red"
      backTo="/puzzles"
      backLabel="All puzzles"
      next={{
        to: "/learn",
        label: "Sharpen the fundamentals",
        blurb:
          "Every stage here leans on 3×3 skills — the guided path is where those get built. The better your F2L, the better your megaminx.",
      }}
    >
      <div className="mt-10 grid items-start gap-6 md:grid-cols-[1fr_320px]">
        <ol className="space-y-4">
          {stages.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex gap-4 rounded-2xl border border-line bg-surface p-5"
            >
              <span className="font-display text-sm font-bold text-cube-red">0{i + 1}</span>
              <div>
                <h2 className="font-display text-base font-bold tracking-tight">{s.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="mx-auto aspect-square w-full max-w-[280px]">
            <LazyMount className="h-full w-full">
              <TwistyCube
                alg=""
                puzzle="megaminx"
                controls={false}
                hintFacelets="none"
                label="A megaminx — drag to explore all twelve faces"
                className="h-full"
              />
            </LazyMount>
          </div>
          <p className="mt-2 text-center text-xs text-faint">
            Drag it around — twelve faces, six colors twice… no wait, twelve
            colors. It's friendlier than it looks.
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-2xl rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-base font-bold tracking-tight">Honest advice</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Don't buy algorithm sheets for megaminx until you can finish a solve
          slowly without them. The beginner path is genuinely intuitive right up
          to the final corners, and the skill it builds —{" "}
          <Link to="/learn/f2l-basics" className="font-semibold text-cube-red hover:underline">
            pair building
          </Link>{" "}
          on unfamiliar geometry — is exactly what makes you faster on the 3×3
          too.
        </p>
      </div>
    </LessonShell>
  );
}
