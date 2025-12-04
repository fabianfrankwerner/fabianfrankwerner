const reverseString = require("./reverseString");

test("reverses string hello to olleh", () => {
  expect(reverseString("hello")).toBe("olleh");
});
