import { intersection, union } from "./set";

describe("set functions", () => {
  it("returns intersection of 2 strings", () => {
    expect(intersection("ric", "rsb")).toStrictEqual(["r"]);
    expect(intersection("ric", "hmo")).toStrictEqual([]);
    expect(intersection(["ric", "hmo"], ["hmo"])).toStrictEqual(["hmo"]);
    expect(intersection("ric", "ric")).toStrictEqual(["r", "i", "c"]);
    expect(intersection(["ric"], ["ric"])).toStrictEqual(["ric"]);
    expect(intersection("plattcollege", "vatterottcollegeonline"))
        .toStrictEqual(Array.from("latcoeg"));
  });
  it("returns union of 2 strings", () => {
    expect(union("ric", "rsb")).toStrictEqual(["r", "i", "c", "s", "b"]);
    expect(union("ric", "hmo")).toStrictEqual(["r", "i", "c", "h", "m", "o"]);
    expect(union("ric", "ric")).toStrictEqual(["r", "i", "c"]);
    expect(union(["ric"], ["hmo"])).toStrictEqual(["ric", "hmo"]);
    expect(union("plattcollege", "vatterottcollegeonline"))
        .toStrictEqual(Array.from("platcoegvrni"));
  });
});
