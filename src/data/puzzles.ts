import type { AccentColor, AlgCase, SolvePhase } from "../lib/types";

/*
 * Beginner methods for the other WCA puzzles. Every algorithm here is
 * machine-verified by scripts/verify-algs.mjs against the real puzzle engines
 * (2x2, 4x4 and Pyraminx kpuzzles) — including the Pyraminx two-flip, which
 * was found by exhaustive search rather than copied from memory.
 */

export interface PuzzleDef {
  id: string;
  name: string;
  route: string;
  accent: AccentColor;
  /** cubing.js puzzle id for twisty players */
  puzzleId: string;
  tagline: string;
  blurb: string;
}

export const puzzleDefs: PuzzleDef[] = [
  {
    id: "2x2",
    name: "2×2",
    route: "/puzzles/2x2",
    accent: "green",
    puzzleId: "2x2x2",
    tagline: "A 3×3 with the training wheels off",
    blurb:
      "No edges, no centers, no cross — just corners. If you've started the CFOP path you already know every algorithm this puzzle needs.",
  },
  {
    id: "4x4",
    name: "4×4",
    route: "/puzzles/4x4",
    accent: "orange",
    puzzleId: "4x4x4",
    tagline: "Reduce it to a 3×3, then finish it like one",
    blurb:
      "Build the six centers, pair up the edges, and your 4×4 becomes a big 3×3 — plus two parity surprises with their own fixes. Includes a solver for scrambles from your timer app.",
  },
  {
    id: "pyraminx",
    name: "Pyraminx",
    route: "/puzzles/pyraminx",
    accent: "yellow",
    puzzleId: "pyraminx",
    tagline: "Solvable in an afternoon",
    blurb:
      "Four tips that are basically free, one intuitive layer, and three edges at the end. Three short algorithms cover everything.",
  },
  {
    id: "megaminx",
    name: "Megaminx",
    route: "/puzzles/megaminx",
    accent: "red",
    puzzleId: "megaminx",
    tagline: "Twelve faces, zero new ideas",
    blurb:
      "It looks intimidating and isn't: a megaminx is solved with your 3×3 instincts — star instead of cross, F2L pairs everywhere, and a last layer done in stages.",
  },
];

/* ——— 2×2 beginner method (bottom layer → OLL → top corners) ——— */

export const twoOllCases: AlgCase[] = [
  {
    id: "2x2-sune",
    name: "Sune",
    group: "oll",
    alg: "R U R' U R U2 R'",
    recognition:
      "Exactly one top corner shows the top color. Aim that corner at the front-left. Same Sune as your 3×3 — nothing new to learn.",
    difficulty: "easy",
  },
  {
    id: "2x2-antisune",
    name: "Anti-Sune",
    group: "oll",
    alg: "R U2 R' U' R U' R'",
    recognition:
      "One top corner done, but the others twist the other way — put the solved corner at the back-right. It's Sune's exact inverse.",
    difficulty: "easy",
  },
  {
    id: "2x2-h",
    name: "H",
    group: "oll",
    alg: "R2 U2 R U2 R2",
    recognition:
      "No top color showing on top, and both side pairs form headlight bars. Five moves — the shortest algorithm on this site.",
    difficulty: "easy",
  },
  {
    id: "2x2-pi",
    name: "Pi",
    group: "oll",
    alg: "R U2 R2 U' R2 U' R2 U2 R",
    recognition:
      "No top color on top, one pair of headlights facing left. Same Pi as 3×3 OLL 22.",
    difficulty: "medium",
  },
  {
    id: "2x2-headlights",
    name: "Headlights",
    group: "oll",
    alg: "R2 D' R U2 R' D R U2 R",
    recognition:
      "Two top-color stickers on top, side by side, with headlights facing you. The D-conjugate from 3×3 OLL 23.",
    difficulty: "medium",
  },
  {
    id: "2x2-t",
    name: "T",
    group: "oll",
    alg: "R U R' U' R' F R F'",
    recognition:
      "Two top-color stickers on top in a column on the left. Sexy move + sledgehammer — two triggers you already drill.",
    difficulty: "easy",
  },
  {
    id: "2x2-bowtie",
    name: "Bowtie",
    group: "oll",
    alg: "F R' F' R U R U' R'",
    recognition:
      "Two top-color stickers on top, diagonal from each other. The only case with no matching side pair anywhere.",
    difficulty: "medium",
  },
];

