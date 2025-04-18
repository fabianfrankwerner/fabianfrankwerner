filename <- readline("CSV file: ")

data <- read.csv(filename, stringsAsFactors = FALSE)

total_stops <- nrow(data)
shortest_stop <- min(data$time)
longest_stop <- max(data$time)
total_time <- sum(data$time)

cat("Total pit stops:", total_stops, "\n")
cat("Shortest pit stop:", shortest_stop, "seconds\n")
cat("Longest pit stop:", longest_stop, "seconds\n")
cat("Total time spent on pit stops:", round(total_time, 2), "seconds\n")
