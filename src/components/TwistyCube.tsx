import { useEffect, useRef, useState } from "react";
import type { TwistyPlayer } from "cubing/twisty";
import { useTheme } from "../lib/theme";

export interface TwistyCubeHandle {
  player: TwistyPlayer | null;
}

interface TwistyCubeProps {
  alg: string;
  /** "end" (default) treats the alg end as solved, so the start shows the case */
  setupAnchor?: "start" | "end";
  setupAlg?: string;
  stickering?: string;
  /** Custom mask (experimentalStickeringMaskOrbits) — overrides `stickering` */
  stickeringMask?: string;
  /** Show the custom playback control bar */
  controls?: boolean;
  tempo?: number;
  cameraLatitude?: number;
  cameraLongitude?: number;
  cameraDistance?: number;
  hintFacelets?: "floating" | "none";
  backView?: "none" | "side-by-side" | "top-right";
  /** Loop the animation forever (used on the landing hero) */
  loop?: boolean;
  /** Fired when playback reaches the solved (end) state */
  onSolved?: () => void;
  /** Fired at move boundaries: index of the move being animated, or null when idle */
  onMoveIndex?: (index: number | null) => void;
  className?: string;
  /** Accessible label for the cube region */
  label?: string;
}

function IconButton({
  onClick,
  title,
  children,
  emphasized = false,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  emphasized?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={
        emphasized
          ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-bg transition-transform duration-150 hover:scale-110 active:scale-95"
          : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-ink active:scale-95"
      }
    >
      {children}
    </button>
  );
}

export default function TwistyCube({
  alg,
  setupAnchor = "end",
  setupAlg,
  stickering = "full",
  stickeringMask,
  controls = true,
  tempo = 1,
  cameraLatitude,
  cameraLongitude,
  cameraDistance,
  hintFacelets = "floating",
  backView = "none",
  loop = false,
  onSolved,
  onMoveIndex,
  className = "",
  label,
}: TwistyCubeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const wasPlayingRef = useRef(false);
  const onSolvedRef = useRef(onSolved);
  onSolvedRef.current = onSolved;
  const onMoveIndexRef = useRef(onMoveIndex);
  onMoveIndexRef.current = onMoveIndex;
  const lastMoveIndexRef = useRef<number | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    let player: TwistyPlayer | null = null;

    // Dynamic import keeps cubing (three.js included) out of the initial bundle.
    import("cubing/twisty").then(({ TwistyPlayer: Player }) => {
      if (cancelled || !mountRef.current) return;
      player = new Player({
        puzzle: "3x3x3",
        alg,
        experimentalSetupAnchor: setupAnchor,
        ...(setupAlg ? { experimentalSetupAlg: setupAlg } : {}),
        ...(stickeringMask
          ? { experimentalStickeringMaskOrbits: stickeringMask }
          : { experimentalStickering: stickering as never }),
        background: "none",
        controlPanel: "none",
        hintFacelets,
        backView,
        tempoScale: tempo,
        ...(cameraLatitude !== undefined ? { cameraLatitude } : {}),
        ...(cameraLongitude !== undefined ? { cameraLongitude } : {}),
        ...(cameraDistance !== undefined ? { cameraDistance } : {}),
      });
      playerRef.current = player;
      mountRef.current.replaceChildren(player);

      try {
        const model = player.experimentalModel;
        model.playingInfo.addFreshListener(({ playing: p }) => {
          if (cancelled) return;
          setPlaying(p);
          if (p) wasPlayingRef.current = true;
        });
        model.detailedTimelineInfo.addFreshListener(({ atEnd: end }) => {
          if (cancelled) return;
          setAtEnd(end);
          if (end && wasPlayingRef.current) {
            wasPlayingRef.current = false;
            onSolvedRef.current?.();
          }
        });
        model.currentMoveInfo.addFreshListener((info) => {
          if (cancelled || !onMoveIndexRef.current) return;
          const moving = info.currentMoves.length > 0;
          const index = moving ? info.patternIndex : null;
          if (index !== lastMoveIndexRef.current) {
            lastMoveIndexRef.current = index;
            onMoveIndexRef.current(index);
          }
        });
      } catch {
        // Model listeners are a nice-to-have; playback still works without them.
      }

      if (loop) {
        try {
          player.controller.animationController.play({ loop: true });
        } catch {
          player.play();
        }
      }
    });

    return () => {
      cancelled = true;
      playerRef.current = null;
      player?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alg, setupAlg, setupAnchor, stickering, stickeringMask, loop]);

  // Keep the player's own color scheme in sync with the app theme.
  useEffect(() => {
    const player = playerRef.current;
    if (player) player.colorScheme = theme;
  }, [theme, alg]);

  const step = (direction: 1 | -1) => {
    const player = playerRef.current;
    if (!player) return;
    try {
      player.controller.animationController.play({
        direction: direction as never,
        untilBoundary: "move" as never,
        autoSkipToOtherEndIfStartingAtBoundary: true,
      });
    } catch {
      // Fall back to full playback if the experimental API shifts.
      if (direction === 1) player.play();
      else player.jumpToStart();
    }
  };

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) {
      player.pause();
    } else {
      if (atEnd) player.jumpToStart();
      player.play();
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        ref={mountRef}
        role="img"
        aria-label={label ?? `3D cube animation for ${alg}`}
        className="min-h-0 w-full flex-1 cursor-grab active:cursor-grabbing"
      />
      {controls && (
        <div className="mt-1 flex items-center justify-center gap-1.5">
          <IconButton onClick={() => playerRef.current?.jumpToStart()} title="Back to case state">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 5h2v14H6zM20 5v14l-10-7z" />
            </svg>
          </IconButton>
          <IconButton onClick={() => step(-1)} title="Step backward">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M14 5v14l-8-7zM16 5h2v14h-2z" opacity="0" />
              <path d="M16 5v14l-9-7z" />
              <rect x="6" y="5" width="2" height="14" />
            </svg>
          </IconButton>
          <IconButton onClick={togglePlay} title={playing ? "Pause" : "Play solve"} emphasized>
            {playing ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </IconButton>
          <IconButton onClick={() => step(1)} title="Step forward">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l9-7z" />
              <rect x="16" y="5" width="2" height="14" />
            </svg>
          </IconButton>
          <IconButton onClick={() => playerRef.current?.jumpToEnd()} title="Skip to solved">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M4 5v14l10-7zM16 5h2v14h-2z" />
            </svg>
          </IconButton>
        </div>
      )}
    </div>
  );
}
