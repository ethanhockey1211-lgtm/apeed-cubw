/** Invert a simple space-separated move sequence (faces, wides, slices, rotations). */
export function invertMoves(alg: string): string {
  return alg
    .split(/\s+/)
    .filter(Boolean)
    .reverse()
    .map((m) => (m.endsWith("'") ? m.slice(0, -1) : m.endsWith("2") ? m : `${m}'`))
    .join(" ");
}
