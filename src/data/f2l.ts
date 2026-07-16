import type { AlgCase, CaseGroup } from "../lib/types";

/**
 * All 41 F2L cases for the front-right slot, white cross on the bottom.
 * Machine-verified for correctness AND completeness: scripts/verify-algs.mjs
 * enumerates every possible corner+edge configuration and proves this set
 * covers each one exactly once.
 */
export const f2lGroups: CaseGroup[] = [
  {
    id: "basic",
    name: "Basic inserts",
    description:
      "The pair is ready — three or four moves put it home. Every other F2L case reduces to one of these.",
  },
  {
    id: "top-side",
    name: "Both on top, white facing sideways",
    description:
      "Corner and edge both in the top layer with the white sticker facing out. Join them into a pair, then insert.",
  },
  {
    id: "top-up",
    name: "Both on top, white facing up",
    description:
      "The awkward family: white points at the sky, so the corner must be rolled over before it can pair. Worth drilling slowly.",
  },
  {
    id: "edge-slot",
    name: "Edge already in the slot",
    description:
      "The edge sits in the slot (right or flipped) while the corner waits on top.",
  },
  {
    id: "corner-slot",
    name: "Corner already in the slot",
    description:
      "The corner is in the slot (maybe twisted) while the edge waits on top.",
  },
  {
    id: "both-slot",
    name: "Both in the slot, wrong",
    description:
      "Pair is home but twisted or flipped. Break it out and re-insert — or learn these direct fixes.",
  },
];

interface F2LSpec {
  n: number;
  group: string;
  alg: string;
  altAlgs?: string[];
  nickname?: string;
  recognition: string;
  difficulty: AlgCase["difficulty"];
}

