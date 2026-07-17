import type { AccentColor, AlgCase, SolvePhase } from "../lib/types";
// Explicit .ts extensions so scripts/verify-algs.mjs can import this file
// under Node's --experimental-strip-types (extensionless value imports fail).
import { ollCases } from "./oll.ts";
import { pllCases } from "./pll.ts";

/*
 * ——— 2-Look OLL: edge orientation ———
 * These three cases only care about the last-layer EDGES, so they get their
 * own mask: edges show orientation, corners are ignored entirely. Same
 * piece-index scheme as the section masks (yellow family = indices 4-7 in the
 * z2 / white-bottom display frame).
 */
export const EO_MASK = "EDGES:DDDDOOOODDDD,CORNERS:DDDDIIII,CENTERS:DDDDD-";

export const eoCases: AlgCase[] = [
  {
    id: "eo-line",
    name: "Line",
    nickname: "2 edges oriented, opposite",
    group: "eo",
    alg: "F R U R' U' F'",
    recognition:
      "Two yellow edges form a straight line through the center. Hold the line horizontal (running left–right), then execute. Six moves — this is the F-sandwich: F, sexy move, F'.",
    difficulty: "easy",
  },
  {
    id: "eo-l",
    name: "L shape",
    nickname: "2 edges oriented, adjacent",
    group: "eo",
    alg: "F U R U' R' F'",
    recognition:
      "Two yellow edges make a corner-shaped angle. Point the L at the back-left (yellow edges at back and left), then run the F-sandwich with the sexy move's order shuffled: F, U R U' R', F'.",
    difficulty: "easy",
  },
  {
    id: "eo-dot",
    name: "Dot",
    nickname: "0 edges oriented",
    group: "eo",
    alg: "F R U R' U' F' f R U R' U' f'",
    recognition:
      "No yellow edges at all — only the center. Any angle works. It's just the Line alg followed by the L alg (the wide f does the re-grip for you): you already know both halves.",
    difficulty: "medium",
  },
];

/*
 * ——— 2-Look OLL: corner orientation (OCLL) ———
 * These seven ARE full-OLL cases (21–27), so learning them here fills in real
 * OLL progress. Ordered for teaching: Sune and Anti-Sune first — they're the
 * easiest and two of the most common.
 */
const ocllOrder = ["oll-27", "oll-26", "oll-21", "oll-22", "oll-23", "oll-24", "oll-25"];
export const ocllCases: AlgCase[] = ocllOrder.map((id) => {
  const c = ollCases.find((o) => o.id === id);
  if (!c) throw new Error(`2-look OLL references missing case ${id}`);
  return c;
});

export const twoLookOllIds = [...eoCases.map((c) => c.id), ...ocllOrder];

/*
 * ——— 2-Look PLL ———
 * All six are real PLL cases — T and Y handle any corner permutation (the
 * edges they scramble get fixed in the second look), then the four edge-only
 * perms finish the solve.
 */
const pick = (id: string): AlgCase => {
  const c = pllCases.find((p) => p.id === id);
  if (!c) throw new Error(`2-look PLL references missing case ${id}`);
  return c;
};
export const tlPllCornerCases: AlgCase[] = ["pll-t", "pll-y"].map(pick);
export const tlPllEdgeCases: AlgCase[] = ["pll-ua", "pll-ub", "pll-h", "pll-z"].map(pick);
export const twoLookPllIds = [...tlPllCornerCases, ...tlPllEdgeCases].map((c) => c.id);

/* ——— F2L foundations: the four basic inserts, by id ——— */
export const f2lBasicIds = ["f2l-1", "f2l-2", "f2l-3", "f2l-4"];

/*
 * ——— Guided F2L solves: algorithms with the reasoning attached ———
 * Each phase's moves concatenate to exactly the referenced case's verified
 * algorithm (checked by scripts/verify-algs.mjs). Where a phase carries
 * `echoOf`, its moves are literally that case's algorithm — machine-proof
 * that "every case reduces to a basic insert" isn't just a slogan.
 */
export interface GuidedExample {
  caseId: string;
  title: string;
  story: string;
  phases: SolvePhase[];
}

