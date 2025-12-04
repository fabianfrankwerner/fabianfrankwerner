calculate_growth_rate <- function(years, visitors) {
  first_year <- years[1]
  last_year <- years[length(years)]
  first_year_visitors <- visitors[1]
  last_year_visitors <- visitors[length(visitors)]

  visitor_difference <- last_year_visitors - first_year_visitors

  year_difference <- last_year - first_year

  growth_rate <- visitor_difference / year_difference

  return(growth_rate)
}

predict_visitors <- function(years, visitors, year) {
  growth_rate <- calculate_growth_rate(years, visitors)

  last_year <- years[length(years)]
  last_year_visitors <- visitors[length(visitors)]

  years_to_project <- year - last_year

  predicted_visitors <- last_year_visitors + (growth_rate * years_to_project)

  predicted_visitors <- round(predicted_visitors, 2)

  return(predicted_visitors)
}

visitors <- read.csv("visitors.csv")
year <- as.integer(readline("Year: "))
predicted_visitors <- predict_visitors(visitors$year, visitors$visitors, year)
cat(paste0(predicted_visitors, " million visitors\n"))