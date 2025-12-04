library('tidyverse')

zelda <- read_csv('zelda.csv')

zelda <- pivot_wider(
  zelda,
  id_cols = c(title, release),
  names_from = role,
  values_from = names
) |>
  separate(
    release,
    into = c("year", "system"),
    sep = " - "
  ) |>
  rename_with(tolower)

zelda$year <-as.numeric(zelda$year)

save(zelda, file = 'zelda.RData')
