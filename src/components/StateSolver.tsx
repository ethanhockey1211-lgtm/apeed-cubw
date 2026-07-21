import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TwistyCube from "./TwistyCube";
import AlgNotation from "./AlgNotation";
import {
  type Facelets,
  applyMovesToFacelets,
  solvedFacelets,
} from "../lib/facelets3x3";
import { applyMoves4, solvedFacelets4 } from "../lib/faceletsNxN";

/** WCA sticker colors, indexed like the face order [U, L, F, R, B, D]. */
const COLOR_HEX = ["#f5f5f5", "#ff5800", "#009b48", "#b71234", "#0046ad", "#ffd500"];
const COLOR_NAMES = ["white", "orange", "green", "red", "blue", "yellow"];
const FACE_LABELS = ["Up", "Left", "Front", "Right", "Back", "Down"];

const EXAMPLES: Record<number, string> = {
  3: "F R' D2 L U' B2 D R2 F' L2 U2 B D' R U F2 L' D B2 U'",
  4: "R U' F2 Rw2 D' B R' Uw F' L2 Uw' R2 D Fw2 U' Rw B2 D2 Fw R2",
};

/** Classify a sampled RGB pixel to one of the six sticker colors. */
function classify(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  if (sat < 0.28 && max > 90) return 0; // white
  let hue = 0;
  const d = max - min || 1;
  if (max === r) hue = ((g - b) / d + 6) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue *= 60;
  if (hue >= 340 || hue < 12) return 3; // red
  if (hue < 45) return 1; // orange
  if (hue < 75) return 5; // yellow
  if (hue < 170) return 2; // green
  if (hue < 270) return 4; // blue
  return 3;
}

interface SolveResult {
  solution: string;
  moveCount: number;
}

// 3x3 solver assets, loaded once.
let engine3Promise: Promise<{
  kpuzzle: import("cubing/kpuzzle").KPuzzle;
  faceletsToPattern: typeof import("../lib/facelets3x3").faceletsToPattern;
  solve: (p: import("cubing/kpuzzle").KPattern) => Promise<{ toString(): string }>;
}> | null = null;
function loadEngine3() {
  engine3Promise ??= (async () => {
    const [{ cube3x3x3 }, { experimentalSolve3x3x3IgnoringCenters }, lib] = await Promise.all([
      import("cubing/puzzles"),
      import("cubing/search"),
      import("../lib/facelets3x3"),
    ]);
    const kpuzzle = await cube3x3x3.kpuzzle();
    await lib.initFaceletEngine(kpuzzle);
    return { kpuzzle, faceletsToPattern: lib.faceletsToPattern, solve: experimentalSolve3x3x3IgnoringCenters };
  })();
  return engine3Promise;
}

