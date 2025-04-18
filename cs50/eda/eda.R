library(ggplot2)

head(mtcars)

summary(mtcars)

ggplot(mtcars, aes(x = hp, y = mpg)) +
  geom_point() +
  labs(title = "Horsepower vs. MPG",
       x = "Horsepower",
       y = "Miles Per Gallon")

ggsave("visualization.png")
