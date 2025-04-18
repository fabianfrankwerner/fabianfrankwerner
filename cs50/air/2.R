# Load the tidyverse package
library(tidyverse)

# Load the air tibble from air.RData
load("air.RData")

# Sort rows by emissions, highest to lowest
air <- air %>%
  arrange(desc(emissions))

# Save the sorted air tibble
save(air, file = "2.RData")