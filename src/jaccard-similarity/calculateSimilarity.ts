import { intersection, union } from "../data-structures/set";
const { performance } = require("perf_hooks");

function nonWrappedCalculateSimilarity<T extends string | number | symbol>(
  set1: ArrayLike<T>,
  set2: ArrayLike<T>
): { result: number } {
  return {
    result: intersection(set1, set2).length / union(set1, set2).length || 0
  };
}
export const calculateSimilarity: typeof nonWrappedCalculateSimilarity = performance.timerify(nonWrappedCalculateSimilarity)
