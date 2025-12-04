load('zelda.RData')

zelda <- zelda |>
  group_by(year) |>
  summarise(releases = n()) |>
  ungroup() |>
  arrange(desc(releases))

save(zelda, file = '2.RData')
