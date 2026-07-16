import type { AccentColor } from "./types";

/**
 * Static class maps per accent so Tailwind can see every class at build time.
 */
export const accents: Record<
  AccentColor,
  {
    text: string;
    bg: string;
    bgSoft: string;
    border: string;
    ring: string;
    cssVar: string;
  }
> = {
  white: {
    text: "text-cube-white",
    bg: "bg-cube-white",
    bgSoft: "bg-cube-white/10",
    border: "border-cube-white/40",
    ring: "ring-cube-white/30",
    cssVar: "var(--c-white)",
  },
  blue: {
    text: "text-cube-blue",
    bg: "bg-cube-blue",
    bgSoft: "bg-cube-blue/10",
    border: "border-cube-blue/40",
    ring: "ring-cube-blue/30",
    cssVar: "var(--c-blue)",
  },
  yellow: {
    text: "text-cube-yellow",
    bg: "bg-cube-yellow",
    bgSoft: "bg-cube-yellow/10",
    border: "border-cube-yellow/40",
    ring: "ring-cube-yellow/30",
    cssVar: "var(--c-yellow)",
  },
  red: {
    text: "text-cube-red",
    bg: "bg-cube-red",
    bgSoft: "bg-cube-red/10",
    border: "border-cube-red/40",
    ring: "ring-cube-red/30",
    cssVar: "var(--c-red)",
  },
  orange: {
    text: "text-cube-orange",
    bg: "bg-cube-orange",
    bgSoft: "bg-cube-orange/10",
    border: "border-cube-orange/40",
    ring: "ring-cube-orange/30",
    cssVar: "var(--c-orange)",
  },
  green: {
    text: "text-cube-green",
    bg: "bg-cube-green",
    bgSoft: "bg-cube-green/10",
    border: "border-cube-green/40",
    ring: "ring-cube-green/30",
    cssVar: "var(--c-green)",
  },
};

export const difficultyMeta = {
  easy: { label: "Beginner-friendly", short: "Easy", accent: "green" as AccentColor },
  medium: { label: "Intermediate", short: "Medium", accent: "orange" as AccentColor },
  hard: { label: "Finger-trick heavy", short: "Hard", accent: "red" as AccentColor },
};
