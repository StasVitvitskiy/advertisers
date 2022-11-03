import { getShingles } from "./getShingles";

describe("getShingles", () => {
  it("splits line into shingles", () => {
    expect(
      getShingles("Richmond Metropolitan Convention & Visitors Bureau")
    ).toStrictEqual([
      "ric",
      "hmo",
      "ndm",
      "etr",
      "opo",
      "lit",
      "anc",
      "onv",
      "ent",
      "ion",
      "vis",
      "ito",
      "rsb",
      "ure",
      "au"
    ]);
    expect(getShingles("")).toStrictEqual([]);
    expect(getShingles("ita")).toStrictEqual(["ita"]);
    expect(getShingles("i")).toStrictEqual(["i"]);
  });
});
