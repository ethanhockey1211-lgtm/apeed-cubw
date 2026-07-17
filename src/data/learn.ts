import type { AccentColor, AlgCase } from "../lib/types";
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