export const guidedF2L: GuidedExample[] = [
  {
    caseId: "f2l-3",
    title: "The premade pair",
    story:
      "Corner and edge are already locked together with matching colors. All that's left is the door: open the slot, carry the pair over it, close.",
    phases: [
      { moves: "R", intent: "Open the slot — its empty corner spot swings up into the top layer." },
      { moves: "U", intent: "Carry the pair across the top so it sits over the opening." },
      { moves: "R'", intent: "Close the slot. Pair home, cross untouched." },
    ],
  },
  {
    caseId: "f2l-1",
    title: "The pair split by the slot",
    story:
      "The pieces are next to each other but the slot's own turn would rip them apart. So: step aside, open, come back, close. This four-move shape is the heartbeat of F2L.",
    phases: [
      { moves: "U", intent: "Move the pieces aside, out of the slot's swing path." },
      { moves: "R", intent: "Open the slot while they're safely out of the way." },
      { moves: "U'", intent: "Bring them back — now they drop together into the opening." },
      { moves: "R'", intent: "Close. Borrow, use, give back: that's every F2L insert." },
    ],
  },
  {
    caseId: "f2l-5",
    title: "Both on top, not yet a pair",
    story:
      "Corner and edge are both in the top layer but not joined. Phase one builds the pair; phase two is an insert you could do in your sleep.",
    phases: [
      {
        moves: "U' R U R' U2",
        intent:
          "Build the pair: walk the corner and edge around the free top layer until they lock together, colors matching.",
      },
      { moves: "R U' R'", intent: "Insert: open the slot, drop the finished pair in, close." },
    ],
  },
  {
    caseId: "f2l-17",
    title: "White facing the sky",
    story:
      "The hardest-looking family: the corner's white sticker points straight up, so no pair can form. The fix is one motion — roll the corner over the top — and suddenly it's a case you already know.",
    phases: [
      {
        moves: "R U2 R'",
        intent:
          "The roll: hoist the corner up and flip it over with a double turn. White stops pointing at the sky, and the pair snaps together.",
      },
      { moves: "U'", intent: "Line the fresh pair up over its slot." },
      {
        moves: "R U R'",
        echoOf: "f2l-3",
        intent: "…and this is literally basic insert #3, move for move. New case, old ending.",
      },
    ],
  },
  {
    caseId: "f2l-31",
    title: "A piece stuck in the slot",
    story:
      "The corner is sitting in its slot — even correctly! — but its edge isn't with it, so it has to come out. Eject it onto the top layer and you're left staring at a basic insert.",
    phases: [
      {
        moves: "U R U' R'",
        intent:
          "Evict politely: open the slot, lift the lonely corner out onto the top layer next to its edge, close behind it.",
      },
      {
        moves: "U' F' U F",
        echoOf: "f2l-2",
        intent: "What remains is exactly basic insert #2. Stuck pieces don't need new algorithms — just an exit.",
      },
    ],
  },
];

/*
 * ——— “Why it works” intuition notes ———
 * Structural decompositions into triggers the learner already knows, keyed by
 * case id and rendered wherever that case appears. These turn memorization
 * into chunking — you remember 2–3 triggers, not 14 letters.
 */
export const intuitionById: Record<string, string> = {
  // 2-look OLL edges: all three are the same F-sandwich
  "eo-line": "A conjugate: F lends the bottom-layer machinery to the top, the sexy move flips two edges, F' puts everything back.",
  "eo-l": "The same F-sandwich as Line with the filling stirred — U R U' R' instead of R U R' U'. One sandwich, two fillings.",
  "eo-dot": "Nothing new: it's the Line alg, then the L alg. The wide f just builds the re-grip into the move.",
  // OCLL
  "oll-27": "The friendliest algorithm on the cube: trigger (R U R'), kick (U), then the same trigger with a double twist (R U2 R'). Learn it as a rhythm, not letters.",
  "oll-26": "Sune played backwards — it's the exact inverse. If you can undo a Sune, you know this one already.",
  "oll-21": "Nicknamed Double Sune: Sune's rhythm run twice in one breath.",
  "oll-22": "Lives entirely on R and U — three R2 flicks in a row carry the whole thing.",
  "oll-23": "A conjugate with D: tuck one corner downstairs (D'), twist the others up top, then bring it back (D).",
  "oll-24": "Fat sexy move (r U R' U'), then hand the twist back with r' F R F'. Two chunks you already own.",
  "oll-25": "Chameleon's twin — the same fat-sexy engine, wrapped in F' … R instead.",
  // 2-look PLL
  "pll-t": "Opens with the sexy move; the F-wrapped second half swaps everything back in a new order. Two triggers, zero new fingerings.",
  "pll-y": "The entire second half is OLL's sexy + sledgehammer combo (R U R' U' R' F R F') — you drilled it already.",
  "pll-ua": "M and U only: the M slice shuttles edges through the middle while U feeds it the next one.",
  "pll-ub": "Ua's shuttle run in reverse — same fingertrick, opposite direction.",
  "pll-h": "Four M2s stitched together by U turns — pure rhythm. Say “two-one-two-twotwo-two-one-two” out loud while you turn.",
  "pll-z": "The M slice zig-zags: alternate M and U until the checkerboards unwind, then a final alignment.",
};

