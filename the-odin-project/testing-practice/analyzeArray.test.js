const analyzeArray = require("./analyzeArray");

describe("analyzeArray", () => {
  test("returns correct object for a normal array", () => {
    expect(analyzeArray([1, 8, 3, 4, 2, 6])).toEqual({
      average: 4,
      min: 1,
      max: 8,
      length: 6,
    });
  });

  test("works for a single-element array", () => {
    expect(analyzeArray([5])).toEqual({
      average: 5,
      min: 5,
      max: 5,
      length: 1,
    });
  });

  test("works for negative numbers", () => {
    expect(analyzeArray([-2, -4, -6, -8])).toEqual({
      average: -5,
      min: -8,
      max: -2,
      length: 4,
    });
  });

  test("throws error for empty array", () => {
    expect(() => analyzeArray([])).toThrow("Input must be a non-empty array");
  });

  test("throws error for non-array input", () => {
    expect(() => analyzeArray("not an array")).toThrow(
      "Input must be a non-empty array"
    );
    expect(() => analyzeArray(null)).toThrow("Input must be a non-empty array");
    expect(() => analyzeArray(undefined)).toThrow(
      "Input must be a non-empty array"
    );
  });
});
