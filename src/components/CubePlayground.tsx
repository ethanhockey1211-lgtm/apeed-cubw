import { useEffect, useRef, useState } from "react";
import type { TwistyPlayer } from "cubing/twisty";
import { useTheme } from "../lib/theme";
import { invertMoves } from "../lib/moves";

const MOVE_ROWS: string[][] = [
  ["U", "R", "L", "F", "D", "B", "M"],
  ["U'", "R'", "L'", "F'", "D'", "B'", "M'"],
];

interface CubePlaygroundProps {
  /** Extra setup applied after z2 — e.g. a case scramble to practice against */
  setup?: string;
  /** Optional mask (e.g. gray out the last layer while practicing F2L) */
  stickeringMask?: string;
  className?: string;
}

/**
 * A cube you can actually turn: every move is a button, nothing can break,
 * Reset is always one tap away. Experimenting is how intuition forms —
 * watching alone doesn't do it.
 */
export default function CubePlayground({
  setup = "",
  stickeringMask,
  className = "",
}: CubePlaygroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);
  const historyRef = useRef<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    let cancelled = false;
    let player: TwistyPlayer | null = null;

    import("cubing/twisty").then(({ TwistyPlayer: Player }) => {
      if (cancelled || !mountRef.current) return;
      player = new Player({
        puzzle: "3x3x3",
        alg: "",
        experimentalSetupAlg: `z2 ${setup}`.trim(),
        ...(stickeringMask ? { experimentalStickeringMaskOrbits: stickeringMask } : {}),
        background: "none",
        controlPanel: "none",
        hintFacelets: "floating",
        tempoScale: 2.5,
      });
      player.colorScheme = themeRef.current;
      playerRef.current = player;
      mountRef.current.replaceChildren(player);
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
      player?.remove();
    };
  }, [setup, stickeringMask]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) player.colorScheme = theme;
  }, [theme]);

  const doMove = (m: string) => {
    const player = playerRef.current;
    if (!player) return;
    try {
      player.experimentalAddMove(m);
      historyRef.current.push(m);
      setMoveCount(historyRef.current.length);
    } catch {
      // ignore — a move while the player is still booting is harmless
    }
  };

  const undo = () => {
    const player = playerRef.current;
    const last = historyRef.current.pop();
    if (!player || !last) return;
    try {
      player.experimentalAddMove(invertMoves(last));
    } catch {
      historyRef.current.push(last);
    }
    setMoveCount(historyRef.current.length);
  };

  const reset = () => {
    const player = playerRef.current;
    if (!player) return;
    player.alg = "";
    historyRef.current = [];
    setMoveCount(0);
  };

  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-surface ${className}`}>
      <div className="grid md:grid-cols-2">
        <div className="flex items-center justify-center bg-surface-2/40 p-4">
          <div
            ref={mountRef}
            role="img"
            aria-label="Practice cube — use the move buttons to turn it"
            className="aspect-square w-full max-w-[280px] cursor-grab active:cursor-grabbing"
          />
        </div>
        <div className="flex flex-col justify-center gap-2.5 p-4 sm:p-6">
          {MOVE_ROWS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7 gap-1.5">
              {row.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => doMove(m)}
                  className="rounded-lg border border-line bg-surface py-2 font-mono text-sm font-bold transition-all duration-100 hover:border-line-strong hover:bg-surface-2 active:scale-90"
                >
                  {m}
                </button>
              ))}
            </div>
          ))}
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={moveCount === 0}
              className="rounded-lg border border-line px-4 py-2 text-xs font-bold text-muted transition-colors hover:bg-surface-2 disabled:opacity-40"
            >
              ↩ Undo
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-line px-4 py-2 text-xs font-bold text-muted transition-colors hover:bg-surface-2"
            >
              Reset
            </button>
            <span className="ml-auto font-mono text-xs text-faint tabular-nums">
              {moveCount} move{moveCount === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-faint">
            Tap moves and watch what they do — you can't break anything. Drag the
            cube itself to look at it from another angle.
          </p>
        </div>
      </div>
    </div>
  );
}
