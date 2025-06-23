const calculator = require("./calculator");

describe("calculator", () => {
  test("adds two numbers", () => {
    expect(calculator.add(2, 3)).toBe(5);
    expect(calculator.add(-1, 1)).toBe(0);
    expect(calculator.add(0, 0)).toBe(0);
  });

  test("subtracts two numbers", () => {
    expect(calculator.subtract(5, 3)).toBe(2);
    expect(calculator.subtract(0, 5)).toBe(-5);
    expect(calculator.subtract(-2, -2)).toBe(0);
  });

  test("multiplies two numbers", () => {
    expect(calculator.multiply(2, 3)).toBe(6);
    expect(calculator.multiply(-2, 3)).toBe(-6);
    expect(calculator.multiply(0, 100)).toBe(0);
  });

  test("divides two numbers", () => {
    expect(calculator.divide(6, 3)).toBe(2);
    expect(calculator.divide(-6, 3)).toBe(-2);
    expect(calculator.divide(0, 5)).toBe(0);
  });

  test("dividing by zero returns Infinity or -Infinity", () => {
    expect(calculator.divide(5, 0)).toBe(Infinity);
    expect(calculator.divide(-5, 0)).toBe(-Infinity);
  });
});
