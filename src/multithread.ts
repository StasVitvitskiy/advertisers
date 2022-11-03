import { preCalculateData } from "./pre-process/preCalculateData";
import chunk from "lodash/chunk"
import { writeOutput } from "./post-process/writeOutput";
import { getPotentialDuplicates } from "./data-process/getPotentialDuplicates";
const childProcess = require('child_process')
const path = require("path")

const commandLineArgs = require("command-line-args");

const options = commandLineArgs([
    { name: "file", type: String },
    { name: "chunk-size", type: Number },
], { partial: true });

async function main() {
    const { lines, precalculatedData } = await preCalculateData(options.file || "./advertisers.txt")
    const potentialMatches: [string, string, string][] = [];

    const threads = new Set();
    const chunks: string[][] = chunk(lines, options["chunk-size"] || lines.length / 4)

    for (const [index, dataChunk] of Array.from(chunks.entries())) {
        const worker = childProcess.fork(path.resolve(__dirname, "worker.ts"))
        worker.send({
            dataChunk,
            precalculatedData
        })
        threads.add(worker)

        worker.on("error", (err) => {
            throw err
        });
        worker.on("exit", () => {
            threads.delete(worker);

            if (threads.size === 0) {
                writeOutput(potentialMatches)
            }
        })
        worker.on("message", (msg: {
            potentialDuplicates: ReturnType<typeof getPotentialDuplicates>,
            executionTime: number
        }) => {
            console.info(`thread #${index} executed in ${msg.executionTime}ms`)
            potentialMatches.push(...msg.potentialDuplicates)
        });
    }
}

main()
    .catch((err) => {
        console.error(err);

        process.exit(1);
    })