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
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
  return { edge, corner };
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

// ——— Load app data (light TS→JS transform) ———
function loadTsData(path, exportNames) {
  let src = readFileSync(path, "utf8");
  src = src.replace(/import type[^;]+;/g, "");
  src = src.replace(/export interface \w+ \{[\s\S]*?\n\}/g, "");
  src = src.replace(/: (AlgCase|CaseGroup|CrossPrinciple|CrossLesson)\[\]/g, "");
  const dir = mkdtempSync(join(tmpdir(), "cubeflow-verify-"));
  const file = join(dir, "data.mjs");
  writeFileSync(file, src);
  return import(file).then((m) => exportNames.map((n) => m[n]));
}

const [pllCases] = await loadTsData("src/data/pll.ts", ["pllCases"]);
const [ollCases] = await loadTsData("src/data/oll.ts", ["ollCases"]);
const [f2lCases] = await loadTsData("src/data/f2l.ts", ["f2lCases"]);
const [crossLessons] = await loadTsData("src/data/cross.ts", ["crossLessons"]);

let failures = 0;
function verifySet(label, cases, check) {
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
    // Alternatives must produce the exact same case state as the primary alg
    // (not merely a valid case of this type), so users can swap them freely.
    const primary = normalized(caseStateFor(c.alg));
    for (const alt of c.altAlgs ?? []) {
      const altState = normalized(caseStateFor(alt));
      if (!primary || !altState || !primary.isIdentical(altState)) {
        failures++;
        console.error(`FAIL ${label} ${c.id}: alt does not match primary case state: ${alt}`);
      }
    }
  }
  console.log(`${label}: checked ${cases.length} cases`);
}

verifySet("PLL", pllCases ?? [], checkPLL);
verifySet("OLL", ollCases ?? [], checkOLL);
verifySet("F2L", f2lCases ?? [], checkF2L);

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
