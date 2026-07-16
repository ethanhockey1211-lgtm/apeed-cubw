/**
 * Verifies every algorithm in the app against the cubing.js kpuzzle engine.
 *
 * For a case displayed with setupAnchor "end", the start state is
 * inverse(alg) applied to solved. We check that this start state has the
 * structure the case claims (e.g. a PLL start state must have F2L intact and
 * the whole top face oriented). A single-move typo in an alg almost always
 * breaks these invariants, so this catches bad data before it ships.
 *
 * Run: node scripts/verify-algs.mjs
 */
import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";

const kpuzzle = await cube3x3x3.kpuzzle();
const solved = kpuzzle.defaultPattern();

const stateAfter = (algString) => solved.applyAlg(new Alg(algString));
const caseStateFor = (algString) => solved.applyAlg(new Alg(algString).invert());

// ——— Identify piece positions empirically ———
function movedPositions(orbitName, moveString) {
  const t = kpuzzle.algToTransformation(new Alg(moveString));
  const data = t.transformationData[orbitName];
  const out = [];
  for (let i = 0; i < data.permutation.length; i++) {
    if (data.permutation[i] !== i || data.orientationDelta[i] !== 0) out.push(i);
  }
  return out;
}

const FACES = ["U", "D", "F", "B", "R", "L"];
const faceEdges = Object.fromEntries(FACES.map((f) => [f, movedPositions("EDGES", f)]));
const faceCorners = Object.fromEntries(FACES.map((f) => [f, movedPositions("CORNERS", f)]));

const U_EDGES = faceEdges.U;
const U_CORNERS = faceCorners.U;

// The four F2L slots: an E-layer edge position + the D corner position below it.
const E_EDGES = Array.from({ length: 12 }, (_, i) => i).filter(
  (i) => !faceEdges.U.includes(i) && !faceEdges.D.includes(i),
);
const SLOTS = E_EDGES.map((edge) => {
  const sides = FACES.filter((f) => f !== "U" && f !== "D" && faceEdges[f].includes(edge));
  const corner = faceCorners.D.find((c) => sides.every((f) => faceCorners[f].includes(c)));
  return { edge, corner, sidesKey: [...sides].sort().join("") };
});

// ——— Frame normalization ———
// A state may carry a net cube rotation (from x/y/z in the alg). Exactly one
// of the 24 rotations restores the centers; checks run on that normalized view.
const ROTATIONS = [];
for (const base of ["", "x", "x'", "x2", "z", "z'"]) {
  for (const y of ["", "y", "y'", "y2"]) {
    ROTATIONS.push([base, y].filter(Boolean).join(" "));
  }
}

const orbit = (pattern, name) => pattern.patternData[name];
const pieceSolved = (p, orbitName, i) =>
  orbit(p, orbitName).pieces[i] === i && orbit(p, orbitName).orientation[i] === 0;
const centersSolved = (p) => {
  const o = orbit(p, "CENTERS");
  return o.pieces.every((x, i) => x === i && o.orientation[i] === 0);
};

function normalized(pattern) {
  for (const r of ROTATIONS) {
    const p = r ? pattern.applyAlg(new Alg(r)) : pattern;
    if (centersSolved(p)) return p;
  }
  return null; // slice moves scrambled the centers — cannot normalize
}

// ——— Structural checks (all receive a centers-solved pattern) ———
const EDGE_IDX = Array.from({ length: 12 }, (_, i) => i);
const CORNER_IDX = Array.from({ length: 8 }, (_, i) => i);

// F2L intact + top layer fully oriented; only the top permutation differs.
const checkPLL = (p) =>
  EDGE_IDX.every((i) =>
    U_EDGES.includes(i)
      ? U_EDGES.includes(orbit(p, "EDGES").pieces[i]) && orbit(p, "EDGES").orientation[i] === 0
      : pieceSolved(p, "EDGES", i),
  ) &&
  CORNER_IDX.every((i) =>
    U_CORNERS.includes(i)
      ? U_CORNERS.includes(orbit(p, "CORNERS").pieces[i]) &&
        orbit(p, "CORNERS").orientation[i] === 0
      : pieceSolved(p, "CORNERS", i),
  );

// F2L intact; the top layer may be permuted and misoriented freely.
const checkOLL = (p) =>
  EDGE_IDX.every((i) => U_EDGES.includes(i) || pieceSolved(p, "EDGES", i)) &&
  CORNER_IDX.every((i) => U_CORNERS.includes(i) || pieceSolved(p, "CORNERS", i));

