/*
 * Geometric NxN facelet engine. Instead of hand-authoring 4x4 move tables
 * (error-prone), moves are generated from 3D sticker geometry — and the
 * generator is trusted because its 3x3 output must exactly reproduce the
 * hand-written, cross-engine-verified tables in facelets3x3.ts. Rotation
 * direction per axis is CALIBRATED against those tables at module init, so
 * no chirality convention is ever guessed.
 *
 * Face order [U, L, F, R, B, D], cells row-major with the same net
 * conventions as the 3x3 module (U rows back→front, L/F/R/B read facing
 * them, D rows front→back).
 */
// Explicit .ts extension so Node's --experimental-strip-types can resolve it
// (the verify script imports this module directly).
import { MOVE_CYCLES as CYCLES_3X3 } from "./facelets3x3.ts";

type Vec = [number, number, number];

const FACE_COUNT = 6;

/** Sticker center positions for n=4, exported for piece-adjacency derivation. */
export function stickerPositions4(): Vec[] {
  const out: Vec[] = [];
  for (let f = 0; f < FACE_COUNT; f++) {
    for (let cell = 0; cell < 16; cell++) {
      out.push(stickerPos(4, f, Math.floor(cell / 4), cell % 4));
    }
  }
  return out;
}

/** Sticker center in doubled integer coordinates (exact math, no floats). */
function stickerPos(n: number, face: number, row: number, col: number): Vec {
  const m = 2 * n;
  const a = 2 * col + 1;
  const b = 2 * row + 1;
  switch (face) {
    case 0: return [a, m, b]; // U (y = max), rows back→front
    case 1: return [0, m - b, a]; // L, cols back→front
    case 2: return [a, m - b, m]; // F
    case 3: return [m, m - b, m - a]; // R
    case 4: return [m - a, m - b, 0]; // B
    case 5: return [a, 0, m - b]; // D, rows front→back
    default: throw new Error("bad face");
  }
}

/** 90° rotation of a point about the cube's central axis. sign=±1 picks direction. */
function rotatePoint(axis: 0 | 1 | 2, sign: 1 | -1, m: number, p: Vec): Vec {
  const [x, y, z] = p;
  const rot = (u: number, v: number): [number, number] => (sign === 1 ? [v, m - u] : [m - v, u]);
  if (axis === 0) {
    const [ny, nz] = rot(y, z);
    return [x, ny, nz];
  }
  if (axis === 1) {
    const [nz, nx] = rot(z, x);
    return [nx, y, nz];
  }
  const [nx, ny] = rot(x, y);
  return [nx, ny, z];
}

interface MoveDef {
  /** rotation axis: 0=x (L/R), 1=y (U/D), 2=z (F/B) */
  axis: 0 | 1 | 2;
  /** which end of the axis the face sits on: +1 = max coordinate */
  end: 1 | -1;
}
const MOVE_DEFS: Record<string, MoveDef> = {
  U: { axis: 1, end: 1 },
  D: { axis: 1, end: -1 },
  R: { axis: 0, end: 1 },
  L: { axis: 0, end: -1 },
  F: { axis: 2, end: 1 },
  B: { axis: 2, end: -1 },
};

/** Build the sticker permutation for one clockwise turn of `face`, layers [minDepth, maxDepth). */
function buildPermutation(
  n: number,
  face: string,
  depth: number,
  signs: Record<string, 1 | -1>,
  minDepth = 0,
): number[] {
  const m = 2 * n;
  const def = MOVE_DEFS[face];
  const total = FACE_COUNT * n * n;
  const posKey = (p: Vec) => `${p[0]},${p[1]},${p[2]}`;
  const posToIdx = new Map<string, number>();
  const positions: Vec[] = [];
  for (let i = 0; i < total; i++) {
    const f = Math.floor(i / (n * n));
    const cell = i % (n * n);
    const p = stickerPos(n, f, Math.floor(cell / n), cell % n);
    positions.push(p);
    posToIdx.set(posKey(p), i);
  }
  const inLayer = (p: Vec) => {
    const c = p[def.axis];
    const fromFace = def.end === 1 ? m - c : c; // 0 at the face, growing inward
    // Side stickers sit at odd depths (1,3,…), the near face at 0 and the far
    // face at 2n — the far plane belongs to the slab only for full rotations.
    return (
      fromFace >= 2 * minDepth &&
      (fromFace < 2 * depth || (depth === n && fromFace === 2 * n))
    );
  };
  const perm = positions.map((p, i) => {
    if (!inLayer(p)) return i;
    const q = rotatePoint(def.axis, signs[face], m, p);
    const j = posToIdx.get(posKey(q));
    if (j === undefined) throw new Error(`geometry error rotating ${face}`);
    return j;
  });
  // perm[i] = destination index of the sticker currently at i
  return perm;
}

