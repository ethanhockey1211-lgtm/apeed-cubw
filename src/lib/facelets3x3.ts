/*
 * Painted/photographed sticker layout → cubing.js KPattern, for the 3×3
 * state solver.
 *
 * The tricky part is orientation semantics: which physical sticker a kpuzzle
 * "orientation" value corresponds to at each position. Nothing here guesses:
 * the (position, orientation) → sticker-facing tables are DERIVED at init by
 * running random move sequences through two independent engines — the cubing
 * kpuzzle and the pure-geometry facelet simulator below — and observing how
 * they line up. scripts/verify-algs.mjs then cross-checks the whole pipeline
 * on hundreds of random states.
 *
 * Face order everywhere: [U, L, F, R, B, D] (indices 0–5), each face 0–8
 * row-major in the standard Singmaster unfolding (U rows run back→front;
 * L/F/R/B are read facing them; D rows run front→back).
 */
import type { KPattern, KPuzzle } from "cubing/kpuzzle";

export const FACES = ["U", "L", "F", "R", "B", "D"] as const;
export type FaceIndex = 0 | 1 | 2 | 3 | 4 | 5;
/** colors[face][cell] = face-index of the sticker color (0–5). */
export type Facelets = number[][];

const U = 0, L = 1, F = 2, R = 3, B = 4, D = 5;

/** Singmaster cubie tables: [face, cellIndex] triples/pairs, clockwise from outside. */
const CORNER_FACELETS: [number, number][][] = [
  [[U, 8], [R, 0], [F, 2]], // URF
  [[U, 6], [F, 0], [L, 2]], // UFL
  [[U, 0], [L, 0], [B, 2]], // ULB
  [[U, 2], [B, 0], [R, 2]], // UBR
  [[D, 2], [F, 8], [R, 6]], // DFR
  [[D, 0], [L, 8], [F, 6]], // DLF
  [[D, 6], [B, 8], [L, 6]], // DBL
  [[D, 8], [R, 8], [B, 6]], // DRB
];
const EDGE_FACELETS: [number, number][][] = [
  [[U, 5], [R, 1]], // UR
  [[U, 7], [F, 1]], // UF
  [[U, 3], [L, 1]], // UL
  [[U, 1], [B, 1]], // UB
  [[D, 5], [R, 7]], // DR
  [[D, 1], [F, 7]], // DF
  [[D, 3], [L, 7]], // DL
  [[D, 7], [B, 7]], // DB
  [[F, 5], [R, 3]], // FR
  [[F, 3], [L, 5]], // FL
  [[B, 5], [L, 3]], // BL
  [[B, 3], [R, 5]], // BR
];
const CORNER_NAMES = ["URF", "UFL", "ULB", "UBR", "DFR", "DLF", "DBL", "DRB"];
const EDGE_NAMES = ["UR", "UF", "UL", "UB", "DR", "DF", "DL", "DB", "FR", "FL", "BL", "BR"];

/* ——— Independent geometric facelet simulator ——— */

const cycle = (a: number[], idxs: number[][]) => {
  // idxs: list of 4-cycles of flat facelet indices (face*9+cell); rotates each one step
  for (const c of idxs) {
    const last = a[c[c.length - 1]];
    for (let i = c.length - 1; i > 0; i--) a[c[i]] = a[c[i - 1]];
    a[c[0]] = last;
  }
};
const f = (face: number, cell: number) => face * 9 + cell;
const faceCw = (x: number) => [
  [f(x, 0), f(x, 2), f(x, 8), f(x, 6)],
  [f(x, 1), f(x, 5), f(x, 7), f(x, 3)],
];

