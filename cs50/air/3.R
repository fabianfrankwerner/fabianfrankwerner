# Load the tidyverse package
library(tidyverse)

# Load the air tibble from air.RData
load("air.RData")

# Choose a county (for example, Multnomah)
# Filter data for this county only
air <- air %>%
  filter(str_detect(county, "Multnomah"))  # You can choose any county from Oregon

# Save the filtered air tibble
save(air, file = "3.RData")