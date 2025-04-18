load('zelda.RData')

zelda <- zelda |>
  filter(str_detect(producers, ', ')) |>
  group_by(title) |>
  slice_min(year) |>
  arrange(year, title, system)

save(zelda, file = '5.RData')
