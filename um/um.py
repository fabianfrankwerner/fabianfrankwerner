import re
import sys


def main():
    print(count(input("Text: ")))


def count(s):
    # Pattern to match "um" as a complete word, case-insensitively
    # \b is a word boundary, ensuring "um" is not part of a larger word
    pattern = r'\bum\b'

    # Find all matches, ignoring case
    matches = re.findall(pattern, s.lower())

    # Return the count of matches
    return len(matches)


if __name__ == "__main__":
    main()
