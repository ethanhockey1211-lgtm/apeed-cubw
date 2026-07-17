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
