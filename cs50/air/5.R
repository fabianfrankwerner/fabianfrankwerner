# Load the tidyverse package
library(tidyverse)

# Load the air tibble from air.RData
load("air.RData")

# Get the row with the highest emissions for each county
air <- air %>%
  group_by(county) %>%
  slice_max(emissions, n = 1) %>%
  ungroup() %>%
  arrange(desc(emissions))

# Save the resulting tibble
save(air, file = "5.RData")