// Everything solved except the top layer and exactly one corner/edge slot pair.
function checkF2L(p) {
  const badEdges = EDGE_IDX.filter((i) => !U_EDGES.includes(i) && !pieceSolved(p, "EDGES", i));
  const badCorners = CORNER_IDX.filter(
    (i) => !U_CORNERS.includes(i) && !pieceSolved(p, "CORNERS", i),
  );
  if (badEdges.length === 0 && badCorners.length === 0) return true; // pure AUF-ish
  return SLOTS.some(
    ({ edge, corner }) =>
      badEdges.every((e) => e === edge) && badCorners.every((c) => c === corner),
  );
}

// White cross solved relative to centers (white center is U once normalized).
const checkCross = (p) => U_EDGES.every((i) => pieceSolved(p, "EDGES", i));

function passes(pattern, check) {
  const p = normalized(pattern);
  return p !== null && check(p);
}

// ——— Case-identity keys ———
// OLL case = last-layer orientation class up to AUF. Under a U move the
// orientation arrays shift by index (+1 mod 4) on both orbits.
function ollStateKey(p) {
  const eo = orbit(p, "EDGES");
  const co = orbit(p, "CORNERS");
  const keys = [];
  for (let k = 0; k < 4; k++) {
    const e = [0, 1, 2, 3].map((i) => eo.orientation[U_EDGES[(i + k) % 4]]);
    const c = [0, 1, 2, 3].map((i) => co.orientation[U_CORNERS[(i + k) % 4]]);
    keys.push([...e, ...c].join(""));
  }
  return keys.sort()[0];
}

const FR_EDGE = SLOTS.find(({ sidesKey }) => sidesKey === "FR")?.edge ?? -1;
const DFR_CORNER = SLOTS.find(({ sidesKey }) => sidesKey === "FR")?.corner ?? -1;

// F2L case = exact (pair corner, pair edge) placement — fully visible under
// F2L stickering, so alts must match it exactly.
function f2lRawTuple(p) {
  const co = orbit(p, "CORNERS");
  const eo = orbit(p, "EDGES");
  const cPos = co.pieces.indexOf(DFR_CORNER);
  const ePos = eo.pieces.indexOf(FR_EDGE);
  return { cPos, cOri: co.orientation[cPos], ePos, eOri: eo.orientation[ePos] };
}
const f2lRawKey = (p) => {
  const t = f2lRawTuple(p);
  return `c${t.cPos}o${t.cOri}e${t.ePos}o${t.eOri}`;
};

// ——— Self-tests for the checkers ———
let selfTestFailures = 0;
function expect(name, cond) {
  if (!cond) {
    selfTestFailures++;
    console.error(`SELF-TEST FAILED: ${name}`);
  }
}
expect("solved passes PLL", passes(solved, checkPLL));
expect("U2 state passes PLL", passes(stateAfter("U2"), checkPLL));
expect("R state fails PLL", !passes(stateAfter("R"), checkPLL));
expect("T-perm case passes PLL", passes(caseStateFor("R U R' U' R' F R2 U' R' U' R U R' F'"), checkPLL));
expect("sexy-move case fails OLL (breaks F2L)", !passes(caseStateFor("R U R' U'"), checkOLL));
expect("Sune case passes OLL", passes(caseStateFor("R U R' U R U2 R'"), checkOLL));
expect("F2 state fails OLL", !passes(stateAfter("F2"), checkOLL));
expect("basic insert passes F2L", passes(caseStateFor("U R U' R'"), checkF2L));
expect("rotation insert passes F2L", passes(caseStateFor("y U' L' U L"), checkF2L));
expect("two-slot damage fails F2L", !passes(stateAfter("R L"), checkF2L));
expect("z2 solved passes cross", passes(stateAfter("z2"), checkCross));
expect("z2 + cross-preserving noise passes cross", passes(stateAfter("z2 R U R' F U2 F'"), checkCross));
expect("z2 R fails cross", !passes(stateAfter("z2 R"), checkCross));
if (selfTestFailures > 0) {
  console.error("Checker self-tests failed — aborting");
  process.exit(2);
}

// ——— Load app data (run with: node --experimental-strip-types) ———
const { pllCases } = await import("../src/data/pll.ts");
const { ollCases } = await import("../src/data/oll.ts");
const { f2lCases } = await import("../src/data/f2l.ts");
const { crossLessons } = await import("../src/data/cross.ts");

