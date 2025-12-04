import re
import sys


def main():
    print(convert(input("Hours: ")))


def convert(s):
    # Updated pattern to better handle minutes
    pattern = r"^(1[0-2]|0?[1-9])(?::([0-5][0-9]))? (AM|PM) to (1[0-2]|0?[1-9])(?::([0-5][0-9]))? (AM|PM)$"

    # Try to match the pattern
    match = re.search(pattern, s)

    # If the pattern doesn't match, raise ValueError
    if not match:
        raise ValueError("Invalid time format")

    # Extract the matched groups
    hour1, min1, ampm1, hour2, min2, ampm2 = match.groups()

    # Convert hours to integers
    hour1 = int(hour1)
    hour2 = int(hour2)

    # Set minutes to 0 if not provided
    min1 = 0 if min1 is None else int(min1)
    min2 = 0 if min2 is None else int(min2)

    # Convert to 24-hour format
    if ampm1 == "PM" and hour1 != 12:
        hour1 += 12
    elif ampm1 == "AM" and hour1 == 12:
        hour1 = 0

    if ampm2 == "PM" and hour2 != 12:
        hour2 += 12
    elif ampm2 == "AM" and hour2 == 12:
        hour2 = 0

    # Format the 24-hour times
    time1 = f"{hour1:02d}:{min1:02d}"
    time2 = f"{hour2:02d}:{min2:02d}"

    # Return the formatted time range
    return f"{time1} to {time2}"


if __name__ == "__main__":
    main()
