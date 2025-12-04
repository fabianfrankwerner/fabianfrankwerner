bus_data <- read.csv("bus.csv")
rail_data <- read.csv("rail.csv")

all_data <- rbind(bus_data, rail_data)

all_data$reliability <- all_data$numerator / all_data$denominator

unique_routes <- unique(all_data$route)

user_route <- readline(prompt = "Enter a route: ")

if (user_route %in% unique_routes) {
  route_data <- all_data[all_data$route == user_route, ]

  peak_data <- route_data[route_data$peak == "PEAK", ]
  peak_reliability <- mean(peak_data$reliability) * 100
  peak_reliability_rounded <- round(peak_reliability)

  off_peak_data <- route_data[route_data$peak == "OFF_PEAK", ]
  off_peak_reliability <- mean(off_peak_data$reliability) * 100
  off_peak_reliability_rounded <- round(off_peak_reliability)

  cat("On time ", peak_reliability_rounded, "% of the time during peak hours and ",
      off_peak_reliability_rounded, "% of the time during off-peak hours.\n", sep="")
} else {
  cat("This is not a valid route.\n")
}