let failures = 0;
function verifySet(label, cases, check, sameCase) {
  for (const c of cases) {
    for (const [kind, alg] of [["primary", c.alg], ...(c.altAlgs ?? []).map((a) => ["alt", a])]) {
      let ok = false;
      let err = "";
      try {
        ok = passes(caseStateFor(alg), check);
      } catch (e) {
        err = ` (${e})`;
      }
      if (!ok) {
        failures++;
        console.error(`FAIL ${label} ${c.id} [${kind}]: ${alg}${err}`);
      }
    }
    // Alternatives must solve the same case as the primary alg (same visible
    // state under this section's stickering), so users can swap them freely.
    const primary = normalized(caseStateFor(c.alg));
    for (const alt of c.altAlgs ?? []) {
      const altState = normalized(caseStateFor(alt));
      if (!primary || !altState || !sameCase(primary, altState)) {
        failures++;
        console.error(`FAIL ${label} ${c.id}: alt does not match primary case state: ${alt}`);
      }
    }
  }
  console.log(`${label}: checked ${cases.length} cases`);
}

verifySet("PLL", pllCases ?? [], checkPLL, (a, b) => a.isIdentical(b));
verifySet("OLL", ollCases ?? [], checkOLL, (a, b) => ollStateKey(a) === ollStateKey(b));
verifySet("F2L", f2lCases ?? [], checkF2L, (a, b) => f2lRawKey(a) === f2lRawKey(b));

for (const lesson of crossLessons ?? []) {
  if (!passes(stateAfter(`z2 ${lesson.scramble} ${lesson.solution}`), checkCross)) {
    failures++;
    console.error(`FAIL cross lesson "${lesson.title}": ${lesson.scramble} → ${lesson.solution}`);
  }
  if (passes(stateAfter(`z2 ${lesson.scramble}`), checkCross)) {
    failures++;
    console.error(`FAIL cross lesson "${lesson.title}": scramble leaves cross already solved`);
  }
}
console.log(`Cross: checked ${(crossLessons ?? []).length} lessons`);

// ——— OLL: orientation-pattern verification ———
// The shape family of an OLL case is fully determined by which edges are
// oriented; corner counts pin it down further. Both are computed from the alg
// and checked against the group the case claims to belong to.
const OLL_GROUP_EXPECTATIONS = {
  cross: { pattern: "4" },
  corners: { pattern: null }, // 28 = 2adj, 57 = 2opp — asserted per case below
  t: { pattern: "2opp", corners: 2 },
  p: { pattern: "2adj", corners: 2 },
  line: { pattern: "2opp", corners: 0 },
  square: { pattern: "2adj", corners: 1 },
  smallbolt: { pattern: "2adj", corners: 1 },
  bigbolt: { pattern: "2opp", corners: 2 },
  fish: { pattern: "2adj" },
  knight: { pattern: "2opp", corners: 1 },
  c: { pattern: "2opp", corners: 2 },
  w: { pattern: "2adj", corners: 2 },
  awkward: { pattern: "2adj", corners: 2 },
  l: { pattern: "2adj", corners: 0 },
  dot: { pattern: "0" },
};
const OLL_CASE_CORNERS = {
  "oll-1": 0, "oll-2": 0, "oll-3": 1, "oll-4": 1, "oll-17": 2, "oll-18": 2,
  "oll-19": 2, "oll-20": 4, "oll-21": 0, "oll-22": 0, "oll-23": 2, "oll-24": 2,
  "oll-25": 2, "oll-26": 1, "oll-27": 1, "oll-28": 4, "oll-57": 4,
  "oll-9": 1, "oll-10": 1, "oll-35": 2, "oll-37": 2,
};
const OLL_CASE_PATTERN = { "oll-28": "2adj", "oll-57": "2opp" };

function ollProfile(algString) {
  const p = normalized(caseStateFor(algString));
  if (!p) return null;
  const eo = orbit(p, "EDGES");
  const co = orbit(p, "CORNERS");
  const edgesUp = U_EDGES.filter((i) => eo.orientation[i] === 0);
  const cornersUp = U_CORNERS.filter((i) => co.orientation[i] === 0);
  let pattern;
  if (edgesUp.length === 0) pattern = "0";
  else if (edgesUp.length === 4) pattern = "4";
  else if (edgesUp.length === 2) pattern = Math.abs(edgesUp[0] - edgesUp[1]) === 2 ? "2opp" : "2adj";
  else pattern = `impossible(${edgesUp.length})`;
  return { pattern, corners: cornersUp.length, p };
}

