summarize_data <- function(df, group_col, summary_col, func) {
  # Check if group_col and summary_col exist in df
  if (!(group_col %in% names(df))) {
    stop("Group column does not exist in the data frame.")
  }
  if (!(summary_col %in% names(df))) {
    stop("Summary column does not exist in the data frame.")
  }
  # Check if func is a function
  if (!is.function(func)) {
    stop("Provided func is not a function.")
  }
  # Perform the grouping and summarization
  aggregate(df[[summary_col]], by = list(df[[group_col]]), FUN = func)
}
