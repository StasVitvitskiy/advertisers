import { startPerformanceMeasure } from "./performance-measure/executionReport";
import { preCalculateData } from "./pre-process/preCalculateData";
import { writeOutput } from "./post-process/writeOutput";
import { getPotentialDuplicates } from "./data-process/getPotentialDuplicates";
const diff = require("ansi-diff-stream")();
const commandLineArgs = require("command-line-args");

const options = commandLineArgs([
  { name: "v", type: Boolean },
  { name: "vv", type: Boolean },
  { name: "vvv", type: Boolean },
  { name: "file", type: String },
], { partial: true });

async function main() {
  const verbose = options.v || options.vv || options.vvv;
  if (verbose) {
    diff.pipe(process.stdout);
  }

  const stopPerformanceMeasure = options.vv || options.vvv ? startPerformanceMeasure() : () => ""

  const { lines, precalculatedData } = await preCalculateData(
      options.file || "./advertisers.txt",
  )
  const potentialMatches: [string, string, string][] = getPotentialDuplicates({
    lines,
    precalculatedData,
    logger: verbose ? diff.write.bind(diff) : undefined,
    logMemoryUsage: options.vvv,
  });

  await writeOutput(potentialMatches)

  const report = stopPerformanceMeasure()
  if (options.vv || options.vvv) {
    console.info(report)
  }
}


main()
  .catch((err) => {
    console.error(err);

    process.exit(1);
  })
  .then(() => {
    process.exit(0)
  });