/** Side-sticker 4-cycles per move (destination-last order: each list rotates one step). */
export const MOVE_CYCLES: Record<string, number[][]> = {
  U: [
    ...faceCw(U),
    [f(F, 0), f(L, 0), f(B, 0), f(R, 0)],
    [f(F, 1), f(L, 1), f(B, 1), f(R, 1)],
    [f(F, 2), f(L, 2), f(B, 2), f(R, 2)],
  ],
  D: [
    ...faceCw(D),
    [f(F, 6), f(R, 6), f(B, 6), f(L, 6)],
    [f(F, 7), f(R, 7), f(B, 7), f(L, 7)],
    [f(F, 8), f(R, 8), f(B, 8), f(L, 8)],
  ],
  R: [
    ...faceCw(R),
    [f(F, 2), f(U, 2), f(B, 6), f(D, 2)],
    [f(F, 5), f(U, 5), f(B, 3), f(D, 5)],
    [f(F, 8), f(U, 8), f(B, 0), f(D, 8)],
  ],
  L: [
    ...faceCw(L),
    [f(F, 0), f(D, 0), f(B, 8), f(U, 0)],
    [f(F, 3), f(D, 3), f(B, 5), f(U, 3)],
    [f(F, 6), f(D, 6), f(B, 2), f(U, 6)],
  ],
  F: [
    ...faceCw(F),
    [f(U, 6), f(R, 0), f(D, 2), f(L, 8)],
    [f(U, 7), f(R, 3), f(D, 1), f(L, 5)],
    [f(U, 8), f(R, 6), f(D, 0), f(L, 2)],
  ],
  B: [
    ...faceCw(B),
    [f(U, 2), f(L, 0), f(D, 6), f(R, 8)],
    [f(U, 1), f(L, 3), f(D, 7), f(R, 5)],
    [f(U, 0), f(L, 6), f(D, 8), f(R, 2)],
  ],
};

export const solvedFacelets = (): Facelets =>
  FACES.map((_, face) => Array.from({ length: 9 }, () => face));

/** Apply a move sequence (U D F B R L with ' and 2) to a facelet array. Pure geometry, no kpuzzle. */
export function applyMovesToFacelets(facelets: Facelets, moves: string): Facelets {
  const flat = facelets.flat();
  for (const token of moves.split(/\s+/).filter(Boolean)) {
    const base = token[0];
    const cycles = MOVE_CYCLES[base];
    if (!cycles) throw new Error(`geo sim: unsupported move ${token}`);
    const times = token.includes("2") ? 2 : token.includes("'") ? 3 : 1;
    for (let t = 0; t < times; t++) cycle(flat, cycles);
  }
  return FACES.map((_, face) => flat.slice(face * 9, face * 9 + 9));
}

/* ——— Empirical calibration against the kpuzzle ——— */

interface Mappings {
  /** kpuzzle position index for each Singmaster cubie slot */
  cornerPos: number[];
  edgePos: number[];
  /** solved piece colors, in the slot's clockwise facelet order */
  cornerColors: number[][];
  edgeColors: number[][];
  /** axisSlot[slot][ori] = which of the slot's facelets shows the piece's slot-0 color */
  cornerAxisSlot: number[][];
  edgeAxisSlot: number[][];
}

let mappings: Mappings | null = null;

function movedPositions(kpuzzle: KPuzzle, orbitName: string, move: string): number[] {
  const t = kpuzzle.algToTransformation(move);
  const d = t.transformationData[orbitName];
  const out: number[] = [];
  for (let i = 0; i < d.permutation.length; i++) {
    if (d.permutation[i] !== i || d.orientationDelta[i] !== 0) out.push(i);
  }
  return out;
}

/**
 * Derive every convention empirically: which kpuzzle position each Singmaster
 * slot is, and how kpuzzle orientation values map to physical sticker
 * facings — observed by running scrambles through both engines in tandem.
 */
