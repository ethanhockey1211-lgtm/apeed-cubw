import { useCallback, useSyncExternalStore } from "react";

const KEY = "cubeflow-progress-v1";
const EVENT = "cubeflow-progress-changed";

let cache: Set<string> | null = null;
let cacheSnapshot: string[] = [];

function load(): Set<string> {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    cache = new Set();
  }
  cacheSnapshot = [...cache];
  return cache;
}

function persist(next: Set<string>) {
  cache = next;
  cacheSnapshot = [...next];
  try {
    localStorage.setItem(KEY, JSON.stringify(cacheSnapshot));
  } catch {
    // storage full or unavailable — progress just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string[] {
  load();
  return cacheSnapshot;
}

/** Reactive set of learned case ids, shared across the whole app. */
export function useProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isLearned = useCallback(
    (id: string) => snapshot.includes(id),
    [snapshot],
  );

  const toggle = useCallback((id: string) => {
    const next = new Set(load());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persist(next);
  }, []);

  const countLearned = useCallback(
    (ids: string[]) => ids.filter((id) => snapshot.includes(id)).length,
    [snapshot],
  );

  const reset = useCallback((ids?: string[]) => {
    if (!ids) {
      persist(new Set());
      return;
    }
    const next = new Set(load());
    for (const id of ids) next.delete(id);
    persist(next);
  }, []);

  return { isLearned, toggle, countLearned, reset };
}
