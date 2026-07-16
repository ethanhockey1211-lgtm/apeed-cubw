import type { AlgCase, CaseGroup } from "../lib/types";

export const pllGroups: CaseGroup[] = [
  {
    id: "edges",
    name: "Edges only",
    description: "Corners are already solved — only edges move. Learn these four first.",
  },
  {
    id: "corners",
    name: "Corners only",
    description: "Edges are already solved — only corners move.",
  },
  {
    id: "adjacent",
    name: "Adjacent corner swap",
    description: "Two neighboring corners swap. Recognize these by their single set of headlights.",
  },
  {
    id: "diagonal",
    name: "Diagonal corner swap",
    description: "Two corners swap across the diagonal. No headlights anywhere.",
  },
];

export const pllCases: AlgCase[] = [
  // ——— Edges only ———
  {
    id: "pll-ua",
    name: "Ua Perm",
    group: "edges",
    alg: "M2 U M U2 M' U M2",
    altAlgs: ["R U' R U R U R U' R' U' R2"],
    recognition:
      "All corners solved, one solved edge. Put the solved edge at the back — the other three edges cycle counter-clockwise.",
    difficulty: "easy",
  },
  {
    id: "pll-ub",
    name: "Ub Perm",
    group: "edges",
    alg: "M2 U' M U2 M' U' M2",
    altAlgs: ["R2 U R U R' U' R' U' R' U R'"],
    recognition:
      "Mirror of Ua: solved edge at the back, remaining three edges cycle clockwise.",
    difficulty: "easy",
  },
  {
    id: "pll-h",
    name: "H Perm",
    group: "edges",
    alg: "M2 U M2 U2 M2 U M2",
    altAlgs: ["R2 U2 R U2 R2 U2 R2 U2 R U2 R2"],
    recognition:
      "Opposite edges swap with each other. Every side shows headlights with the opposite color in between.",
    difficulty: "easy",
  },
  {
    id: "pll-z",
    name: "Z Perm",
    group: "edges",
    alg: "M' U M2 U M2 U M' U2 M2",
    altAlgs: ["U M2 U M2 U M' U2 M2 U2 M' U2"],
    recognition:
      "Adjacent edges swap in two pairs. Each side shows a corner-edge 'checkerboard' — headlights nowhere, but every face has a 2-color pattern.",
    difficulty: "medium",
  },

  // ——— Corners only ———
  {
    id: "pll-aa",
    name: "Aa Perm",
    group: "corners",
    alg: "x R' U R' D2 R U' R' D2 R2 x'",
    altAlgs: ["R' F R' B2 R F' R' B2 R2"],
    recognition:
      "All four edges match their centers — only corners cycle. Exactly one face shows headlights; the three moving corners cycle clockwise (seen from above).",
    difficulty: "easy",
  },
  {
    id: "pll-ab",
    name: "Ab Perm",
    group: "corners",
    alg: "x R2 D2 R U R' D2 R U' R x'",
    altAlgs: ["U R B' R F2 R' B R F2 R2 U'"],
    recognition:
      "Mirror of Aa: edges solved, one set of headlights, but the corners cycle counter-clockwise.",
    difficulty: "easy",
  },
  {
    id: "pll-e",
    name: "E Perm",
    group: "corners",
    alg: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
    recognition:
      "Edges solved, but no face shows headlights — all four corners swap with their neighbors. Every side has two different corner colors.",
    difficulty: "hard",
  },

  // ——— Adjacent corner swap ———
  {
    id: "pll-t",
    name: "T Perm",
    group: "adjacent",
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    recognition:
      "One set of headlights — face it left. On the right side, a corner-edge-corner checker pattern. The go-to first PLL for every beginner.",
    difficulty: "easy",
  },
  {
    id: "pll-f",
    name: "F Perm",
    group: "adjacent",
    alg: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
    recognition:
      "Like a T perm with a solved bar: one side is completely solved (a full 3-piece bar). Face the bar left and the headlights show at the front and back.",
    difficulty: "hard",
  },
  {
    id: "pll-ja",
    name: "Ja Perm",
    group: "adjacent",
    alg: "x R2 F R F' R U2 r' U r U2 x'",
    altAlgs: ["U2 L' U' L F L' U' L U L F' L2 U L U'"],
    recognition:
      "A solved 2×1 block (corner + edge) with headlights touching it on the left. The block and its neighbors swap around the corner.",
    difficulty: "medium",
  },
  {
    id: "pll-jb",
    name: "Jb Perm",
    group: "adjacent",
    alg: "R U R' F' R U R' U' R' F R2 U' R'",
    recognition:
      "Mirror of Ja: solved block with the headlights on its right. One of the fastest algorithms in all of PLL.",
    difficulty: "easy",
  },
  {
    id: "pll-ra",
    name: "Ra Perm",
    group: "adjacent",
    alg: "R U' R' U' R U R D R' U' R D' R' U2 R'",
    altAlgs: ["R U R' F' R U2 R' U2 R' F R U R U2 R'"],
    recognition:
      "One set of headlights with a lone opposite-color edge between them; the front-right shows a corner-edge checker.",
    difficulty: "medium",
  },
  {
    id: "pll-rb",
    name: "Rb Perm",
    group: "adjacent",
    alg: "R2 F R U R U' R' F' R U2 R' U2 R",
    altAlgs: ["U' R' U2 R U2 R' F R U R' U' R' F' R2 U'"],
    recognition:
      "Mirror of Ra. Headlights with a checker on the other side compared to Ra — check which corner pair matches.",
    difficulty: "medium",
  },
  {
    id: "pll-ga",
    name: "Ga Perm",
    group: "adjacent",
    alg: "R2 U R' U R' U' R U' R2 U' D R' U R D'",
    recognition:
      "G perms: one set of headlights and no solved bar. For Ga, face the headlights left — the edge in the headlights matches the front-left color.",
    difficulty: "medium",
  },
  {
    id: "pll-gb",
    name: "Gb Perm",
    group: "adjacent",
    alg: "R' U' R U D' R2 U R' U R U' R U' R2 D",
    recognition:
      "Headlights facing left with no bar. The inverse of Ga — if you run Ga twice you get Gb's state.",
    difficulty: "medium",
  },
  {
    id: "pll-gc",
    name: "Gc Perm",
    group: "adjacent",
    alg: "R2 U' R U' R U R' U R2 U D' R U' R' D",
    recognition:
      "Headlights facing left with no bar, diagonal twin of Ga. Recognize by which side the matching edge sits on.",
    difficulty: "medium",
  },
  {
    id: "pll-gd",
    name: "Gd Perm",
    group: "adjacent",
    alg: "R U R' U' D R2 U' R U' R' U R' U R2 D'",
    recognition:
      "Headlights facing left with no bar. The inverse of Gc — the last of the four G perms.",
    difficulty: "medium",
  },

  // ——— Diagonal corner swap ———
  {
    id: "pll-v",
    name: "V Perm",
    group: "diagonal",
    alg: "R' U R' U' y R' F' R2 U' R' U R' F R F",
    recognition:
      "No headlights anywhere. A solved 2×1 block sits on one corner — point the block to the front-left; the swap happens across the opposite diagonal.",
    difficulty: "hard",
  },
  {
    id: "pll-y",
    name: "Y Perm",
    group: "diagonal",
    alg: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    recognition:
      "No headlights. A solved block sits at the back-left and the front-right shows nothing matching — diagonal corners swap plus two edges.",
    difficulty: "medium",
  },
  {
    id: "pll-na",
    name: "Na Perm",
    group: "diagonal",
    alg: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
    recognition:
      "Looks like a Z pulled apart: two solved 2×1 blocks on opposite sides, arranged like a lightning bolt leaning right.",
    difficulty: "hard",
  },
  {
    id: "pll-nb",
    name: "Nb Perm",
    group: "diagonal",
    alg: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
    recognition:
      "Mirror of Na — the lightning bolt leans the other way. Two blocks swap diagonally.",
    difficulty: "hard",
  },
];
