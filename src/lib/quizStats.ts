/**
 * Per-case quiz history in localStorage. Not reactive on purpose — it's only
 * read when picking the next quiz case, so a plain read-through cache is
 * enough.
 */
const KEY = "cubeflow-quiz-stats-v1";

export interface CaseStat {
  seen: number;
  missed: number;
}

let cache: Record<string, CaseStat> | null = null;

function load(): Record<string, CaseStat> {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, CaseStat>;
  } catch {
    cache = {};
  }
  return cache;
}

export function recordAnswer(id: string, missed: boolean) {
  const stats = load();
  const s = stats[id] ?? { seen: 0, missed: 0 };
  stats[id] = { seen: s.seen + 1, missed: s.missed + (missed ? 1 : 0) };
  try {
    localStorage.setItem(KEY, JSON.stringify(stats));
  } catch {
    // stats just won't persist
  }
}

/**
 * Sampling weight for a case: everything starts equal, unlearned cases show
 * up more, and cases you've missed show up a lot more.
 */
export function caseWeight(id: string, learned: boolean): number {
  const s = load()[id];
  const missRate = s && s.seen > 0 ? s.missed / s.seen : 0;
  return 1 + (learned ? 0 : 1) + 3 * missRate;
}