if ((ollCases ?? []).length > 0) {
  const seenKeys = new Map();
  console.log("\nOLL profiles (group | edge pattern | corners oriented):");
  for (const c of ollCases) {
    const prof = ollProfile(c.alg);
    if (!prof) {
      failures++;
      console.error(`FAIL OLL ${c.id}: cannot normalize state`);
      continue;
    }
    const exp = OLL_GROUP_EXPECTATIONS[c.group] ?? {};
    const expPattern = OLL_CASE_PATTERN[c.id] ?? exp.pattern;
    const expCorners = OLL_CASE_CORNERS[c.id] ?? exp.corners;
    let flag = "";
    if (expPattern != null && prof.pattern !== expPattern) {
      failures++;
      flag += `  << EDGE PATTERN MISMATCH (expected ${expPattern})`;
    }
    if (expCorners != null && prof.corners !== expCorners) {
      failures++;
      flag += `  << CORNER COUNT MISMATCH (expected ${expCorners})`;
    }
    const key = ollStateKey(prof.p);
    if (seenKeys.has(key)) {
      failures++;
      flag += `  << DUPLICATE CASE of ${seenKeys.get(key)}`;
    }
    seenKeys.set(key, c.id);
    console.log(`${c.id.padEnd(8)} ${c.group.padEnd(10)} ${prof.pattern.padEnd(5)} ${prof.corners}${flag}`);
  }
  if (ollCases.length === 57 && seenKeys.size !== 57) {
    failures++;
    console.error(`OLL coverage: only ${seenKeys.size}/57 distinct cases`);
  } else if (ollCases.length === 57) {
    console.log("OLL coverage: 57/57 distinct cases ✓");
  }
}

// ——— Sticker-facing calibration (for descriptions & tip fact-checking) ———
// Corner frames: faces in clockwise order (from above) starting at U.
const CORNER_FRAMES = { 0: ["U", "R", "F"], 1: ["U", "B", "R"], 2: ["U", "L", "B"], 3: ["U", "F", "L"] };
// After F, position UFR (0) holds a piece whose U-axis sticker faces R.
const fOri = stateAfter("F").patternData["CORNERS"].orientation[0];
const aFactor = fOri === 1 ? 1 : 2;
const cornerFacingU = (pos, ori) => CORNER_FRAMES[pos][(aFactor * ori) % 3];
{
  // Cross-check with R': UFR should then have its U-axis sticker facing F.
  const rOri = stateAfter("R'").patternData["CORNERS"].orientation[0];
  if (cornerFacingU(0, rOri) !== "F") {
    console.error("SELF-TEST FAILED: corner facing calibration");
    process.exit(2);
  }
}
// Corner in the DFR slot: which way does its U/D-axis sticker point?
// After F, the DFR position holds the UFR piece with its U sticker facing R.
const dfrOriFacingR = stateAfter("F").patternData["CORNERS"].orientation[DFR_CORNER];
const slotCornerFacing = (ori) => (ori === 0 ? "D" : ori === dfrOriFacingR ? "R" : "F");
// Edges: ori 0 at any U position = the piece's F/B-axis sticker faces up.
// (Verified: "R" carries FR to UR with green up and ori stays 0.)
{
  const s = stateAfter("R").patternData["EDGES"];
  const pos = s.pieces.indexOf(FR_EDGE);
  if (s.orientation[pos] !== 0) {
    console.error("SELF-TEST FAILED: edge orientation convention");
    process.exit(2);
  }
}

