const caesarCipher = require("./caesarCipher");

describe("caesarCipher", () => {
  test("shifts lowercase letters and wraps z to a", () => {
    expect(caesarCipher("xyz", 3)).toBe("abc");
    expect(caesarCipher("abc", 1)).toBe("bcd");
  });

  test("shifts uppercase letters and wraps Z to A", () => {
    expect(caesarCipher("XYZ", 3)).toBe("ABC");
    expect(caesarCipher("ABC", 1)).toBe("BCD");
  });

  test("preserves case", () => {
    expect(caesarCipher("HeLLo", 3)).toBe("KhOOr");
  });

  test("leaves punctuation and spaces unchanged", () => {
    expect(caesarCipher("Hello, World!", 3)).toBe("Khoor, Zruog!");
    expect(caesarCipher("a! b? c.", 1)).toBe("b! c? d.");
  });

  test("handles negative shifts", () => {
    expect(caesarCipher("abc", -3)).toBe("xyz");
    expect(caesarCipher("ABC", -1)).toBe("ZAB");
  });

  test("handles large shifts", () => {
    expect(caesarCipher("abc", 29)).toBe("def");
    expect(caesarCipher("xyz", 52)).toBe("xyz");
  });
});
