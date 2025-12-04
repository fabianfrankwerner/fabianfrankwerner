test_that("text_summary generates correct statistics", {
  result <- text_summary("This is a test.")
  expect_equal(result$char_count, 15)
  expect_equal(result$word_count, 4)
  expect_equal(result$preview, "This is a test.")

  # Test with longer text and limited preview
  long_text <- "This is a longer test with more than five words."
  result <- text_summary(long_text, preview_length = 3)
  expect_equal(result$char_count, nchar(long_text))
  expect_equal(result$word_count, 10)
  expect_equal(result$preview, "This is a...")
})

test_that("text_summary handles errors", {
  expect_error(text_summary(123))
  expect_error(text_summary(c("multiple", "strings")))
})