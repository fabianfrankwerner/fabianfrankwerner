import re
import sys


def main():
    print(parse(input("HTML: ")))


def parse(s):
    # Pattern to match iframe with YouTube embed URL
    pattern = r'<iframe.*?src="((?:https?:)?//(?:www\.)?youtube\.com/embed/([^"]+))".*?></iframe>'

    # Search for the pattern in the HTML string
    match = re.search(pattern, s)

    # If a match is found, extract the video ID and return the youtu.be URL
    if match:
        video_id = match.group(2)
        return f"https://youtu.be/{video_id}"

    # If no match is found, return None
    return None


if __name__ == "__main__":
    main()
