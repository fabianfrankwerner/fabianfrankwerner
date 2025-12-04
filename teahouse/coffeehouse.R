roast <- readline(prompt = "What roast level do you prefer? (Light/Medium/Dark): ")

brew_method <- readline(prompt = "What's your preferred brewing method? (Pour-over/French Press/Espresso): ")

if (roast %in% c("Light", "Medium", "Dark")) {
  if (brew_method %in% c("Pour-over", "French Press", "Espresso")) {
    if (roast == "Light" && brew_method == "Pour-over") {
      cat("I recommend Ethiopian Yirgacheffe for bright, floral notes with citrus acidity.\n")
    } else if (roast == "Light" && brew_method == "French Press") {
      cat("I recommend Kenyan AA for berry-forward flavors that shine in a French Press.\n")
    } else if (roast == "Light" && brew_method == "Espresso") {
      cat("I recommend a Guatemalan light roast for a unique, bright espresso experience.\n")
    } else if (roast == "Medium" && brew_method == "Pour-over") {
      cat("I recommend Colombian coffee for balanced flavor with caramel sweetness.\n")
    } else if (roast == "Medium" && brew_method == "French Press") {
      cat("I recommend Costa Rican coffee for chocolate notes that develop well in immersion brewing.\n")
    } else if (roast == "Medium" && brew_method == "Espresso") {
      cat("I recommend a Brazilian medium roast for a sweet, nutty espresso shot.\n")
    } else if (roast == "Dark" && brew_method == "Pour-over") {
      cat("I recommend Sumatra Mandheling for earthy, spicy notes in a clean pour-over.\n")
    } else if (roast == "Dark" && brew_method == "French Press") {
      cat("I recommend Italian Roast for robust flavor that stands up to French Press brewing.\n")
    } else if (roast == "Dark" && brew_method == "Espresso") {
      cat("I recommend a traditional Espresso Blend for rich, chocolatey shots with thick crema.\n")
    }
  } else {
    cat("Please enter 'Pour-over', 'French Press', or 'Espresso' for brewing method.\n")
  }
} else {
  cat("Please enter 'Light', 'Medium', or 'Dark' for roast level.\n")
}