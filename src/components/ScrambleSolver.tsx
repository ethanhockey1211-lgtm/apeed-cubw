import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TwistyCube from "./TwistyCube";
import AlgNotation from "./AlgNotation";

const PUZZLES = [
  { id: "4x4x4", label: "4×4" },
  { id: "3x3x3", label: "3×3" },
  { id: "2x2x2", label: "2×2" },
  { id: "5x5x5", label: "5×5" },
];

const EXAMPLES: Record<string, string> = {
  "4x4x4": "R U' F2 Rw2 D' B R' Uw F' L2 Uw' R2 D Fw2 U' Rw B2 D2 Fw R2",
  "3x3x3": "F R' D2 L U' B2 D R2 F' L2 U2 B D' R U F2 L' D B2 U'",
  "2x2x2": "R U' F2 R' U F' R2 U' F R U2",
  "5x5x5": "Rw U2 3Fw' D Lw2 B' Uw R' 3Uw2 F Dw' L2 Bw U' Rw2 D2 Fw' R Uw2 B2",
};

interface Result {
  puzzle: string;
  scramble: string;
  solution: string;
  moveCount: number;
}

/**
 * Paste the scramble your timer app gave you → see your exact cube in 3D and
 * an animated, guaranteed-correct solution (the scramble retraced in
 * reverse). Correct by construction: scramble followed by solution is the
 * identity, so the final state is provably solved.
 */
export default function ScrambleSolver() {
  const [puzzle, setPuzzle] = useState("4x4x4");
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [activeMove, setActiveMove] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const solve = async () => {
    setError(null);
    setCopied(false);
    const scrambleRaw = input.trim().replace(/[()\n]/g, " ");
    const attemptsRaw = attempts.trim().replace(/[()\n]/g, " ");
    if (!scrambleRaw) {
      setError("Paste the scramble first — it's the move sequence your timer app showed you.");
      return;
    }
    const raw = attemptsRaw ? `${scrambleRaw} ${attemptsRaw}` : scrambleRaw;
    const moves = raw.split(/\s+/).filter(Boolean);
    // The cubing.js parser accepts arbitrary custom move names, so gate on a
    // strict NxN token whitelist first: R, U', Fw2, 2R, 3Uw2, x, M'…
    const TOKEN = /^([0-9]{1,2})?([URFDLB]w?|[urfdlb]|[MESxyz])[0-9]?'?$/;
    const bad = moves.find((m) => !TOKEN.test(m));
    if (bad) {
      setError(`“${bad}” isn't a cube move. Moves look like R, U', Fw2, Rw, 2R…`);
      return;
    }
    if (moves.length === 0 || moves.length > 200) {
      setError("That doesn't look like a scramble (expected 1–200 moves).");
      return;
    }
    try {
      const { Alg } = await import("cubing/alg");
      const alg = Alg.fromString(raw);
      const solution = alg.invert().toString();
      setResult({ puzzle, scramble: alg.toString(), solution, moveCount: moves.length });
      setActiveMove(null);
    } catch {
      setError(
        "Couldn't read that as cube notation. Check for typos — moves look like R, U', Fw2, Rw, 2R…",
      );
    }
  };

  const copy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.solution);
      setCopied(true);
    } catch {
      // clipboard unavailable — the solution is still on screen
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted">Puzzle:</span>
          {PUZZLES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPuzzle(p.id);
                setResult(null);
              }}
              aria-pressed={puzzle === p.id}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                puzzle === p.id
                  ? "border-transparent bg-ink text-bg"
                  : "border-line text-muted hover:border-line-strong hover:text-ink"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          rows={3}
          placeholder="Paste your scramble here, e.g.  R U' F2 Rw2 D' B R' Uw F' …"
          aria-label="Scramble input"
          className="mt-3 w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 font-mono text-sm placeholder:text-faint focus:border-line-strong focus:outline-none"
        />
        <textarea
          value={attempts}
          onChange={(e) => {
            setAttempts(e.target.value);
            setResult(null);
          }}
          rows={1}
          placeholder="Optional: moves you've made since scrambling (they'll be undone too)"
          aria-label="Moves made after the scramble"
          className="mt-2 w-full resize-y rounded-xl border border-line bg-bg px-4 py-2.5 font-mono text-sm placeholder:text-faint focus:border-line-strong focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={solve}
            className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Solve my cube →
          </button>
          <button
            type="button"
            onClick={() => setInput(EXAMPLES[puzzle] ?? "")}
            className="text-xs font-semibold text-faint transition-colors hover:text-muted"
          >
            Try an example scramble
          </button>
          {error && <p className="w-full text-sm font-semibold text-cube-red">{error}</p>}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-faint">
          Works with any scramble string from a timer app (csTimer, Twisty
          Timer, cubing contests…). Scramble your <em>solved</em> cube with those
          exact moves holding <strong className="text-muted">white on top, green facing you</strong> —
          then follow the solution below in the same grip and it will end solved,
          guaranteed. Tried to solve it and made things worse? Type those moves
          in the second box — the solution will unwind them too.
        </p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col items-center justify-center bg-surface-2/40 p-5">
                <p className="mb-1 text-[10px] font-bold tracking-wide text-faint uppercase">
                  Your cube right now — play to watch it solve
                </p>
                <div className="aspect-square w-full max-w-[300px]">
                  <TwistyCube
                    key={result.scramble + result.puzzle}
                    puzzle={result.puzzle}
                    alg={result.solution}
                    setupAlg={result.scramble}
                    setupAnchor="start"
                    tempo={1.5}
                    label="Your scrambled cube and its solution"
                    onMoveIndex={setActiveMove}
                    className="h-full"
                  />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    Your solution
                    <span className="ml-2 text-sm font-semibold text-faint tabular-nums">
                      {result.moveCount} moves
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={copy}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-surface-2"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <div className="mt-3 max-h-56 overflow-y-auto rounded-xl bg-surface-2/70 px-4 py-3">
                  <AlgNotation alg={result.solution} activeIndex={activeMove} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  This retraces your scramble in reverse, so it's{" "}
                  <strong className="text-ink/80">guaranteed correct</strong> — after the last move
                  your cube is solved, no exceptions. Use the step buttons under
                  the cube to go one move at a time; the current move lights up
                  in the notation.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
