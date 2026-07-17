import TwistyCube from "./TwistyCube";
import LazyMount from "./LazyMount";
import type { NotationMove } from "../data/learn";

/**
 * One tile in the notation school: a move name, a cube that performs the move
 * when tapped, and a one-line description of what to watch for.
 */
export default function MoveDemo({ move }: { move: NotationMove }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-line bg-surface p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.45)]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-2xl font-bold tracking-tight">{move.move}</span>
        <span className="text-xs font-semibold text-faint">{move.label}</span>
      </div>
      <div className="mx-auto my-1.5 aspect-square w-full max-w-[150px]">
        <LazyMount className="h-full w-full">
          <TwistyCube
            alg={move.move}
            setupAlg="z2"
            setupAnchor="start"
            controls={false}
            replayOnClick
            tempo={0.6}
            hintFacelets="none"
            cameraLatitude={30}
            label={`Tap to see the move ${move.move}`}
            className="h-full"
          />
        </LazyMount>
      </div>
      <p className="text-xs leading-relaxed text-muted">{move.hint}</p>
      <p className="mt-1.5 text-[10px] font-semibold tracking-wide text-faint uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Tap the cube to play
      </p>
    </div>
  );
}