export const twoPblCases: AlgCase[] = [
  {
    id: "2x2-adjacent",
    name: "Adjacent swap",
    nickname: "T Perm",
    group: "pbl",
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    recognition:
      "Top is one color; one side shows a matching pair (headlights). Face the pair left and run your T perm. Then align — solved.",
    difficulty: "easy",
  },
  {
    id: "2x2-diagonal",
    name: "Diagonal swap",
    nickname: "Y Perm",
    group: "pbl",
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    recognition:
      "Top is one color but no side shows a matching pair — two corners trade diagonally. Any angle works. Your Y perm, unchanged.",
    difficulty: "medium",
  },
];

export const twoByTwoIds = [...twoOllCases, ...twoPblCases].map((c) => c.id);

/*
 * ——— 4×4 last two centers: machine-derived case set ———
 * Each algorithm is verified to change ONLY its two target faces' center
 * colors (scripts/verify-algs.mjs); the case patterns in the recognition
 * text are measured from the actual inverse states, not guessed. Corners
 * and edges get shuffled — harmless, since centers come first.
 */
export const CENTERS_MASK_4 =
  "EDGES:IIIIIIIIIIIIIIIIIIIIIIII,CORNERS:IIIIIIII,CENTERS:------------------------";

export const l2cCases: AlgCase[] = [
  {
    id: "4x4-l2c-one",
    name: "L2C: one piece each",
    group: "centers",
    alg: "Rw U Rw'",
    recognition:
      "Hold the two unfinished faces at the front and top. One wrong piece on each — line them up in the right-hand column and this three-move swap trades them.",
    difficulty: "easy",
  },
  {
    id: "4x4-l2c-column",
    name: "L2C: column swap",
    group: "centers",
    alg: "Rw U2 Rw'",
    recognition:
      "Front and top again, but a whole vertical column of two is wrong on each face. Same motion with a double turn in the middle.",
    difficulty: "easy",
  },
  {
    id: "4x4-l2c-opposite",
    name: "L2C: opposite faces",
    group: "centers",
    alg: "Rw2 U2 Rw2",
    recognition:
      "Two pieces stuck on the OPPOSITE face (top and bottom trade a column). Verified to touch nothing but those two faces' centers.",
    difficulty: "medium",
  },
];

/* ——— 4×4 reduction method: the three algorithms that aren't intuitive ——— */

export const fourCases: AlgCase[] = [
  {
    id: "4x4-edge-flip",
    name: "Pairing flip",
    group: "pairing",
    alg: "R U R' F R' F' R",
    recognition:
      "During edge pairing: the two halves of an edge sit together at the front-right, but one half is backwards. This flips that edge slot so the slice can join them. Fine to use freely before the 3×3 stage — it scrambles things pairing doesn't care about.",
    difficulty: "easy",
  },
  {
    id: "4x4-l2e",
    name: "Last two edges",
    group: "pairing",
    alg: "Uw' R U R' F R' F' R Uw",
    recognition:
      "Down to two unfinished edges: hold them at the front-left and front-right. Each slot matches on the front but clashes on the side — slice (Uw'), run the flip you already know, slice back (Uw). Both edges finish at once; centers are machine-verified safe.",
    difficulty: "medium",
  },
  {
    id: "4x4-oll-parity",
    name: "OLL parity",
    group: "parity",
    alg: "Rw U2 x Rw U2 Rw U2 Rw' U2 Lw U2 Rw' U2 Rw U2 Rw' U2 Rw'",
    recognition:
      "During the 3×3 stage you find an odd number of edges flipped — a single flipped edge in the last layer, which is impossible on a real 3×3. Run this the moment you see it (it reshuffles some top pieces; OLL and PLL clean that up). It's one motion: Rw U2 over and over with three exceptions — learn the rhythm, not the letters.",
    difficulty: "hard",
  },
  {
    id: "4x4-pll-parity",
    name: "PLL parity",
    group: "parity",
    alg: "2R2 U2 2R2 Uw2 2R2 2U2",
    recognition:
      "At PLL, two edges are swapped straight across from each other (or you see a “PLL case that doesn't exist”). This swaps those two edge pairs and touches nothing else — corners and centers stay put, machine-verified.",
    difficulty: "medium",
  },
];

export const fourByFourIds = fourCases.map((c) => c.id);

/*
 * ——— Guided reasoning for every 4×4-specific algorithm ———
 * Phase chunks reassemble to exactly the case's verified algorithm (checked
 * by scripts/verify-algs.mjs); the L2E middle phase is string-identical to
 * the pairing flip (echoOf), proving "it's the flip you already know".
 */
export interface Guided4x4 {
  caseId: string;
  title: string;
  story: string;
  phases: SolvePhase[];
}

