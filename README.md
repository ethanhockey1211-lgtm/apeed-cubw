# CubeFlow — Learn CFOP with Interactive 3D Cubes

A CFOP speedcubing tutorial and algorithm trainer. Every one of the 119 cases
(41 F2L · 57 OLL · 21 PLL) renders on a real, interactive 3D cube powered by
[cubing.js](https://js.cubing.net), scrambled to the case state, with
play/pause/step-through controls. The Cross is taught intuitively with
principles and worked example solves.

## Features

- **The guided path** (`/learn`) — an 8-stage curriculum with honest time
  estimates: notation school → cross → intuitive F2L → 2-Look OLL (10 algs)
  → 2-Look PLL (6 algs, the "you now solve with CFOP" milestone) → full PLL
  → full OLL → F2L refinement. Stage progress is computed from the same
  learned-case ids as the sections, so the two views never disagree
- **Guided solves (reasoning-first learning)** — cross examples and five
  canonical F2L solves play with a live "why" caption per chunk of moves;
  when a chunk is tagged "a basic insert" the claim is machine-verified
  (the moves are literally that case's algorithm). Cross captions are
  grounded in per-move solved-edge counts from the verify script
- **Practice sandbox** — a button-driven virtual cube (with undo/reset) for
  free experimentation on the notation page, and case-loading on the F2L
  course so you solve pairs with your own hands, last layer masked
- **"Why it works" notes** — 2-look algorithms decomposed into known
  triggers (F-sandwich, sexy move, sledgehammer, M-U shuttles), shown on
  lesson and section cards alike
- **Notation school** — every move family (faces, primes/doubles, slices,
  wide moves, rotations) demonstrated on a tap-to-play 3D cube, plus an
  annotated walkthrough of R U R' U' with live move highlighting
- **2-Look lessons** — edge-orientation cases rendered with a corners-ignored
  mask so beginners see only what matters; the 7 corner cases and all 6
  2-look PLL algs are real full-set cases, so lesson progress carries over
- **Interactive 3D players** — each case shows its true cube state (yellow on
  top, white cross on the bottom, like you actually hold it) and animates the
  algorithm move by move; the current move is highlighted in the notation
- **Trainer-style stickering** — PLL shows permutation colors, OLL shows only
  yellow-ness, F2L masks the last layer, Cross masks everything but the white
  cross (custom piece masks built for the yellow-top display frame)
- **Progress tracking** — mark cases learned; per-section progress bars and
  nav badges persist in `localStorage`
- **Quiz modes** — recall (see the state, recall the alg) and recognition
  (multiple choice: name the case). Every quiz state gets a random AUF like a
  real solve, and cases you miss are weighted to come back more often
- **Search & filters** — by name, nickname, notation, recognition text, or
  difficulty tag on every section
- **Difficulty badges** — beginner-friendly vs finger-trick-heavy, so you
  don't try to learn OLL dot cases on day one
- **Dark theme by default** with light mode, cube-color accent palette, fully
  responsive with a bottom tab bar on mobile

- **Other puzzles** (`/puzzles`) — beginner methods for 2×2 (nine algs you
  already know from CFOP), 4×4 (reduction + the two parity fixes), Pyraminx
  (three algs, one found by exhaustive search) and Megaminx, all rendered on
  real multi-puzzle twisty players and machine-verified against their
  engines
- **Scramble solver** — paste any timer-app scramble (2×2–5×5), see your
  exact cube in 3D and an animated move-by-move solution (the scramble
  retraced in reverse — correct by construction), with strict notation
  validation and an optional "moves you've made since" field that gets
  unwound too
- **Photo & paint state solver** (`/solver`) — enter a 3×3 or 4×4 exactly
  as it looks (per-face photo auto-fill with tap-to-fix, or paint the net)
  and get a genuine computed solution. 3×3: ~20 moves via the cubing.js
  two-phase solver. 4×4: ~45 moves via the TNoodle three-phase engine (the
  WCA scramble solver, unlocked from cubing.js's lazy chunk by a
  postinstall patch) reducing centers+edges, then the verified 3×3
  pipeline finishing, with machine-verified parity algorithms as safety
  net. Nothing is assumed about either engine's internals: piece
  numbering, orientation conventions and TNoodle's symmetry frames are
  calibrated at runtime by driving the engines in tandem with an
  independent geometric simulator (which itself must reproduce the
  hand-verified 3×3 move tables to initialize). `npm run verify` proves
  the whole pipeline on random states end-to-end, and every solution is
  replayed on the simulator before display — a wrong answer cannot be
  shown

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · cubing.js · Framer Motion

## Development

```bash
npm install
npm run dev       # dev server
npm run build     # type-check + production build
npm run verify    # verify every algorithm against the cubing.js kpuzzle engine
```

## Algorithm data integrity

`npm run verify` checks all 119 cases against a real cube engine:

- every algorithm must produce a start state with the structure its section
  claims (e.g. a PLL state must have F2L intact and the top face oriented)
- every alternative algorithm must solve the *same case* as its primary
- **OLL**: the 57 cases are proven distinct and to cover the complete
  orientation space (up to AUF); per-group edge patterns and corner counts
  are asserted
- **F2L**: the 41 cases are proven to cover every possible corner+edge
  configuration exactly once, via combinatorial enumeration; the script
  includes a bidirectional BFS solver to propose algorithms for any gaps
- **Cross**: each worked example is verified to solve the white cross
  relative to centers, and each scramble is verified to actually break it
- **Guided path**: the three 2-look edge-orientation algorithms are verified
  to preserve F2L and produce the exact line/L/dot patterns their recognition
  tips describe, and every stage's tracked ids are checked against real cases
