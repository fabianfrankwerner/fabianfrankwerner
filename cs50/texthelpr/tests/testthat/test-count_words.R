test_that("count_words counts words correctly", {
  expect_equal(count_words(""), 0)
  expect_equal(count_words("hello"), 1)
  expect_equal(count_words("hello world"), 2)
  expect_equal(count_words("  spaced   out  words  "), 3)
  expect_equal(count_words("one,two,three"), 1)  # Commas don't split words
})

test_that("count_words handles errors", {
  expect_error(count_words(123))
  expect_error(count_words(c("multiple", "strings")))
})