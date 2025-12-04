random_character <- function() {
  return(sample(letters, 1))
}

print_sequence <- function(length) {
  for (i in 1:length) {
    char <- random_character()

    cat(char)

    Sys.sleep(0.25)
  }

  cat("\n")
}

print_sequence(20)