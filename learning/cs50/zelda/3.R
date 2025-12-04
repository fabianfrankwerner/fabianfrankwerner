load('zelda.RData')

zelda <- zelda |>
  group_by(title) |>
  slice_min(year) |>
  arrange(year, title, system)

save(zelda, file = '3.RData')