function FaceGrid({
  n,
  face,
  facelets,
  lockCenter,
  onPaint,
  onPhoto,
}: {
  n: number;
  face: number;
  facelets: Facelets;
  lockCenter: boolean;
  onPaint: (face: number, cell: number) => void;
  onPhoto: (face: number, file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const locked = (cell: number) => lockCenter && n === 3 && cell === 4;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold tracking-wide text-faint uppercase">
          {FACE_LABELS[face]}
        </span>
        <button
          type="button"
          title={`Fill the ${FACE_LABELS[face]} face from a photo`}
          aria-label={`Fill the ${FACE_LABELS[face]} face from a photo`}
          onClick={() => fileRef.current?.click()}
          className="rounded px-1 text-xs text-faint transition-colors hover:text-ink"
        >
          📷
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPhoto(face, file);
            e.target.value = "";
          }}
        />
      </div>
      <div className={`grid gap-0.5 rounded-md bg-black/40 p-0.5 ${n === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
        {facelets[face].map((color, cell) => (
          <button
            key={cell}
            type="button"
            disabled={locked(cell)}
            onClick={() => onPaint(face, cell)}
            aria-label={`${FACE_LABELS[face]} sticker ${cell + 1}: ${COLOR_NAMES[color]}${locked(cell) ? " (center, fixed)" : ""}`}
            className={`rounded-[3px] transition-transform ${n === 3 ? "h-6 w-6 sm:h-7 sm:w-7" : "h-5 w-5 sm:h-6 sm:w-6"} ${
              locked(cell) ? "cursor-default opacity-90" : "hover:scale-110 active:scale-95"
            }`}
            style={{ backgroundColor: COLOR_HEX[color] }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Paint (or photograph) your real cube's stickers and get a genuine computed
 * solution — the two-phase solver for 3x3, the TNoodle three-phase engine
 * plus a verified 3x3 finish for 4x4. Every solution is machine-checked
 * before it is shown.
 */
export default function StateSolver() {
  const [n, setN] = useState<3 | 4>(4);
  const [facelets, setFacelets] = useState<Facelets>(() => solvedFacelets4());
  const [selected, setSelected] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SolveResult | null>(null);
  const [activeMove, setActiveMove] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = (size: 3 | 4) => {
    setN(size);
    setFacelets(size === 3 ? solvedFacelets() : solvedFacelets4());
    setResult(null);
    setErrors([]);
  };

  const paint = (face: number, cell: number) => {
    setResult(null);
    setErrors([]);
    setFacelets((f) => f.map((row, fi) => (fi === face ? row.map((c, ci) => (ci === cell ? selected : c)) : row)));
  };

  const photo = (face: number, file: File) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 300;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      const grid = size * 0.62;
      const start = (size - grid) / 2;
      const next = facelets.map((r) => r.slice());
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          const cell = row * n + col;
          if (n === 3 && cell === 4) continue; // 3x3 center defines the face
          const cx = Math.round(start + (col + 0.5) * (grid / n));
          const cy = Math.round(start + (row + 0.5) * (grid / n));
          const d = ctx.getImageData(cx - 4, cy - 4, 9, 9).data;
          let r = 0, g = 0, b = 0, cnt = 0;
          for (let i = 0; i < d.length; i += 4) {
            r += d[i]; g += d[i + 1]; b += d[i + 2]; cnt++;
          }
          next[face][cell] = classify(r / cnt, g / cnt, b / cnt);
        }
      }
      setFacelets(next);
      setResult(null);
      setErrors([]);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  };

  const solve = async () => {
    setBusy(true);
    setErrors([]);
    setResult(null);
    setCopied(false);
    try {
      if (n === 3) {
        const { kpuzzle, faceletsToPattern, solve: run } = await loadEngine3();
        const built = faceletsToPattern(kpuzzle, facelets);
        if (!built.ok || !built.pattern) {
          setErrors(built.errors);
          return;
        }
        const solution = (await run(built.pattern)).toString();
        const after = built.pattern.applyAlg(solution);
        const solved = ["EDGES", "CORNERS"].every((orbitName) => {
          const o = after.patternData[orbitName];
          return o.pieces.every((p: number, i: number) => p === i && o.orientation[i] === 0);
        });
        if (!solved) {
          setErrors(["The solver returned an unusable solution — please report this state."]);
          return;
        }
        setResult({ solution, moveCount: solution.split(/\s+/).filter(Boolean).length });
      } else {
        const { solve4x4 } = await import("../lib/solver4x4");
        const res = await solve4x4(facelets);
        if (!res.ok || !res.solution) {
          setErrors(res.errors);
          return;
        }
        setResult({ solution: res.solution, moveCount: res.moveCount ?? 0 });
      }
      setActiveMove(null);
    } catch {
      setErrors(["The solver failed to load. Check your connection and try again."]);
    } finally {
      setBusy(false);
    }
  };

  const loadExample = () => {
    setFacelets(
      n === 3
        ? applyMovesToFacelets(solvedFacelets(), EXAMPLES[3])
        : applyMoves4(solvedFacelets4(), EXAMPLES[4]),
    );
    setResult(null);
    setErrors([]);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid lg:grid-cols-[1fr_auto]">
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex gap-2">
            {([4, 3] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => reset(size)}
                aria-pressed={n === size}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  n === size
                    ? "border-transparent bg-ink text-bg"
                    : "border-line text-muted hover:border-line-strong hover:text-ink"
                }`}
              >
                {size}×{size}
              </button>
            ))}
          </div>
          {/* Net */}
          <div className="grid w-fit grid-cols-4 gap-2">
            <div />
            <FaceGrid n={n} face={0} facelets={facelets} lockCenter onPaint={paint} onPhoto={photo} />
            <div />
            <div />
            {[1, 2, 3, 4].map((face) => (
              <FaceGrid key={face} n={n} face={face} facelets={facelets} lockCenter onPaint={paint} onPhoto={photo} />
            ))}
            <div />
            <FaceGrid n={n} face={5} facelets={facelets} lockCenter onPaint={paint} onPhoto={photo} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line p-5 sm:p-6 lg:w-72 lg:border-t-0 lg:border-l">
          <div>
            <p className="text-xs font-bold tracking-wide text-faint uppercase">Paint color</p>
            <div className="mt-2 flex gap-1.5">
              {COLOR_HEX.map((hex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(i)}
                  aria-label={`Paint with ${COLOR_NAMES[i]}`}
                  aria-pressed={selected === i}
                  className={`h-8 w-8 rounded-lg transition-transform hover:scale-110 ${
                    selected === i ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-faint">
            {n === 3 ? (
              <>
                Hold your cube <strong className="text-muted">white on top, green facing you</strong>{" "}
                and copy each face — or tap 📷 on a face and photograph it
                straight-on. Fix any wrong sticker by tapping it. Centers are
                fixed; they define each face.
              </>
            ) : (
              <>
                Hold your 4×4 any way you like and <strong className="text-muted">keep that grip</strong>{" "}
                while you copy all six sides (tilt, don't re-grip). Tap 📷 per
                face to fill from a photo, then fix any sticker the camera got
                wrong. On a 4×4 even centers move, so every sticker is
                paintable.
              </>
            )}
          </p>
          <div className="mt-auto flex flex-wrap gap-2">
            <button
              type="button"
              onClick={solve}
              disabled={busy}
              className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? "Solving…" : "Solve this cube →"}
            </button>
            <button
              type="button"
              onClick={() => reset(n)}
              className="rounded-xl border border-line px-4 py-2.5 text-xs font-bold text-muted transition-colors hover:bg-surface-2"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={loadExample}
              className="text-xs font-semibold text-faint transition-colors hover:text-muted"
            >
              Load an example
            </button>
          </div>
          {errors.length > 0 && (
            <ul className="space-y-1">
              {errors.map((e) => (
                <li key={e} className="text-xs font-semibold text-cube-red">
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-line"
          >
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col items-center justify-center bg-surface-2/40 p-5">
                <p className="mb-1 text-[10px] font-bold tracking-wide text-faint uppercase">
                  Your cube — play to watch it solve
                </p>
                <div className="aspect-square w-full max-w-[280px]">
                  <TwistyCube
                    key={result.solution}
                    puzzle={n === 3 ? "3x3x3" : "4x4x4"}
                    alg={result.solution}
                    setupAnchor="end"
                    tempo={1.2}
                    label="Your painted cube and its computed solution"
                    onMoveIndex={setActiveMove}
                    className="h-full"
                  />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-bold tracking-tight">
                    Computed solution
                    <span className="ml-2 text-sm font-semibold text-faint tabular-nums">
                      {result.moveCount} moves
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(result.solution);
                        setCopied(true);
                      } catch {
                        // clipboard unavailable — solution stays on screen
                      }
                    }}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-surface-2"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </div>
                <div className="mt-3 max-h-56 overflow-y-auto rounded-xl bg-surface-2/70 px-4 py-3">
                  <AlgNotation alg={result.solution} activeIndex={activeMove} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  A genuine computed solution, machine-verified before display.
                  Hold your cube exactly as you painted it and follow along —{" "}
                  <span className="font-mono">x y z</span> tokens mean “turn the whole cube”, and the
                  current move lights up as the animation plays.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
