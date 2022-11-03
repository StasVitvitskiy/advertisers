import { calculateSimilarity } from "../jaccard-similarity/calculateSimilarity";
import noop from "lodash/noop"

export function getPotentialDuplicates(
    {
        lines,
        precalculatedData,
        logger = noop,
        logMemoryUsage,
    }: {
        lines: string[],
        precalculatedData: {
            shinglesByLine: { [line: string]: string },
            linesByShingle: { [shingle: string]: string }
        },
        logger?: (msg: string) => void,
        logMemoryUsage?: boolean
    }
) {
    const potentialMatches: [string, string, string][] = []

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const lineShingles = precalculatedData.shinglesByLine[line];

        const linesWithAtLeastOneShingle = new Set<string>()
        for (const shingle of lineShingles) {
            for (const lineWithShingle of precalculatedData.linesByShingle[shingle]) {
                linesWithAtLeastOneShingle.add(lineWithShingle)
            }
        }
        const allLinesWithAtLeastOneShingle = Array.from(linesWithAtLeastOneShingle)

        const totalPotentialsDuplicatesCount = allLinesWithAtLeastOneShingle.length
        for (let pdIndex = 0; pdIndex < totalPotentialsDuplicatesCount; pdIndex++) {
            const potentialDuplicate = allLinesWithAtLeastOneShingle[pdIndex];
            if (potentialDuplicate === line) {
                continue;
            }

            const { result: similarity } = calculateSimilarity(
                lineShingles,
                precalculatedData.shinglesByLine[potentialDuplicate]
            );
            if (similarity >= 0.8) {
                potentialMatches.push([
                    similarity.toFixed(2), line, potentialDuplicate
                ])
            }

            const memoryUsage = []
            if (logMemoryUsage) {
                for (const [key,value] of Object.entries(process.memoryUsage())){
                    memoryUsage.push(`Memory usage by ${key}, ${value/1000000}MB `)
                }
            }
            const memoryUsageReport = memoryUsage.length ? `\n\n` + memoryUsage.join(`\n`) : ""
            logger(
                `Processing advertiser ${index + 1}/${lines.length}\n` +
                `Processing potential duplicate: ${pdIndex + 1}/${totalPotentialsDuplicatesCount}` +
                memoryUsageReport
            );
        }
    }

    return potentialMatches
}