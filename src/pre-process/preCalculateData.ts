import * as fs from "fs";
import { getShingles } from "../shingling/getShingles";
const { performance } = require("perf_hooks");

async function nonWrapperPreCalculateData(
    fileName: string,
    maxLines?: number | undefined
) {
    const lines = (await fs.promises.readFile(fileName))
        .toString()
        .split(`\n`)
        .filter(Boolean).slice(0, maxLines);
    const precalculatedData = lines.reduce(
        (acc, line) => {
            const shingles = getShingles(line);

            for (const shingle of shingles) {
                if (!acc.linesByShingle[shingle]) {
                    acc.linesByShingle[shingle] = [];
                }

                acc.linesByShingle[shingle].push(line);
            }
            acc.shinglesByLine[line] = shingles;

            return acc;
        },
        {
            linesByShingle: {},
            shinglesByLine: {}
        }
    );

    return {
        lines,
        precalculatedData,
    }
}

export const preCalculateData: typeof nonWrapperPreCalculateData = performance.timerify(nonWrapperPreCalculateData)