import { normalizeLine } from "./normalizeLine";

describe("normalizeLine", () => {
  it("strips all punctuation and witespaces", () => {
    expect(normalizeLine("Centerfield Baseball & Softball Academy, Inc.")).toBe(
      "CenterfieldBaseballSoftballAcademyInc".toLowerCase()
    );
    expect(normalizeLine("")).toBe("");
    expect(normalizeLine(" &,.")).toBe("");
  });
});
