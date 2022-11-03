import * as fs from "fs";

export async function writeOutput(
    potentialMatches: [string, string, string][],
    fileName = "potential_matches.tsv"
) {
    const output =
        `Similarity score\tAdvertiser\tPotential duplicate\n` +
        potentialMatches.sort(
            (record1, record2) =>
                Number(record2[0]) - Number(record1[0])
        ).map((el) => el.join(`\t`)).join(`\n`);
    try {
        await fs.promises.writeFile(`./${fileName}`, output);
    } catch {
        console.log(output);
    }
}