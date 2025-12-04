#' Convert Text to Title Case
#'
#' This function converts a text string to title case, where the first letter
#' of each word is capitalized.
#'
#' @param text A character string to convert to title case
#' @return A character string in title case
#' @export
#'
#' @examples
#' to_title_case("this is a test")
#' to_title_case("HELLO WORLD")
to_title_case <- function(text) {
  if (!is.character(text) || length(text) != 1) {
    stop("Input must be a single character string")
  }

  # Handle empty string
  if (trimws(text) == "") {
    return("")
  }

  # Split into words, capitalize first letter of each, and rejoin
  words <- strsplit(tolower(text), " ")[[1]]
  words <- sapply(words, function(word) {
    if (nchar(word) > 0) {
      paste0(toupper(substr(word, 1, 1)), substr(word, 2, nchar(word)))
    } else {
      word
    }
  })

  return(paste(words, collapse = " "))
}