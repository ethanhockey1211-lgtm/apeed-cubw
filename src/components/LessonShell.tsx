import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { accents } from "../lib/accents";
import type { AccentColor } from "../lib/types";

interface LessonShellProps {
  kicker: string;
  title: string;
  lede: string;
  accent: AccentColor;
  /** Tracked progress chip, e.g. 4/10 algs */
  progress?: { learned: number; total: number };
  children: React.ReactNode;
  next?: { to: string; label: string; blurb: string };
  backTo?: string;
  backLabel?: string;
}

/**
 * Shared frame for guided-path lesson pages: back link, header, progress
 * chip, and a “next stage” card at the bottom.
 */
export default function LessonShell({
  kicker,
  title,
  lede,
  accent,
  progress,
  children,
  next,
  backTo = "/learn",
  backLabel = "Guided path",
}: LessonShellProps) {
  const a = accents[accent];
  const pct = progress && progress.total > 0 ? (progress.learned / progress.total) * 100 : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-faint transition-colors hover:text-muted"
      >
        <span aria-hidden>←</span> {backLabel}
      </Link>

      <div className="mt-4 max-w-2xl">
        <p className={`font-display text-sm font-bold tracking-wide uppercase ${a.text}`}>{kicker}</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{lede}</p>
      </div>

      {progress && progress.total > 0 && (
        <div className="mt-6 max-w-2xl">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold">
              {progress.learned}/{progress.total} learned
            </span>
            <span className="font-mono text-xs text-faint tabular-nums">{Math.round(pct)}%</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-valuenow={progress.learned}
            aria-valuemin={0}
            aria-valuemax={progress.total}
          >
            <motion.div
              className={`h-full rounded-full ${a.bg}`}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
            />
          </div>
        </div>
      )}

      {children}

      {next && (
        <div className="mt-14 rounded-2xl border border-line bg-surface p-6 text-center sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-tight">{next.label}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">{next.blurb}</p>
          <Link
            to={next.to}
            className="group mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-bg transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            Continue
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