// ——— F2L: full combinatorial coverage verification ———
// Enumerate every possible (DFR corner, FR edge) configuration up to AUF and
// check the authored cases map onto them exactly one-to-one.
if ((f2lCases ?? []).length > 0) {
  const uCornerNext = {}; // position -> position after a U move
  const uEdgeNext = {};
  {
    const t = kpuzzle.algToTransformation(new Alg("U"));
    const cp = t.transformationData["CORNERS"].permutation;
    const ep = t.transformationData["EDGES"].permutation;
    // cp[dst] = src means the piece at src moves to dst
    for (let dst = 0; dst < 8; dst++) if (cp[dst] !== dst) uCornerNext[cp[dst]] = dst;
    for (let dst = 0; dst < 12; dst++) if (ep[dst] !== dst) uEdgeNext[ep[dst]] = dst;
  }
  const aufTuple = ({ cPos, cOri, ePos, eOri }) => ({
    cPos: uCornerNext[cPos] ?? cPos,
    cOri,
    ePos: uEdgeNext[ePos] ?? ePos,
    eOri,
  });
  const keyOf = (t0) => {
    const variants = [];
    let t = t0;
    for (let k = 0; k < 4; k++) {
      variants.push(`c${t.cPos}o${t.cOri}e${t.ePos}o${t.eOri}`);
      t = aufTuple(t);
    }
    variants.sort();
    return variants[0];
  };

  // All valid raw tuples
  const allKeys = new Set();
  for (const cPos of [...U_CORNERS, DFR_CORNER]) {
    for (let cOri = 0; cOri < 3; cOri++) {
      for (const ePos of [...U_EDGES, FR_EDGE]) {
        for (let eOri = 0; eOri < 2; eOri++) {
          if (cPos === DFR_CORNER && cOri === 0 && ePos === FR_EDGE && eOri === 0) continue;
          allKeys.add(keyOf({ cPos, cOri, ePos, eOri }));
        }
      }
    }
  }
  console.log(`\nF2L: ${allKeys.size} possible configurations (expect 41)`);

  const posName = { corner: { 0: "UFR", 1: "UBR", 2: "UBL", 3: "UFL", [DFR_CORNER]: "slot" }, edge: { 0: "UF", 1: "UR", 2: "UB", 3: "UL", [FR_EDGE]: "slot" } };
  const describeTuple = (t) => {
    const cw =
      t.cPos === DFR_CORNER
        ? `corner in slot, white→${slotCornerFacing(t.cOri)}`
        : `corner ${posName.corner[t.cPos]}, white→${cornerFacingU(t.cPos, t.cOri)}`;
    const ew =
      t.ePos === FR_EDGE
        ? `edge in slot${t.eOri === 0 ? "" : " flipped"}`
        : `edge ${posName.edge[t.ePos]}, ${t.eOri === 0 ? "F-color up" : "R-color up"}`;
    return `${cw}; ${ew}`;
  };
  const seen = new Map();
  for (const c of f2lCases) {
    const p = normalized(caseStateFor(c.alg));
    if (!p) {
      failures++;
      console.error(`FAIL F2L ${c.id}: cannot normalize`);
      continue;
    }
    const tuple = f2lRawTuple(p);
    const key = keyOf(tuple);
    let flag = "";
    if (!allKeys.has(key)) {
      failures++;
      flag += "  << NOT A VALID PAIR CONFIG";
    }
    if (seen.has(key)) {
      failures++;
      flag += `  << DUPLICATE of ${seen.get(key)}`;
    }
    seen.set(key, c.id);
    console.log(`${c.id.padEnd(9)} [${c.group.padEnd(11)}] ${describeTuple(tuple).padEnd(58)} ${c.alg}${flag}`);
  }
  const missing = [...allKeys].filter((k) => !seen.has(k));
  if (missing.length > 0) {
    console.error(`F2L coverage: ${seen.size}/${allKeys.size} — ${missing.length} configs missing`);
    if (f2lCases.length >= 41) failures++;

    // ——— Suggest algorithms for missing configs via bidirectional BFS ———
    // Projection: positions+orientations of the 12 F2L-relevant pieces
    // (D corners, D edges, E edges). LL pieces are ignored, which encodes
    // "any AUF / LL permutation is fine".
    const TRACKED_CORNERS = faceCorners.D;
    const TRACKED_EDGES = [...faceEdges.D, ...E_EDGES];
    const MOVES = ["U", "U'", "U2", "R", "R'", "R2", "F", "F'", "F2"];
    const moveTables = MOVES.map((m) => {
      const t = kpuzzle.algToTransformation(new Alg(m));
      const c = t.transformationData["CORNERS"];
      const e = t.transformationData["EDGES"];
      const cDst = Array(8), cDelta = Array(8), eDst = Array(12), eDelta = Array(12);
      for (let dst = 0; dst < 8; dst++) { cDst[c.permutation[dst]] = dst; cDelta[c.permutation[dst]] = c.orientationDelta[dst]; }
      for (let dst = 0; dst < 12; dst++) { eDst[e.permutation[dst]] = dst; eDelta[e.permutation[dst]] = e.orientationDelta[dst]; }
      return { cDst, cDelta, eDst, eDelta };
    });
    const projOf = (p) => {
      const co = orbit(p, "CORNERS"), eo = orbit(p, "EDGES");
      const parts = [];
      for (const piece of TRACKED_CORNERS) {
        const pos = co.pieces.indexOf(piece);
        parts.push(pos, co.orientation[pos]);
      }
      for (const piece of TRACKED_EDGES) {
        const pos = eo.pieces.indexOf(piece);
        parts.push(pos, eo.orientation[pos]);
      }
      return parts;
    };
    const applyMove = (proj, mi) => {
      const { cDst, cDelta, eDst, eDelta } = moveTables[mi];
      const out = proj.slice();
      for (let i = 0; i < 4; i++) {
        const pos = proj[i * 2], ori = proj[i * 2 + 1];
        out[i * 2] = cDst[pos];
        out[i * 2 + 1] = (ori + cDelta[pos]) % 3;
      }
      for (let i = 0; i < 8; i++) {
        const base = 8 + i * 2;
        const pos = proj[base], ori = proj[base + 1];
        out[base] = eDst[pos];
        out[base + 1] = (ori + eDelta[pos]) % 2;
      }
      return out;
    };
    const invMove = { "U": "U'", "U'": "U", "U2": "U2", "R": "R'", "R'": "R", "R2": "R2", "F": "F'", "F'": "F", "F2": "F2" };
    const goalProj = projOf(solved);
    const solveProj = (startProj) => {
      // bidirectional BFS, depth ≤ 6 each side
      let fwd = new Map([[startProj.join(","), []]]);
      let bwd = new Map([[goalProj.join(","), []]]);
      if (fwd.has(goalProj.join(","))) return [];
      for (let depth = 0; depth < 11; depth++) {
        const expandFwd = fwd.size <= bwd.size;
        const src = expandFwd ? fwd : bwd;
        const next = new Map();
        for (const [k, path] of src) {
          const proj = k.split(",").map(Number);
          for (let mi = 0; mi < MOVES.length; mi++) {
            const np = applyMove(proj, mi);
            const nk = np.join(",");
            if (src.has(nk) || next.has(nk)) continue;
            const npath = [...path, mi];
            const other = expandFwd ? bwd : fwd;
            if (other.has(nk)) {
              const otherPath = other.get(nk);
              const fwdPath = expandFwd ? npath : otherPath;
              const bwdPath = expandFwd ? otherPath : npath;
              return [...fwdPath.map((i) => MOVES[i]), ...bwdPath.slice().reverse().map((i) => invMove[MOVES[i]])];
            }
            next.set(nk, npath);
          }
        }
        for (const [k, v] of next) src.set(k, v);
      }
      return null;
    };
    // Build a representative state for each missing config key
    console.log("Suggested algorithms for missing configs:");
    for (const missKey of missing) {
      const m = missKey.match(/c(\d+)o(\d+)e(\d+)o(\d+)/);
      const [cPos, cOri, ePos, eOri] = [+m[1], +m[2], +m[3], +m[4]];
      // construct projection: solved, then relocate pair pieces
      const proj = projOf(solved).slice();
      const cIdx = TRACKED_CORNERS.indexOf(DFR_CORNER) * 2;
      const eIdx = 8 + TRACKED_EDGES.indexOf(FR_EDGE) * 2;
      proj[cIdx] = cPos; proj[cIdx + 1] = cOri;
      proj[eIdx] = ePos; proj[eIdx + 1] = eOri;
      const sol = solveProj(proj);
      console.log(`  ${missKey}  (${describeTuple({ cPos, cOri, ePos, eOri })})`);
      console.log(`    → ${sol ? sol.join(" ") : "no solution ≤ 12 moves found"}`);
    }
  } else {
    console.log(`F2L coverage: ${seen.size}/${allKeys.size} configurations covered ✓`);
  }
}

// ——— Report U-layer cycle structure for direction-sensitive recognition tips ———
console.log("\nU-layer mappings (position <- piece) for fact-checking tips:");
for (const id of ["pll-ua", "pll-ub", "pll-aa", "pll-ab"]) {
  const c = (pllCases ?? []).find((x) => x.id === id);
  if (!c) continue;
  const p = normalized(caseStateFor(c.alg));
  if (!p) continue;
  const orbitName = id.startsWith("pll-u") ? "EDGES" : "CORNERS";
  const positions = orbitName === "EDGES" ? U_EDGES : U_CORNERS;
  const o = orbit(p, orbitName);
  console.log(`${id}: ${positions.map((pos) => `${pos}<-${o.pieces[pos]}`).join("  ")}`);
}

if (failures > 0) {
  console.error(`\n${failures} algorithm(s) FAILED verification`);
  process.exit(1);
}
console.log("\nAll algorithms verified ✓");
