# CubeFlow — Learn CFOP with Interactive 3D Cubes

A CFOP speedcubing tutorial and algorithm trainer. Every one of the 119 cases
(41 F2L · 57 OLL · 21 PLL) renders on a real, interactive 3D cube powered by
[cubing.js](https://js.cubing.net), scrambled to the case state, with
play/pause/step-through controls. The Cross is taught intuitively with
principles and worked example solves.

## Features

- **Interactive 3D players** — each case shows its true cube state (yellow on
  top, white cross on the bottom, like you actually hold it) and animates the
  algorithm move by move; the current move is highlighted in the notation
- **Trainer-style stickering** — PLL shows permutation colors, OLL shows only
  yellow-ness, F2L masks the last layer, Cross masks everything but the white
  cross (custom piece masks built for the yellow-top display frame)
- **Progress tracking** — mark cases learned; per-section progress bars and
  nav badges persist in `localStorage`
- **Quiz mode** — see a case state, recall the algorithm, reveal to check;
  optional unlearned-only drilling
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
