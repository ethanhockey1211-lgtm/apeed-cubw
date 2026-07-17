import { motion } from "framer-motion";
import { useProgress } from "../lib/progress";

/**
 * Big “mark this lesson done” pill for stages that track a single manual id
 * (notation, cross) rather than a set of algorithm cases.
 */
export default function MarkLearnedButton({
  id,
  doneLabel,
  todoLabel,
}: {
  id: string;
  doneLabel: string;
  todoLabel: string;
}) {
  const { isLearned, toggle } = useProgress();
  const done = isLearned(id);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      onClick={() => toggle(id)}
      className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
        done
          ? "border-cube-green/50 bg-cube-green/15 text-cube-green"
          : "border-line-strong text-ink hover:bg-surface"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
          done ? "border-cube-green bg-cube-green text-white dark:text-black" : "border-faint"
        }`}
      >
        {done && (
          <motion.svg
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </motion.svg>
        )}
      </span>
      {done ? doneLabel : todoLabel}
    </button>
  );
}
