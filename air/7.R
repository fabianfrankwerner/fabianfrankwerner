# Load the tidyverse package
library(tidyverse)

# Load the air tibble from air.RData
load("air.RData")

# Calculate total emissions by source category and pollutant
air <- air %>%
  group_by(source = level_1, pollutant) %>%
  summarize(emissions = sum(emissions, na.rm = TRUE), .groups = "drop") %>%
  arrange(source, pollutant)

# Save the summarized tibble
save(air, file = "7.RData")