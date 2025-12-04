# Load the tidyverse package
library(tidyverse)

# Load the air tibble from air.RData
load("air.RData")

# Calculate total emissions for each pollutant and sort
air <- air %>%
  group_by(pollutant) %>%
  summarize(emissions = sum(emissions, na.rm = TRUE)) %>%
  arrange(desc(emissions))

# Save the summarized tibble
save(air, file = "6.RData")