export async function initFaceletEngine(kpuzzle: KPuzzle): Promise<void> {
  if (mappings) return;
  const faceMoved: Record<string, { edges: number[]; corners: number[] }> = {};
  for (const face of FACES) {
    faceMoved[face] = {
      edges: movedPositions(kpuzzle, "EDGES", face),
      corners: movedPositions(kpuzzle, "CORNERS", face),
    };
  }
  // Slot → kpuzzle position: the unique position touched by exactly that slot's faces.
  const posFor = (orbit: "edges" | "corners", slotFaces: number[]): number => {
    const sets = slotFaces.map((fi) => new Set(faceMoved[FACES[fi]][orbit]));
    const count = orbit === "edges" ? 12 : 8;
    for (let p = 0; p < count; p++) {
      if (
        sets.every((s) => s.has(p)) &&
        FACES.every((fc, fi) => slotFaces.includes(fi) || !faceMoved[fc][orbit].includes(p))
      ) {
        return p;
      }
    }
    throw new Error(`facelets: cannot locate ${orbit} position for faces ${slotFaces}`);
  };
  const cornerPos = CORNER_FACELETS.map((tri) => posFor("corners", tri.map(([fc]) => fc)));
  const edgePos = EDGE_FACELETS.map((pair) => posFor("edges", pair.map(([fc]) => fc)));

  // Solved colors per slot are just the slot's own faces.
  const cornerColors = CORNER_FACELETS.map((tri) => tri.map(([fc]) => fc));
  const edgeColors = EDGE_FACELETS.map((pair) => pair.map(([fc]) => fc));

  // Tandem scrambles: observe (position, ori) → which facelet slot holds the
  // piece's reference (slot-0) color. Uses fixed pseudo-random sequences so
  // init is deterministic.
  const cornerAxisSlot: number[][] = CORNER_FACELETS.map(() => [-1, -1, -1]);
  const edgeAxisSlot: number[][] = EDGE_FACELETS.map(() => [-1, -1]);
  const solved = kpuzzle.defaultPattern();
  let seed = 0x2bad;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const MOVES = ["U", "U'", "U2", "D", "D'", "F", "F'", "F2", "B", "B'", "R", "R'", "R2", "L", "L'", "L2"];
  const need = () =>
    cornerAxisSlot.some((a) => a.includes(-1)) || edgeAxisSlot.some((a) => a.includes(-1));
  for (let round = 0; round < 200 && need(); round++) {
    const seq = Array.from({ length: 25 }, () => MOVES[Math.floor(rand() * MOVES.length)]).join(" ");
    const pattern = solved.applyAlg(seq);
    const geo = applyMovesToFacelets(solvedFacelets(), seq);
    const co = pattern.patternData["CORNERS"];
    for (let slot = 0; slot < 8; slot++) {
      const p = cornerPos[slot];
      const piece = co.pieces[p];
      const ori = co.orientation[p];
      if (cornerAxisSlot[slot][ori] !== -1) continue;
      const pieceSlot = cornerPos.indexOf(piece);
      const refColor = cornerColors[pieceSlot][0];
      const shownAt = CORNER_FACELETS[slot].findIndex(([fc, cell]) => geo[fc][cell] === refColor);
      if (shownAt !== -1) cornerAxisSlot[slot][ori] = shownAt;
    }
    const eo = pattern.patternData["EDGES"];
    for (let slot = 0; slot < 12; slot++) {
      const p = edgePos[slot];
      const piece = eo.pieces[p];
      const ori = eo.orientation[p];
      if (edgeAxisSlot[slot][ori] !== -1) continue;
      const pieceSlot = edgePos.indexOf(piece);
      const refColor = edgeColors[pieceSlot][0];
      const shownAt = EDGE_FACELETS[slot].findIndex(([fc, cell]) => geo[fc][cell] === refColor);
      if (shownAt !== -1) edgeAxisSlot[slot][ori] = shownAt;
    }
  }
  if (need()) throw new Error("facelets: calibration incomplete");
  mappings = { cornerPos, edgePos, cornerColors, edgeColors, cornerAxisSlot, edgeAxisSlot };
}

/* ——— Facelets → KPattern ——— */

export interface BuildResult {
  ok: boolean;
  pattern?: KPattern;
  errors: string[];
}

