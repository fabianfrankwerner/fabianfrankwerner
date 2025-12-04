library(stringr)
library(testthat)

# Test 1: Basic string lengths
test_that("str_length returns correct lengths for basic strings", {
  expect_equal(str_length("abc"), 3)
  expect_equal(str_length(""), 0)
  expect_equal(str_length(" "), 1)
})

# Test 2: Special characters and emojis
test_that("str_length handles special characters and emojis", {
  expect_equal(str_length("😊"), 1)
  expect_equal(str_length("汉字"), 2)
  expect_equal(str_length("café"), 4)
})

# Test 3: Handling NA and other special values
test_that("str_length handles NA and other special values", {
  expect_equal(str_length(NA_character_), NA_integer_)
  expect_equal(str_length(NaN), NA_integer_)
  expect_equal(str_length(Inf), NA_integer_)
})

# Test 4: Vector inputs
test_that("str_length works with vector inputs", {
  input <- c("R", "is", "fun", NA)
  expected <- c(1, 2, 3, NA)
  expect_equal(str_length(input), expected)
})
