source("believe.R")
library(testthat)

# Sample data frame for testing
df <- data.frame(
  group = c("A", "A", "B", "B", "C"),
  value = c(10, 20, 30, 40, 50)
)

# Test 1: Mean
test_that("Mean calculation is correct", {
  result <- summarize_data(df, "group", "value", mean)
  expected <- data.frame(Group.1 = c("A", "B", "C"), x = c(15, 35, 50))
  expect_equal(result, expected)
})

# Test 2: Sum
test_that("Sum calculation is correct", {
  result <- summarize_data(df, "group", "value", sum)
  expected <- data.frame(Group.1 = c("A", "B", "C"), x = c(30, 70, 50))
  expect_equal(result, expected)
})

# Test 3: Median
test_that("Median calculation is correct", {
  result <- summarize_data(df, "group", "value", median)
  expected <- data.frame(Group.1 = c("A", "B", "C"), x = c(15, 35, 50))
  expect_equal(result, expected)
})

# Test 4: Invalid group column
test_that("Non-existent group column throws error", {
  expect_error(summarize_data(df, "not_a_column", "value", mean))
})

# Test 5: Invalid function
test_that("Invalid function throws error", {
  expect_error(summarize_data(df, "group", "value", "not_a_function"))
})
