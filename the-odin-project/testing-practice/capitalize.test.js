const capitalize = require("./capitalize");

test("capitalizes hello to HELLO", () => {
  expect(capitalize("hello")).toBe("HELLO");
});
