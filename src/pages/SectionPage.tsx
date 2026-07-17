import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AlgCard from "../components/AlgCard";
import QuizMode from "../components/QuizMode";
import { accents } from "../lib/accents";
import type { Difficulty, SectionDef } from "../lib/types";
import { useProgress } from "../lib/progress";

const difficulties: { value: Difficulty | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function SectionPage({ section }: { section: SectionDef }) {
  const { countLearned } = useProgress();
  const [tab, setTab] = useState<"learn" | "quiz">("learn");
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const accent = accents[section.accent];

  const allIds = useMemo(() => section.cases.map((c) => c.id), [section]);
  const learned = countLearned(allIds);
  const pct = allIds.length ? (learned / allIds.length) * 100 : 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return section.cases.filter((c) => {
      if (difficulty !== "all" && c.difficulty !== difficulty) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.nickname ?? "").toLowerCase().includes(q) ||
        c.alg.toLowerCase().includes(q) ||
        (c.altAlgs ?? []).some((a) => a.toLowerCase().includes(q)) ||
        c.recognition.toLowerCase().includes(q) ||
        c.difficulty.includes(q)
      );
    });
  }, [section.cases, query, difficulty]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
      {/* Header */}
      <div className="max-w-2xl">
        <p className={`font-display text-sm font-bold tracking-wide uppercase ${accent.text}`}>
          Step {section.step} · {section.fullName}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {section.name}
          <span className="ml-3 align-middle text-base font-semibold text-faint">
            {section.cases.length} cases
          </span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{section.description}</p>
      </div>

      {/* Progress */}
      <div className="mt-6 max-w-2xl">
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold">
            {section.name}: {learned}/{section.cases.length} learned
          </span>
          <span className="font-mono text-xs text-faint tabular-nums">{Math.round(pct)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={learned} aria-valuemin={0} aria-valuemax={section.cases.length}>
          <motion.div
            className={`h-full rounded-full ${accent.bg}`}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
          />
        </div>
      </div>

      {/* Tabs + filters */}
      <div className="sticky top-14 z-30 -mx-4 mt-8 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-line bg-surface p-1" role="tablist" aria-label="Section mode">
            {(["learn", "quiz"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`relative rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                  tab === t ? "text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId={`tab-bg-${section.id}`}
                    className="absolute inset-0 rounded-lg bg-ink"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative">{t === "learn" ? "Learn" : "Quiz"}</span>
              </button>
            ))}
          </div>

          {tab === "learn" && (
            <>
              <div className="relative min-w-0 flex-1 basis-52">
                <svg
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-faint"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${section.name} by name or notation…`}
                  aria-label={`Search ${section.name} cases`}
                  className="w-full rounded-xl border border-line bg-surface py-2 pr-3 pl-9 text-sm placeholder:text-faint focus:border-line-strong focus:outline-none"
                />
              </div>
              <div className="flex gap-1.5" role="group" aria-label="Filter by difficulty">
                {difficulties.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    aria-pressed={difficulty === d.value}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      difficulty === d.value
                        ? "border-transparent bg-ink text-bg"
                        : "border-line text-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="pt-8">
        {tab === "quiz" ? (
          <QuizMode section={section} />
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center text-sm text-muted"
              >
                No cases match “{query}”. Try a name like “T Perm” or notation like “R U R'”.
              </motion.p>
            ) : (
              section.groups.map((group) => {
                const groupCases = filtered.filter((c) => c.group === group.id);
                if (groupCases.length === 0) return null;
                const groupLearned = countLearned(groupCases.map((c) => c.id));
                return (
                  <section key={group.id} className="mb-12">
                    <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="font-display text-xl font-bold tracking-tight">{group.name}</h2>
                      <span className="text-xs font-semibold text-faint tabular-nums">
                        {groupLearned}/{groupCases.length}
                      </span>
                      {group.description && (
                        <p className="w-full text-sm text-muted sm:w-auto">{group.description}</p>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {groupCases.map((c) => (
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
                );
              })
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
