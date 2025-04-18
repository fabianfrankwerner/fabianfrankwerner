test_that("to_title_case works correctly", {
  expect_equal(to_title_case(""), "")
  expect_equal(to_title_case("hello"), "Hello")
  expect_equal(to_title_case("hello world"), "Hello World")
  expect_equal(to_title_case("UPPERCASE TEXT"), "Uppercase Text")
  expect_equal(to_title_case("mixed CASE text"), "Mixed Case Text")
})

test_that("to_title_case handles errors", {
  expect_error(to_title_case(123))
  expect_error(to_title_case(c("multiple", "strings")))
})