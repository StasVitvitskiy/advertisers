import { normalizeLine } from "./normalizeLine";
const { performance } = require("perf_hooks");

function nonWrappedGetShingles(line: string, k: number = 3): string[] {
  const normalizedLine = normalizeLine(line);
  return normalizedLine.match(new RegExp(`.{1,${k}}`, "g")) || [];
}
export const getShingles: typeof nonWrappedGetShingles = performance.timerify(nonWrappedGetShingles)
