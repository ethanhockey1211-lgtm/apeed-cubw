import type { SectionDef, SectionId } from "../lib/types";
import { pllGroups, pllCases } from "./pll";
import { ollGroups, ollCases } from "./oll";
import { f2lGroups, f2lCases } from "./f2l";
import { WHITE_CROSS_MASK } from "./cross";

/*
 * Custom stickering masks for the yellow-top display frame (every player uses
 * a z2 setup so white is on the bottom, the way cubers actually hold the
 * cube). The built-in OLL/PLL/F2L stickerings mark the model-U pieces — the
 * WHITE layer — which sits at the bottom in this frame, so we mask the
 * yellow-family pieces (edge/corner indices 4-7) instead. Masks are
 * piece-indexed: EDGES 0-3 white layer, 4-7 yellow layer, 8-11 E-layer;
 * CORNERS 0-3 white, 4-7 yellow; CENTERS in U,L,F,R,B,D order.
 */
const YELLOW_TOP_MASKS = {
  // Last layer full color (permutation matters), everything else dimmed.
  pll: "EDGES:DDDDPPPPDDDD,CORNERS:DDDDPPPP,CENTERS:DDDDDD",
  // Last layer shows only yellow-ness (orientation), rest dimmed.
  oll: "EDGES:DDDDOOOODDDD,CORNERS:DDDDOOOO,CENTERS:DDDDD-",
  // Last layer ignored, first two layers full color.
  f2l: "EDGES:----IIII----,CORNERS:----IIII,CENTERS:------",
};

export const sections: SectionDef[] = [
  {
    id: "cross",
    name: "Cross",
    fullName: "The Cross",
    step: 1,
    tagline: "Four edges, solved on intuition",
    description:
      "Solve the four white edges around the white center — planned during inspection, executed blind. No algorithms here, just spatial reasoning you build with practice.",
    accent: "white",
    stickering: "full",
    stickeringMask: WHITE_CROSS_MASK,
    groups: [],
    cases: [],
  },
  {
    id: "f2l",
    name: "F2L",
    fullName: "First Two Layers",
    step: 2,
    tagline: "Pair up, slot in — 41 cases",
    description:
      "Pair each corner with its matching edge and insert them into a slot together. Learn it intuitively first, then use these algorithms to smooth out your worst cases.",
    accent: "blue",
    stickering: "full",
    stickeringMask: YELLOW_TOP_MASKS.f2l,
    groups: f2lGroups,
    cases: f2lCases,
  },
  {
    id: "oll",
    name: "OLL",
    fullName: "Orientation of the Last Layer",
    step: 3,
    tagline: "Make the top yellow — 57 cases",
    description:
      "One algorithm turns the entire top face yellow. Recognize the case by the shape the yellow stickers make, then execute. Learn the easy shapes first.",
    accent: "yellow",
    stickering: "full",
    stickeringMask: YELLOW_TOP_MASKS.oll,
    groups: ollGroups,
    cases: ollCases,
  },
  {
    id: "pll",
    name: "PLL",
    fullName: "Permutation of the Last Layer",
    step: 4,
    tagline: "The final 21 algorithms",
    description:
      "The top is yellow — now slide the pieces into place. One of 21 algorithms finishes the solve. This is the smallest set and the most satisfying to master.",
    accent: "red",
    stickering: "full",
    stickeringMask: YELLOW_TOP_MASKS.pll,
    groups: pllGroups,
    cases: pllCases,
  },
];

export const sectionById = Object.fromEntries(
  sections.map((s) => [s.id, s]),
) as Record<SectionId, SectionDef>;
