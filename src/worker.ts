import { performance } from "perf_hooks";
import { getPotentialDuplicates } from "./data-process/getPotentialDuplicates";

process.on("message", (workerData: {
    dataChunk: string[],
    precalculatedData: {
        shinglesByLine: { [line: string]: string },
        linesByShingle: { [shingle: string]: string }
    }
}) => {
    const {
        dataChunk: lines,
        precalculatedData,
    } = workerData

    const start = performance.now()
    const potentialDuplicates = getPotentialDuplicates({
        lines,
        precalculatedData,
    })

    process.send(
        {
            potentialDuplicates,
            executionTime: performance.now() - start
        }
    )

    // kill the child process
    process.exit();
})