import { calculateSimilarity } from "./calculateSimilarity";

describe("calculateSimilarity", () => {
  it("returns Jaccard similarity of 2 shingles", () => {
    expect(calculateSimilarity("ric", "hmo").result).toBe(0);
    expect(calculateSimilarity("ric", "").result).toBe(0);
    expect(calculateSimilarity("", "").result).toBe(0);
    expect(calculateSimilarity("ric", "lit").result).toBe(1 / 5);
    expect(calculateSimilarity("ric", "rit").result).toBe(2 / 4);
    expect(calculateSimilarity("plattcollege", "vatterottcollegeonline").result).toBe(7 / 12);
    expect(calculateSimilarity("ric", "ric").result).toBe(1);
    expect(calculateSimilarity(["ric"], ["ric"]).result).toBe(1);
  });
});
