#' Generate Text Summary
#'
#' This function generates a summary of a text string including character count,
#' word count, and the first few words.
#'
#' @param text A character string containing text to summarize
#' @param preview_length Number of words to include in the preview (default: 5)
#' @return A list containing summary statistics about the text
#' @export
#'
#' @examples
#' text_summary("This is an example text for demonstration purposes.")
#' text_summary("Hello world!", preview_length = 2)
text_summary <- function(text, preview_length = 5) {
  if (!is.character(text) || length(text) != 1) {
    stop("Input must be a single character string")
  }

  # Calculate basic stats
  char_count <- nchar(text)
  word_count <- count_words(text)

  # Get preview
  words <- strsplit(trimws(text), "\\s+")[[1]]
  preview_length <- min(preview_length, length(words))
  preview <- paste(words[1:preview_length], collapse = " ")
  if (preview_length < length(words)) {
    preview <- paste0(preview, "...")
  }

  # Return summary as a list
  return(list(
    char_count = char_count,
    word_count = word_count,
    preview = preview
  ))
}