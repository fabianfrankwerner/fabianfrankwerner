# Load necessary libraries
library(readr)
library(stringr)
library(dplyr)
library(ggplot2)

# Step 1: Read and clean the lyrics file
# Choose one of the provided lyrics files
lyrics_file <- "lyrics/astley.txt"  # You can choose any file from the lyrics folder

# Read the file
lyrics_text <- read_file(lyrics_file)

# Clean the text - remove punctuation, convert to lowercase
clean_lyrics <- lyrics_text %>%
  str_to_lower() %>%
  str_replace_all("[[:punct:]]", "") %>%
  str_replace_all("\\s+", " ") %>%
  str_trim()

# Split into individual words
words <- str_split(clean_lyrics, " ")[[1]]

# Step 2: Count word frequencies
word_counts <- data.frame(word = words) %>%
  count(word, name = "count") %>%
  # Filter out words that appear only once (optional)
  filter(count > 1) %>%
  # Sort by frequency in descending order
  arrange(desc(count))

# Step 3: Visualize the data
lyrics_plot <- ggplot(word_counts, aes(x = reorder(word, count), y = count)) +
  geom_bar(stat = "identity", fill = "steelblue") +
  coord_flip() +  # Makes it easier to read word labels
  labs(
    title = "Word Frequency in Song Lyrics",
    x = "Word",
    y = "Frequency"
  ) +
  theme_minimal()

ggsave("lyrics.png", lyrics_plot, width = 10, height = 8)