const specs: F2LSpec[] = [
  // ——— Basic inserts ———
  {
    n: 1,
    group: "basic",
    alg: "U R U' R'",
    recognition:
      "White faces you, edge on the right with its front color up — a made pair, split by the slot. Hide, drop, done.",
    difficulty: "easy",
  },
  {
    n: 2,
    group: "basic",
    alg: "U' F' U F",
    recognition: "Mirror of case 1: white faces right, edge waits at the front. Insert with the front face.",
    difficulty: "easy",
  },
  {
    n: 3,
    group: "basic",
    alg: "R U R'",
    recognition:
      "White faces right and the edge sits at the back already lined up — the pair is pre-made. Three moves.",
    difficulty: "easy",
  },
  {
    n: 4,
    group: "basic",
    alg: "F' U' F",
    recognition: "Mirror of case 3: white faces you, edge on the left. Three moves with the front face.",
    difficulty: "easy",
  },

  // ——— Both on top, white to the side ———
  {
    n: 5,
    group: "top-side",
    alg: "U' R U R' U2 R U' R'",
    altAlgs: ["U' R U R' U' R U2 R'"],
    recognition:
      "White faces you, edge at the back with front color up. Pull the corner away, roll the edge around, insert.",
    difficulty: "easy",
  },
  {
    n: 6,
    group: "top-side",
    alg: "U F' U' F U2 F' U F",
    altAlgs: ["U F' U' F U F' U2 F"],
    recognition: "Mirror of case 5: white faces right, edge on the left with right color up.",
    difficulty: "easy",
  },
  {
    n: 7,
    group: "top-side",
    alg: "U' R U2 R' U2 R U' R'",
    recognition:
      "White faces you, edge on the left showing its front color. Two double-turns walk the pieces together.",
    difficulty: "easy",
  },
  {
    n: 8,
    group: "top-side",
    alg: "U F' U2 F U2 F' U F",
    recognition: "Mirror of case 7: white faces right, edge at the back.",
    difficulty: "easy",
  },
  {
    n: 9,
    group: "top-side",
    alg: "U' R U' R' U R U R'",
    recognition:
      "White faces right with the edge directly behind the corner, front color up — a split pair that joins with one setup turn.",
    difficulty: "medium",
  },
  {
    n: 10,
    group: "top-side",
    alg: "U F' U F U' F' U' F",
    recognition: "Mirror of case 9, solved entirely with the front face.",
    difficulty: "medium",
  },
  {
    n: 11,
    group: "top-side",
    alg: "R U' R' U2 F' U' F",
    recognition:
      "Corner and edge stacked on the right, but the stickers clash (white right, right color up). Send the corner down and around.",
    difficulty: "medium",
  },
  {
    n: 12,
    group: "top-side",
    alg: "F' U F U2 R U R'",
    recognition: "Mirror of case 11 at the front.",
    difficulty: "medium",
  },
  {
    n: 13,
    group: "top-side",
    alg: "U' R U2 R' U F' U' F",
    recognition:
      "White faces you, edge on the right showing its right color — a false pair. Split them wide, rejoin through the front.",
    difficulty: "medium",
  },
  {
    n: 14,
    group: "top-side",
    alg: "U F' U2 F U' R U R'",
    recognition: "Mirror of case 13.",
    difficulty: "medium",
  },
  {
    n: 15,
    group: "top-side",
    alg: "U F' U F U' R U R'",
    recognition:
      "White faces right, edge far away on the left with front color up. Bring the edge to the pair, not the pair to the edge.",
    difficulty: "medium",
  },
  {
    n: 16,
    group: "top-side",
    alg: "U R U R' U2 F' U' F",
    recognition: "Mirror of case 15: white faces you, edge at the back with right color up.",
    difficulty: "medium",
  },

  // ——— Both on top, white up ———
  {
    n: 17,
    group: "top-up",
    alg: "R U2 R' U' R U R'",
    recognition:
      "White up, edge on the right with front color up. Roll the corner over the edge with a double turn, then re-insert.",
    difficulty: "medium",
  },
  {
    n: 18,
    group: "top-up",
    alg: "F' U2 F U F' U' F",
    recognition: "Mirror of case 17 through the front.",
    difficulty: "medium",
  },
  {
    n: 19,
    group: "top-up",
    alg: "U R U2 R' U R U' R'",
    recognition: "White up, edge at the back. AUF once, then it's a Sune-like roll into the slot.",
    difficulty: "medium",
  },
  {
    n: 20,
    group: "top-up",
    alg: "U' F' U2 F U' F' U F",
    recognition: "Mirror of case 19.",
    difficulty: "medium",
  },
  {
    n: 21,
    group: "top-up",
    alg: "U2 R U R' U R U' R'",
    recognition: "White up, edge on the left with front color up — double AUF, roll, insert.",
    difficulty: "medium",
  },
  {
    n: 22,
    group: "top-up",
    alg: "U2 F' U' F U' F' U F",
    recognition: "Mirror of case 21.",
    difficulty: "medium",
  },
  {
    n: 23,
    group: "top-up",
    alg: "U2 R2 U2 R' U' R U' R2",
    recognition:
      "The infamous one: white up with the edge right in front of it, matching colors. No clean pair exists — muscle through the R2 walk.",
    difficulty: "hard",
  },
  {
    n: 24,
    group: "top-up",
    alg: "U2 F2 U2 F U F' U F2",
    recognition: "Mirror of case 23, equally cursed.",
    difficulty: "hard",
  },

  // ——— Edge in the slot ———
  {
    n: 25,
    group: "edge-slot",
    alg: "R U R' U' R U R' U' R U R'",
    nickname: "Triple sexy",
    recognition:
      "Edge solved in the slot, corner on top with white up. Three sexy moves in a row — impossible to forget.",
    difficulty: "easy",
  },
  {
    n: 26,
    group: "edge-slot",
    alg: "R U' R' F' U2 F",
    recognition: "Edge in the slot but flipped, corner on top with white up. Kick the edge out through the front.",
    difficulty: "medium",
  },
  {
    n: 27,
    group: "edge-slot",
    alg: "U R U R' U2 R U R'",
    recognition: "Edge solved in the slot, corner on top with white facing right. Pull the edge up, rebuild the pair.",
    difficulty: "medium",
  },
  {
    n: 28,
    group: "edge-slot",
    alg: "U F' U' F U' R U R'",
    recognition: "Edge flipped in the slot, white facing right. Extract through the front, insert through the right.",
    difficulty: "medium",
  },
  {
    n: 29,
    group: "edge-slot",
    alg: "U F' U2 F U' F' U' F",
    recognition: "Edge solved in the slot, corner on top with white facing you.",
    difficulty: "medium",
  },
  {
    n: 30,
    group: "edge-slot",
    alg: "U' R U R' U F' U' F",
    recognition: "Edge flipped in the slot, white facing you. The R-side pulls it out, the F-side puts it home.",
    difficulty: "medium",
  },

  // ——— Corner in the slot ———
  {
    n: 31,
    group: "corner-slot",
    alg: "U R U' R' U' F' U F",
    recognition:
      "Corner already solved, edge in front with its right color up. Lift the corner out onto the edge and re-insert as a pair.",
    difficulty: "medium",
  },
  {
    n: 32,
    group: "corner-slot",
    alg: "U' F' U F U R U' R'",
    recognition: "Mirror of case 31: corner solved, edge on the right showing its front color.",
    difficulty: "medium",
  },
  {
    n: 33,
    group: "corner-slot",
    alg: "R U' R' U R U' R'",
    recognition:
      "Corner in the slot twisted with white to the front, edge on the right ready to receive it. Two quick pumps of the right hand.",
    difficulty: "medium",
  },
  {
    n: 34,
    group: "corner-slot",
    alg: "F' U' F U F' U' F",
    recognition: "Corner twisted white-front, edge in front. The front-face version of case 33.",
    difficulty: "medium",
  },
  {
    n: 35,
    group: "corner-slot",
    alg: "U F' U F R U R'",
    recognition: "Corner twisted with white to the right, edge in front with front color up.",
    difficulty: "medium",
  },
  {
    n: 36,
    group: "corner-slot",
    alg: "R U2 R' F' U2 F",
    recognition:
      "Corner twisted white-right, edge in front showing its right color. Two double-turns — one per piece.",
    difficulty: "medium",
  },

  // ——— Both in the slot ———
  {
    n: 37,
    group: "both-slot",
    alg: "R2 U2 F R2 F' U2 R' U R'",
    recognition:
      "Corner solved, edge flipped in place — the most annoying case in F2L. This direct fix beats pulling the pair apart.",
    difficulty: "hard",
  },
  {
    n: 38,
    group: "both-slot",
    alg: "R U' R' U' R U R' U2 R U' R'",
    recognition: "Pair in the slot but the corner is twisted white-front. Eject, spin, re-insert.",
    difficulty: "medium",
  },
  {
    n: 39,
    group: "both-slot",
    alg: "R U' R' U R U2 R' U R U' R'",
    recognition: "Pair in the slot, corner twisted white-right.",
    difficulty: "medium",
  },
  {
    n: 40,
    group: "both-slot",
    alg: "R F U R U' R' F' U' R'",
    recognition: "Corner twisted white-front and the edge flipped — both pieces wrong in place.",
    difficulty: "hard",
  },
  {
    n: 41,
    group: "both-slot",
    alg: "R U F R U R' U' F' R'",
    recognition: "Corner twisted white-right with a flipped edge. The last and rarest case.",
    difficulty: "hard",
  },
];

export const f2lCases: AlgCase[] = specs.map(
  ({ n, group, alg, altAlgs, recognition, difficulty, ...rest }) => ({
    id: `f2l-${n}`,
    name: `F2L ${n}`,
    group,
    alg,
    altAlgs,
    recognition,
    difficulty,
    ...rest,
  }),
);
