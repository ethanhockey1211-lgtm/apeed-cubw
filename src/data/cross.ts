export interface CrossPrinciple {
  title: string;
  body: string;
}

/**
 * Stickering mask for the white-bottom display frame: the white cross edges
 * (model-U pieces, shown at the bottom after the z2 setup) stay regular, the
 * white center stays bright, other centers are dimmed for reference, and
 * everything else is ignored. The built-in "Cross" stickering can't be used
 * here — it marks the model-D (yellow) pieces.
 */
export const WHITE_CROSS_MASK =
  "EDGES:----IIIIIIII,CORNERS:IIIIIIII,CENTERS:-DDDDD";

import type { SolvePhase } from "../lib/types";

export interface CrossLesson {
  title: string;
  explanation: string;
  /** Applied as the setup, after z2 (so white ends up on the bottom) */
  scramble: string;
  /** The cross solution the player animates */
  solution: string;
  /**
   * The solution broken into reasoning chunks. Grounded in the per-move
   * progress report from scripts/verify-algs.mjs (solved-edge counts after
   * every move), and the concatenation is verified to equal `solution`.
   */
  phases: SolvePhase[];
}

export const crossPrinciples: CrossPrinciple[] = [
  {
    title: "White on the bottom, always",
    body: "Solve the cross on the bottom from day one. It feels harder for a week, but it lets you start F2L without rotating the cube — and lookahead is everything.",
  },
  {
    title: "Eight moves, guaranteed",
    body: "Every cross can be solved in 8 moves or fewer. If your solution runs long, stop and look for a shorter path instead of pushing through.",
  },
  {
    title: "Take what the cube gives you",
    body: "Don't solve edges in a fixed order. Start with the edge that's cheapest, and hunt for moves that set up two edges at once.",
  },
  {
    title: "Place edges relative to each other",
    body: "Edges only need to be correct relative to one another — blue next to red, green opposite blue. Build the cross anywhere, then align it with a single D turn.",
  },
];

/**
 * Each lesson's scramble is built as (cross-preserving noise) + (inverse of
 * the solution), so the displayed solve is genuine by construction. All are
 * additionally checked by scripts/verify-algs.mjs.
 */
export const crossLessons: CrossLesson[] = [
  {
    title: "Two edges, two moves",
    explanation:
      "Two cross edges sit directly below their slots — each needs a single half turn. See both before you start turning: plan first, then execute.",
    scramble: "R U R' F U2 F' F2 R2",
    solution: "R2 F2",
    phases: [
      { moves: "R2", intent: "The right-side edge is lined up with its slot — one half turn drives it straight home. Third edge solved." },
      { moves: "F2", intent: "Same story on the front face. Two moves, cross done." },
    ],
  },
  {
    title: "The sideways sticker",
    explanation:
      "A white sticker facing sideways can't be solved with one face turn. Feed it into the bottom with the face it's stuck on, then restore.",
    scramble: "L U L' U2 F2 U' F",
    solution: "F' U F2",
    phases: [
      { moves: "F'", intent: "The white sticker points sideways, so no single turn can plant it white-down. First, turn the face it's stuck on to swing it up to the top layer." },
      { moves: "U", intent: "Carry it across the top until it hovers over the one empty slot. Notice nothing gets solved here — these are positioning moves." },
      { moves: "F2", intent: "Now it's a top-layer edge like any other: half turn, straight down, done." },
    ],
  },
  {
    title: "Top layer first",
    explanation:
      "Edges sitting in the top layer are the easiest to read: line the white sticker over its slot, then push it down. Two of them here — pick the cheaper one first.",
    scramble: "F U F' R U2 R' D F' R' U",
    solution: "U' R F D'",
    phases: [
      { moves: "U'", intent: "Line the first top-layer edge up above the bottom layer spot it's heading for." },
      { moves: "R F", intent: "Push it down — then the second top edge is already lined up, so push that one down too. Still zero edges 'solved'… watch the finish." },
      { moves: "D'", intent: "The edges were placed correctly relative to each other, just twisted as a group. One bottom turn aligns everything: all four click in at once." },
    ],
  },
  {
    title: "Two at once",
    explanation:
      "The best cross solutions overlap: here one bottom turn collects two edges at once. Look for these 2-for-1 moves during inspection — they're what makes sub-8-move crosses possible.",
    scramble: "R U2 R' U F2 L D L'",
    solution: "L D' L' F2",
    phases: [
      { moves: "L", intent: "A sacrifice: this temporarily breaks the one solved edge — but it stages a second edge on the left face." },
      { moves: "D'", intent: "The payoff: one bottom turn and two edges click in at the same time." },
      { moves: "L'", intent: "Give back what you borrowed — the sacrificed edge returns home. Three solved." },
      { moves: "F2", intent: "And the last one drops straight in." },
    ],
  },
  {
    title: "Working around a solved edge",
    explanation:
      "One edge is already home. Solve the rest without breaking it — or if breaking it saves moves, restore it on the way back, like the D2 here.",
    scramble: "L U' L' F U F' D2 R' F R D'",
    solution: "D R' F' R D2",
    phases: [
      { moves: "D", intent: "Tuck the already-placed edge out of the firing line so the next turns can't hurt it." },
      { moves: "R' F' R", intent: "Feed two more edges down into the bottom layer, then give back the borrowed right face. Nothing looks solved yet — it's all relative placement." },
      { moves: "D2", intent: "Swing the bottom back around: every edge lines up with its center at once. This is why you place edges relative to each other." },
    ],
  },
  {
    title: "A full 6-move cross",
    explanation:
      "A realistic inspection-time read: nothing is free, every edge needs work. Step through slowly and watch how no move undoes an earlier one — that's the mark of an efficient cross.",
    scramble: "R U R' F2 U R2 D R F",
    solution: "F' R' D' R2 U' F2",
    phases: [
      { moves: "F' R'", intent: "Two setup turns that aim two different white stickers toward the bottom at once." },
      { moves: "D'", intent: "The bottom turn collects them both — two edges in with one move." },
      { moves: "R2", intent: "Third edge drives straight down." },
      { moves: "U' F2", intent: "Line the last edge up across the top, then push it home. Six moves, no wasted turns." },
    ],
  },
];