export function faceletsToPattern(kpuzzle: KPuzzle, facelets: Facelets): BuildResult {
  if (!mappings) throw new Error("facelets: engine not initialized");
  const m = mappings;
  const errors: string[] = [];

  const counts = Array.from({ length: 6 }, () => 0);
  for (const face of facelets) for (const c of face) counts[c]++;
  counts.forEach((n, c) => {
    if (n !== 9) errors.push(`Needs exactly 9 ${FACES[c]}-color stickers, found ${n}.`);
  });
  for (let face = 0; face < 6; face++) {
    if (facelets[face][4] !== face) errors.push(`The ${FACES[face]} center must stay ${FACES[face]}-colored.`);
  }
  if (errors.length) return { ok: false, errors };

  const cornerPieces = new Array<number>(8).fill(-1);
  const cornerOri = new Array<number>(8).fill(0);
  const edgePieces = new Array<number>(12).fill(-1);
  const edgeOri = new Array<number>(12).fill(0);

  // If a piece's reference (slot-0) color shows at the position's facelet
  // slot k, clockwise order forces seen[(k+i)%n] === pieceColors[i] for all i.
  for (let slot = 0; slot < 8; slot++) {
    const seen = CORNER_FACELETS[slot].map(([fc, cell]) => facelets[fc][cell]);
    let matched = false;
    for (let pieceSlot = 0; pieceSlot < 8 && !matched; pieceSlot++) {
      for (let k = 0; k < 3; k++) {
        if (m.cornerColors[pieceSlot].every((c, i) => c === seen[(k + i) % 3])) {
          const ori = m.cornerAxisSlot[slot].indexOf(k);
          if (ori === -1) continue;
          cornerPieces[m.cornerPos[slot]] = m.cornerPos[pieceSlot];
          cornerOri[m.cornerPos[slot]] = ori;
          matched = true;
          break;
        }
      }
    }
    if (!matched) errors.push(`The ${CORNER_NAMES[slot]} corner shows an impossible color combination.`);
  }
  for (let slot = 0; slot < 12; slot++) {
    const seen = EDGE_FACELETS[slot].map(([fc, cell]) => facelets[fc][cell]);
    let matched = false;
    for (let pieceSlot = 0; pieceSlot < 12 && !matched; pieceSlot++) {
      for (let k = 0; k < 2; k++) {
        if (m.edgeColors[pieceSlot].every((c, i) => c === seen[(k + i) % 2])) {
          const ori = m.edgeAxisSlot[slot].indexOf(k);
          if (ori === -1) continue;
          edgePieces[m.edgePos[slot]] = m.edgePos[pieceSlot];
          edgeOri[m.edgePos[slot]] = ori;
          matched = true;
          break;
        }
      }
    }
    if (!matched) errors.push(`The ${EDGE_NAMES[slot]} edge shows an impossible color combination.`);
  }
  if (errors.length) return { ok: false, errors };

  const dupCheck = (pieces: number[], label: string) => {
    if (new Set(pieces).size !== pieces.length) {
      errors.push(`Two ${label} have identical colors — one of them is painted wrong.`);
    }
  };
  dupCheck(cornerPieces, "corners");
  dupCheck(edgePieces, "edges");
  if (errors.length) return { ok: false, errors };

  const twist = cornerOri.reduce((a, b) => a + b, 0) % 3;
  const flip = edgeOri.reduce((a, b) => a + b, 0) % 2;
  const parity = (pieces: number[]) => {
    let p = 0;
    for (let i = 0; i < pieces.length; i++)
      for (let j = i + 1; j < pieces.length; j++) if (pieces[i] > pieces[j]) p ^= 1;
    return p;
  };
  if (twist !== 0) errors.push("A corner is twisted — this state is unsolvable. Re-check corner colors.");
  if (flip !== 0) errors.push("An edge is flipped — this state is unsolvable. Re-check edge colors.");
  if (parity(cornerPieces) !== parity(edgePieces))
    errors.push("Two pieces are swapped — this state is unsolvable. Re-check for two mixed-up stickers.");
  if (errors.length) return { ok: false, errors };

  // Clone the solved pattern's full data (CENTERS carries an orientationMod
  // field that must be preserved) and overwrite the orbits we computed.
  const solved = kpuzzle.defaultPattern();
  const data = JSON.parse(JSON.stringify(solved.patternData)) as KPattern["patternData"];
  data["CORNERS"].pieces = cornerPieces;
  data["CORNERS"].orientation = cornerOri;
  data["EDGES"].pieces = edgePieces;
  data["EDGES"].orientation = edgeOri;
  const pattern = new (solved.constructor as new (
    k: KPuzzle,
    d: KPattern["patternData"],
  ) => KPattern)(kpuzzle, data);
  return { ok: true, pattern, errors: [] };
}
