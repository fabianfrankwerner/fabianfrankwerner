#' Count Words in Text
#'
#' This function counts the number of words in a text string.
#'
#' @param text A character string containing text to analyze
#' @return Integer representing the number of words in the text
#' @export
#'
#' @examples
#' count_words("Hello world")
#' count_words("This is a longer example with more words to count.")
count_words <- function(text) {
  if (!is.character(text) || length(text) != 1) {
    stop("Input must be a single character string")
  }

  # Remove leading/trailing whitespace
  text <- trimws(text)

  # Handle empty string case
  if (text == "") {
    return(0)
  }

  # Split by any whitespace and count non-empty elements
  words <- strsplit(text, "\\s+")[[1]]
  return(length(words))
}