# Load the tidyverse package
library(tidyverse)

# Read the CSV file into a tibble called air
air <- read_csv("air.csv") %>%
  # Rename and select only the required columns
  select(
    state = State,
    county = `State-County`,
    pollutant = POLLUTANT,
    emissions = `Emissions (Tons)`,
    level_1 = `SCC LEVEL 1`,
    level_2 = `SCC LEVEL 2`,
    level_3 = `SCC LEVEL 3`,
    level_4 = `SCC LEVEL 4`
  )

# Save the air tibble to an RData file
save(air, file = "air.RData")