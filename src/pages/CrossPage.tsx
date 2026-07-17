import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TwistyCube from "../components/TwistyCube";
import LazyMount from "../components/LazyMount";
import MarkLearnedButton from "../components/MarkLearnedButton";
import { crossLessons, crossPrinciples, WHITE_CROSS_MASK } from "../data/cross";

export default function CrossPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
      <div className="max-w-2xl">
        <p className="font-display text-sm font-bold tracking-wide text-cube-white uppercase">
          Step 1 · The Cross
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Cross
          <span className="ml-3 align-middle text-base font-semibold text-faint">no algorithms</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          The cross is the only CFOP step with nothing to memorize. You place
          the four white edges around the white center — ideally in 8 moves or
          fewer, planned entirely during inspection. These principles and
          worked examples build that intuition.
        </p>
      </div>

      {/* Principles */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {crossPrinciples.map((p, i) => (
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

      {/* Worked examples */}
      <div className="mt-14">
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          Worked examples
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Each cube starts from a scramble. Press play to watch the cross
          solution, or step through it move by move — then try to see the
          solution yourself before playing it.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {crossLessons.map((lesson) => (
            <motion.article
              key={lesson.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="flex flex-col rounded-2xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.45)]"
            >
              <h3 className="font-display text-base font-bold tracking-tight">{lesson.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{lesson.explanation}</p>
              <div className="mx-auto my-2 aspect-square w-full max-w-[220px]">
                <LazyMount className="h-full w-full">
                  <TwistyCube
                    alg={lesson.solution}
                    setupAlg={`z2 ${lesson.scramble}`}
                    setupAnchor="start"
                    stickeringMask={WHITE_CROSS_MASK}
                    tempo={1}
                    label={`Cross example: ${lesson.title}`}
                    className="h-full"
                  />
                </LazyMount>
              </div>
              <div className="rounded-xl bg-surface-2/70 px-3 py-2.5">
                <p className="text-[10px] font-bold tracking-wide text-faint uppercase">Solution</p>
                <p className="mt-0.5 font-mono text-[13px] break-words">{lesson.solution}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Next step */}
      <div className="mt-14 rounded-2xl border border-line bg-surface p-6 text-center sm:p-8">
        <h2 className="font-display text-xl font-bold tracking-tight">Cross feeling smooth?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          When you can plan the whole cross during inspection and solve it in 8
          moves or fewer without looking twice, mark the stage done — then it's
          time to pair corners and edges.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <MarkLearnedButton
            id="lesson-cross"
            todoLabel="My cross is solid — mark stage 2 done"
            doneLabel="Stage 2 complete"
          />
          <Link
            to="/learn/f2l-basics"
            className="group inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-bg transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            Continue to intuitive F2L
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