/* ——— Notation school ——— */
export interface NotationMove {
  move: string;
  label: string;
  hint: string;
}
export interface NotationGroup {
  id: string;
  title: string;
  blurb: string;
  moves: NotationMove[];
}

export const notationGroups: NotationGroup[] = [
  {
    id: "faces",
    title: "The six faces",
    blurb:
      "Every letter names a face of the cube — from your point of view, however you're holding it. A letter on its own means: turn that face a quarter turn clockwise, as if you were looking straight at it.",
    moves: [
      { move: "R", label: "Right", hint: "Right layer turns away from you — the front sticker goes up." },
      { move: "L", label: "Left", hint: "Left layer turns toward you — the front sticker goes down." },
      { move: "U", label: "Up", hint: "Top layer — the front row slides to the left." },
      { move: "D", label: "Down", hint: "Bottom layer — the front row slides to the right." },
      { move: "F", label: "Front", hint: "The face looking at you — like turning a steering wheel to the right." },
      { move: "B", label: "Back", hint: "The far face — clockwise from behind, so it looks reversed from your side." },
    ],
  },
  {
    id: "modifiers",
    title: "Primes and doubles",
    blurb:
      "An apostrophe (read “prime”) reverses the turn — counter-clockwise instead of clockwise. A 2 means a half turn (180°), where direction doesn't matter. That's the whole grammar: 18 basic moves.",
    moves: [
      { move: "R'", label: "R prime", hint: "Right layer toward you — the exact undo of R." },
      { move: "U'", label: "U prime", hint: "Top layer — front row slides right. Undoes U." },
      { move: "R2", label: "R double", hint: "Right layer, half turn. R2 and R2' land in the same place." },
      { move: "U2", label: "U double", hint: "Top layer spun 180° — two quarter turns in one motion." },
    ],
  },
  {
    id: "slices",
    title: "Slice moves",
    blurb:
      "The middle layers have names too. You'll meet M constantly in PLL edge algorithms — flick it with your ring finger from the back of the cube.",
    moves: [
      { move: "M", label: "Middle", hint: "The layer between L and R. Follows L's direction — front sticker goes down." },
      { move: "M'", label: "M prime", hint: "Middle layer up — the star of Ua, Ub, H and Z perms." },
      { move: "E", label: "Equator", hint: "Between U and D, follows D's direction. Rare, but you'll see it." },
      { move: "S", label: "Standing", hint: "Between F and B, follows F's direction. The rarest of the three." },
    ],
  },
  {
    id: "wide",
    title: "Wide moves",
    blurb:
      "A lowercase letter grabs two layers at once — the face plus the slice next to it. Same fingers, more cube.",
    moves: [
      { move: "r", label: "Wide R", hint: "Right layer and middle layer together. Shows up in many OLL algs." },
      { move: "r'", label: "Wide R prime", hint: "Both layers toward you." },
      { move: "f", label: "Wide F", hint: "Front two layers — this is what makes the Dot OLL alg one fluid motion." },
      { move: "u", label: "Wide U", hint: "Top two layers — common in advanced PLL fingertricks." },
    ],
  },
  {
    id: "rotations",
    title: "Whole-cube rotations",
    blurb:
      "x, y and z rotate the entire cube in your hands — no layer turns, you're just re-gripping. They follow R, U and F respectively, and take primes like any move.",
    moves: [
      { move: "x", label: "x rotation", hint: "Whole cube follows R — tilts backward, so the front face becomes the top." },
      { move: "y", label: "y rotation", hint: "Whole cube follows U — spins flat to point a new face at you." },
      { move: "z", label: "z rotation", hint: "Whole cube follows F — cartwheels sideways." },
      { move: "y'", label: "y prime", hint: "Spin the other way. y and y' are the rotations you'll actually use in F2L." },
    ],
  },
];

/** The first algorithm everyone learns — annotated move by move. */
export const SEXY_MOVE = {
  alg: "R U R' U'",
  steps: [
    { move: "R", meaning: "Right layer up" },
    { move: "U", meaning: "Top layer left" },
    { move: "R'", meaning: "Right layer back down" },
    { move: "U'", meaning: "Top layer back right" },
  ],
};

