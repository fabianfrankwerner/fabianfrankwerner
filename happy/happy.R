years <- 2020:2024
data_by_year <- list()

for (year in years) {
  filename <- paste0(year, ".csv")
  data_by_year[[as.character(year)]] <- read.csv(filename)
}

country <- readline(prompt = "Country: ")

for (year in years) {
  year_data <- data_by_year[[as.character(year)]]

  if (country %in% year_data$country) {
    country_row <- year_data[year_data$country == country, ]

    happiness_score <- sum(country_row[, -which(names(country_row) == "country")])

    happiness_score <- round(happiness_score, 2)

    cat(happiness_score, "in", year, "\n")
  } else {
    cat("Data unavailable for", year, "\n")
  }
}