/** Permutation from the verified 3x3 cycle tables: dest[i] for one turn. */
function permFromCycles3x3(face: string): number[] {
  const perm = Array.from({ length: 54 }, (_, i) => i);
  for (const cyc of CYCLES_3X3[face]) {
    for (let k = 0; k < cyc.length; k++) {
      perm[cyc[k]] = cyc[(k + 1) % cyc.length];
    }
  }
  return perm;
}

const signs: Record<string, 1 | -1> = {};
{
  // Calibrate each face's rotation direction against the proven 3x3 tables.
  for (const face of Object.keys(MOVE_DEFS)) {
    const want = permFromCycles3x3(face).join(",");
    let found: 1 | -1 | null = null;
    for (const s of [1, -1] as const) {
      const got = buildPermutation(3, face, 1, { ...signs, [face]: s }).join(",");
      if (got === want) {
        if (found !== null) throw new Error(`facelet geometry: ambiguous sign for ${face}`);
        found = s;
      }
    }
    if (found === null) throw new Error(`facelet geometry: no sign reproduces verified 3x3 ${face}`);
    signs[face] = found;
  }
}

/**
 * Precomputed 4x4 permutations: outer turns, wide (2-layer) turns, inner
 * slices ("2R" = second layer from R alone), and whole-cube rotations
 * (x follows R, y follows U, z follows F — all four layers).
 */
const PERMS_4: Record<string, number[]> = {};
for (const face of Object.keys(MOVE_DEFS)) {
  PERMS_4[face] = buildPermutation(4, face, 1, signs);
  PERMS_4[`${face}w`] = buildPermutation(4, face, 2, signs);
  PERMS_4[`2${face}`] = buildPermutation(4, face, 2, signs, 1);
  // sanity: order 4
  for (const key of [face, `${face}w`, `2${face}`]) {
    let p = PERMS_4[key];
    const apply = (perm: number[], arr: number[]) => {
      const out = new Array(arr.length);
      for (let i = 0; i < arr.length; i++) out[perm[i]] = arr[i];
      return out;
    };
    let arr = Array.from({ length: 96 }, (_, i) => i);
    for (let t = 0; t < 4; t++) arr = apply(p, arr);
    if (arr.some((v, i) => v !== i)) throw new Error(`facelet geometry: ${key}^4 != identity`);
  }
}

export type Facelets4 = number[][];

export const solvedFacelets4 = (): Facelets4 =>
  Array.from({ length: 6 }, (_, f) => Array.from({ length: 16 }, () => f));

/** Uniquely labeled stickers, for piece-identity calibration. */
export const labeledFacelets4 = (): Facelets4 =>
  Array.from({ length: 6 }, (_, f) => Array.from({ length: 16 }, (_, c) => f * 16 + c));

PERMS_4["x"] = buildPermutation(4, "R", 4, signs);
PERMS_4["y"] = buildPermutation(4, "U", 4, signs);
PERMS_4["z"] = buildPermutation(4, "F", 4, signs);
{
  // Whole-cube rotations must equal their wide-move decompositions — this
  // caught a slab-boundary bug once; keep it as a permanent init assertion.
  const compose = (a: number[], b: number[]) => a.map((_, i) => b[a[i]]);
  const inverse = (p: number[]) => {
    const inv = new Array<number>(p.length);
    p.forEach((v, i) => (inv[v] = i));
    return inv;
  };
  const checks: [string, string, string][] = [
    ["x", "Rw", "Lw"],
    ["y", "Uw", "Dw"],
    ["z", "Fw", "Bw"],
  ];
  for (const [rotName, wide, oppWide] of checks) {
    const expected = compose(PERMS_4[wide], inverse(PERMS_4[oppWide]));
    if (PERMS_4[rotName].join() !== expected.join()) {
      throw new Error(`facelet geometry: ${rotName} != ${wide}·${oppWide}'`);
    }
  }
}

const TOKEN_4 = /^(2?[UDFBRL]w?|[xyz])(2|')?$/;

/** Apply "U Rw2 2R2 x Fw' …" (outer, wide, inner-slice, rotations) to a 4x4 facelet array. */
export function applyMoves4(facelets: Facelets4, alg: string): Facelets4 {
  let flat = facelets.flat();
  for (const token of alg.split(/\s+/).filter(Boolean)) {
    const m = TOKEN_4.exec(token);
    if (!m || !PERMS_4[m[1]]) throw new Error(`4x4 sim: unsupported move ${token}`);
    const perm = PERMS_4[m[1]];
    const times = m[2] === "2" ? 2 : m[2] === "'" ? 3 : 1;
    for (let t = 0; t < times; t++) {
      const next = new Array(flat.length);
      for (let i = 0; i < flat.length; i++) next[perm[i]] = flat[i];
      flat = next;
    }
  }
  return Array.from({ length: 6 }, (_, f) => flat.slice(f * 16, f * 16 + 16));
}

export const isUniform4 = (facelets: Facelets4): boolean =>
  facelets.every((face) => face.every((c) => c === face[0]));
