const { PerformanceObserver } = require("perf_hooks")
import { PerformanceEntry } from "perf_hooks"

const entriesToDuration = (entries: PerformanceEntry[]) => entries.reduce(
    (total, entry) =>
        total + entry.duration, 0
)
export function startPerformanceMeasure() {
    const report = [
        `\nexecution timing:`
    ]

    const obs = new PerformanceObserver((list) => {
        const precalculateDataEntries = list.getEntriesByName("nonWrapperPreCalculateData")
        const getShinglesDataEntries = list.getEntriesByName("nonWrappedGetShingles")
        const calculateSimilarityEntries = list.getEntriesByName("nonWrappedCalculateSimilarity")
        const intersectionEntries = list.getEntriesByName("nonWrappedIntersection")
        const unionEntries = list.getEntriesByName("nonWrappedUnion")

        if(getShinglesDataEntries.length) {
            report.push(
                `get shingles: ${getShinglesDataEntries.length} calls/${entriesToDuration(getShinglesDataEntries)}ms`
            )
        }
        if (calculateSimilarityEntries.length) {
            report.push(
                `calculate similarity: ${calculateSimilarityEntries.length} calls/${entriesToDuration(calculateSimilarityEntries)}ms`
            )
        }
        if (precalculateDataEntries.length) {
            report.push(
                `precalculate data: ${precalculateDataEntries.length} call/${entriesToDuration(precalculateDataEntries)}ms`
            )
        }
        if (intersectionEntries.length) {
            report.push(
                `intersection: ${intersectionEntries.length} calls/${entriesToDuration(intersectionEntries)}ms`
            )
        }
        if (unionEntries.length) {
            report.push(
                `union: ${unionEntries.length} calls/${entriesToDuration(unionEntries)}ms`
            )
        }
    });
    obs.observe({ entryTypes: ['function'], buffer: false })

    return () => {
        obs.disconnect();

        return report.join(`\n`)
    }
}