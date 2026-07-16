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

export interface CrossLesson {
  title: string;
  explanation: string;
  /** Applied as the setup, after z2 (so white ends up on the bottom) */
  scramble: string;
  /** The cross solution the player animates */
  solution: string;
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
  },
  {
    title: "The sideways sticker",
    explanation:
      "A white sticker facing sideways can't be solved with one face turn. Feed it into the bottom with the face it's stuck on, then restore.",
    scramble: "L U L' U2 F2 U' F",
    solution: "F' U F2",
  },
  {
    title: "Top layer first",
    explanation:
      "Edges sitting in the top layer are the easiest to read: line the white sticker over its slot, then push it down. Two of them here — pick the cheaper one first.",
    scramble: "F U F' R U2 R' D F' R' U",
    solution: "U' R F D'",
  },
  {
    title: "Two at once",
    explanation:
      "The best cross solutions overlap: here the first two moves set up a second edge for free. Look for these 2-for-1 moves during inspection — they're what makes sub-8-move crosses possible.",
    scramble: "R U2 R' U F2 L D L'",
    solution: "L D' L' F2",
  },
  {
    title: "Working around a solved edge",
    explanation:
      "One edge is already home. Solve the rest without breaking it — or if breaking it saves moves, restore it on the way back, like the D2 here.",
    scramble: "L U' L' F U F' D2 R' F R D'",
    solution: "D R' F' R D2",
  },
  {
    title: "A full 6-move cross",
    explanation:
      "A realistic inspection-time read: nothing is free, every edge needs work. Step through slowly and watch how no move undoes an earlier one — that's the mark of an efficient cross.",
    scramble: "R U R' F2 U R2 D R F",
    solution: "F' R' D' R2 U' F2",
  },
];
