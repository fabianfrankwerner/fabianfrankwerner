load('zelda.RData')

zelda <- zelda |>
  filter(str_detect(producers, 'Shigeru Miyamoto')) |>
  group_by(title) |>
  slice_min(year) |>
  arrange(year, title, system)

save(zelda, file = '4.RData')