/* ——— The guided path ——— */
export interface LearnStage {
  id: string;
  /** Stage number shown on the roadmap node */
  step: number;
  title: string;
  subtitle: string;
  route: string;
  cta: string;
  accent: AccentColor;
  /** Honest wall-clock expectation, practice included */
  estimate: string;
  /** Case ids whose learned-state measures this stage (empty ⇒ manual) */
  trackIds: string[];
  /** Progress id for a “mark as done” stage with no tracked cases */
  manualId?: string;
  /** Completing this stage is the “you now solve with CFOP” moment */
  milestone?: boolean;
}

export const learnStages: LearnStage[] = [
  {
    id: "notation",
    step: 1,
    title: "Read the notation",
    subtitle:
      "Twenty minutes that unlock everything else. Every algorithm on this site — and on Earth — is written in the same 18-move language.",
    route: "/learn/notation",
    cta: "Learn the language",
    accent: "green",
    estimate: "~20 minutes",
    trackIds: [],
    manualId: "lesson-notation",
  },
  {
    id: "cross",
    step: 2,
    title: "The cross",
    subtitle:
      "Four edges, no algorithms — pure spatial reasoning. Learn to plan all of it during inspection and execute it without looking.",
    route: "/cross",
    cta: "Build the cross",
    accent: "white",
    estimate: "2–4 days of practice",
    trackIds: [],
    manualId: "lesson-cross",
  },
  {
    id: "f2l-basics",
    step: 3,
    title: "Intuitive F2L",
    subtitle:
      "The heart of CFOP: pair a corner with its edge and drop them in together. Understand four basic inserts and you can derive everything else at the cube.",
    route: "/learn/f2l-basics",
    cta: "Understand F2L",
    accent: "blue",
    estimate: "1–2 weeks to feel smooth",
    trackIds: f2lBasicIds,
  },
  {
    id: "2-look-oll",
    step: 4,
    title: "2-Look OLL",
    subtitle:
      "Ten algorithms that always make the top yellow, in two quick looks: edges first, then corners. Seven of the ten count toward full OLL forever.",
    route: "/learn/2-look-oll",
    cta: "Get the yellow face",
    accent: "yellow",
    estimate: "~1 week · 10 algs",
    trackIds: twoLookOllIds,
  },
  {
    id: "2-look-pll",
    step: 5,
    title: "2-Look PLL",
    subtitle:
      "Six algorithms to finish any solve: two fix the corners, four fix the edges. Complete this stage and you are solving with real CFOP.",
    route: "/learn/2-look-pll",
    cta: "Finish the solve",
    accent: "red",
    estimate: "3–5 days · 6 algs",
    trackIds: twoLookPllIds,
    milestone: true,
  },
  {
    id: "full-pll",
    step: 6,
    title: "Full PLL",
    subtitle:
      "Replace two looks with one. Fifteen more algorithms complete the set of 21 — the biggest, cheapest time-drop available to you right now.",
    route: "/pll",
    cta: "Complete PLL",
    accent: "red",
    estimate: "3–6 weeks · 15 more algs",
    trackIds: pllCases.map((c) => c.id),
  },
  {
    id: "full-oll",
    step: 7,
    title: "Full OLL",
    subtitle:
      "The long game: all 57 orientations, learned shape family by shape family. No rush — plenty of sub-15 solvers are still finishing this set.",
    route: "/oll",
    cta: "Chip away at OLL",
    accent: "yellow",
    estimate: "2–4 months · 47 more algs",
    trackIds: ollCases.map((c) => c.id),
  },
  {
    id: "f2l-cases",
    step: 8,
    title: "F2L, refined",
    subtitle:
      "Audit all 41 pair cases and replace your slowest intuitive solutions with tuned algorithms. This is where seconds hide.",
    route: "/f2l",
    cta: "Refine your pairs",
    accent: "blue",
    estimate: "ongoing",
    trackIds: [], // filled below to avoid importing f2l data twice
  },
];

// Populate the F2L stage lazily via a dynamic import-free approach: the ids
// are deterministic (f2l-1 … f2l-41).
learnStages[learnStages.length - 1].trackIds = Array.from({ length: 41 }, (_, i) => `f2l-${i + 1}`);

/** Fraction 0–1 of a stage, given the set of learned ids. */
export function stageFraction(stage: LearnStage, isLearned: (id: string) => boolean): number {
  if (stage.trackIds.length === 0) {
    return stage.manualId && isLearned(stage.manualId) ? 1 : 0;
  }
  const done = stage.trackIds.filter(isLearned).length;
  return done / stage.trackIds.length;
}
