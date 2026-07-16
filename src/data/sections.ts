import type { SectionDef, SectionId } from "../lib/types";
import { pllGroups, pllCases } from "./pll";
import { ollGroups, ollCases } from "./oll";
import { f2lGroups, f2lCases } from "./f2l";

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
    stickering: "Cross",
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
    stickering: "F2L",
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
    stickering: "OLL",
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
    stickering: "PLL",
    groups: pllGroups,
    cases: pllCases,
  },
];

export const sectionById = Object.fromEntries(
  sections.map((s) => [s.id, s]),
) as Record<SectionId, SectionDef>;
