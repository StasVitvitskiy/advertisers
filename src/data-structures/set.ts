const { performance } = require("perf_hooks");

// thanks to https://github.com/lovasoa/fast_array_intersect
function fastArrayIntersect<T>(arrays: ReadonlyArray<T>[]): T[] {
    if (arrays.length === 0) return [];

    // Put the smallest array in the beginning
    for (let i=1; i<arrays.length; i++) {
        if(arrays[i].length < arrays[0].length) {
            let tmp = arrays[0];
            arrays[0] = arrays[i];
            arrays[i] = tmp;
        }
    }

    // Create a map associating each element to its current count
    const set = new Map();
    for(const elem of arrays[0]) {
        set.set(elem, 1);
    }
    for (let i=1; i<arrays.length; i++) {
        let found = 0;
        for(const elem of arrays[i]) {
            const hashed = elem;
            const count = set.get(hashed)
            if (count === i) {
                set.set(hashed,  count + 1);
                found++;
            }
        }
        // Stop early if an array has no element in common with the smallest
        if (found === 0) return [];
    }

    // Output only the elements that have been seen as many times as there are arrays
    return arrays[0].filter(e => {
        const hashed = e;
        const count = set.get(hashed);
        if (count !== undefined) set.set(hashed, 0);
        return count === arrays.length
    });
}

function nonWrappedIntersection<T extends string | number | symbol>(
  item1: ArrayLike<T>,
  item2: ArrayLike<T>
): T[] {
  return fastArrayIntersect([Array.from(item1), Array.from(item2)])
}
export const intersection: typeof nonWrappedIntersection = performance.timerify(nonWrappedIntersection)

function nonWrappedUnion<T extends string | number | symbol>(
  item1: ArrayLike<T>,
  item2: ArrayLike<T>
): T[] {
    return Array.from(
        new Set(
            Array.from(item1).concat(Array.from(item2))
        )
    )
}
export const union: typeof nonWrappedUnion = performance.timerify(nonWrappedUnion)
