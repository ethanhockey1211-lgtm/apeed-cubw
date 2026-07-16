export type Difficulty = "easy" | "medium" | "hard";

export interface AlgCase {
  /** Stable id used for progress storage, e.g. "pll-t", "oll-21" */
  id: string;
  /** Display name, e.g. "T Perm", "OLL 21" */
  name: string;
  /** Optional secondary label, e.g. the shape nickname for OLL */
  nickname?: string;
  /** Group key, must match a CaseGroup id in the section */
  group: string;
  /** Primary algorithm (the one animated by default) */
  alg: string;
  /** Common alternative algorithms */
  altAlgs?: string[];
  /** What to look for on the cube to identify this case */
  recognition: string;
  difficulty: Difficulty;
}

export interface CaseGroup {
  id: string;
  name: string;
  description?: string;
}

export type SectionId = "cross" | "f2l" | "oll" | "pll";

export type AccentColor = "white" | "blue" | "yellow" | "red" | "orange" | "green";

export interface SectionDef {
  id: SectionId;
  name: string;
  fullName: string;
  step: number;
  tagline: string;
  description: string;
  accent: AccentColor;
  /** cubing.js experimental stickering used for this section's players */
  stickering: string;
  groups: CaseGroup[];
  cases: AlgCase[];
}