export const guided4x4: Guided4x4[] = [
  {
    caseId: "4x4-edge-flip",
    title: "The pairing flip",
    story:
      "Two halves lined up but one backwards. Two triggers fix it: take the slot out, put it back the other way round.",
    phases: [
      { moves: "R U R'", intent: "First trigger: lift the front-right edge slot out into the free top layer." },
      { moves: "F R' F' R", intent: "Second trigger: bring it back in rotated — the slot returns flipped." },
    ],
  },
  {
    caseId: "4x4-l2e",
    title: "Last two edges",
    story:
      "The finisher: both remaining edges sit at the front, each built from mismatched halves. Slice, flip, slice back.",
    phases: [
      { moves: "Uw'", intent: "Slice: shift the inner layer one turn so the two mismatched halves meet in a single slot." },
      {
        moves: "R U R' F R' F' R",
        echoOf: "4x4-edge-flip",
        intent: "Move for move, the pairing flip you already know — it trades the front-right slot's halves.",
      },
      { moves: "Uw", intent: "Slice back: the inner layer returns home and both edges come out whole." },
    ],
  },
  {
    caseId: "4x4-oll-parity",
    title: "OLL parity",
    story:
      "The scary one, tamed: it's one drumbeat — wide-right, top-double — played ten times with three exceptions. Learn the beat, not the letters.",
    phases: [
      { moves: "Rw U2 x Rw U2 Rw U2", intent: "The beat starts: wide-right + top-double, with one regrip (x) baked in — your hands stay on the same layers." },
      { moves: "Rw' U2 Lw U2 Rw' U2", intent: "The middle: two counter-turns, and the single left-hand moment of the whole algorithm." },
      { moves: "Rw U2 Rw' U2 Rw'", intent: "The runout: same beat, landing back where your grip started." },
    ],
  },
  {
    caseId: "4x4-pll-parity",
    title: "PLL parity",
    story:
      "Six moves on two layers: the inner slice does the swapping, the top layer feeds it. Machine-verified to touch nothing but the two edge pairs.",
    phases: [
      { moves: "2R2 U2 2R2", intent: "Inner-slice double, top double, inner again — the slice carries the swap." },
      { moves: "Uw2 2R2 2U2", intent: "Shift wide, one more slice, then square the inner top layer back up. Done — corners never moved." },
    ],
  },
];

/*
 * ——— 4x4 full beginner method: the 3x3-stage middle-edge inserts ———
 * Classic layer-by-layer edge insertion (for people who haven't learned
 * intuitive F2L yet). Verified against the 3x3 engine like every F2L case.
 */
export const beginnerInsertCases: AlgCase[] = [
  {
    id: "begin-edge-right",
    name: "Middle edge → right",
    group: "inserts",
    alg: "U R U' R' U' F' U F",
    recognition:
      "A top-layer edge matches the front center, and its top color matches the right center. Two four-move halves you may recognize: basic F2L inserts #1 and #2 back to back.",
    difficulty: "easy",
  },
  {
    id: "begin-edge-left",
    name: "Middle edge → left",
    group: "inserts",
    alg: "U' L' U L U F U' F'",
    recognition:
      "Mirror case: the top edge matches the front center and its top color matches the left center. Same idea with the left hand.",
    difficulty: "easy",
  },
];

/* ——— Pyraminx beginner method ——— */

export const pyraCases: AlgCase[] = [
  {
    id: "pyra-cycle",
    name: "Edge cycle",
    group: "ll",
    alg: "R U R' U R U R'",
    recognition:
      "Bottom solved, all three top edges in the wrong spot (none flipped). Run it; if they cycled the wrong way, run it once more — or learn the reverse cycle below.",
    difficulty: "easy",
  },
  {
    id: "pyra-cycle-rev",
    name: "Edge cycle, reversed",
    group: "ll",
    alg: "R U' R' U' R U' R'",
    recognition:
      "The same three-edge cycle in the opposite direction — the exact inverse of the first. Knowing both saves you a repeat.",
    difficulty: "easy",
  },
  {
    id: "pyra-flip",
    name: "The two-flip",
    group: "ll",
    alg: "U L U' R U' R' U L'",
    recognition:
      "Two top edges are in the right place but flipped. Hold the puzzle so the good edge points to the back — this flips the two front edges in place and touches nothing else (found by exhaustive search, machine-verified).",
    difficulty: "medium",
  },
];

export const pyraminxIds = pyraCases.map((c) => c.id);

/** Every progress-tracked id in the puzzles area, for roadmap-style counters. */
export const puzzleProgressIds: Record<string, string[]> = {
  "2x2": twoByTwoIds,
  "4x4": fourByFourIds,
  pyraminx: pyraminxIds,
  megaminx: [],
};
