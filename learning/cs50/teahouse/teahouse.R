flavor <- readline(prompt = "What's your taste in flavor? (Light/Bold): ")

caffeine <- readline(prompt = "Do you prefer caffeine? (Yes/No): ")

if (flavor == "Light" || flavor == "Bold") {
  if (caffeine == "Yes" || caffeine == "No") {
    if (flavor == "Light" && caffeine == "Yes") {
      cat("I recommend green tea for you!\n")
    } else if (flavor == "Bold" && caffeine == "Yes") {
      cat("I recommend black tea for you!\n")
    } else if (flavor == "Light" && caffeine == "No") {
      cat("I recommend chamomile tea for you!\n")
    } else if (flavor == "Bold" && caffeine == "No") {
      cat("I recommend rooibos tea for you!\n")
    }
  } else {
    cat("Please enter either 'Yes' or 'No' for caffeine preference.\n")
  }
} else {
  cat("Please enter either 'Light' or 'Bold' for flavor preference.\n")
}