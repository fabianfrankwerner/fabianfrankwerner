# Load the tidyverse package
library(tidyverse)

# Load the air tibble from air.RData
load("air.RData")

# Filter data for chosen county and sort by emissions
air <- air %>%
  filter(str_detect(county, "Multnomah")) %>%  # Choose your county
  arrange(desc(emissions))

# Save the filtered and sorted air tibble
save(air, file = "4.RData")