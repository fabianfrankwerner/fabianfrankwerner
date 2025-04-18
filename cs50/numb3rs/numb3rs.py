import re
import sys


def main():
    print(validate(input("IPv4 Address: ")))


def validate(ip):
    # Check if the input matches the pattern of an IPv4 address
    pattern = r"^(\d+)\.(\d+)\.(\d+)\.(\d+)$"
    match = re.search(pattern, ip)

    # If the pattern doesn't match, return False
    if not match:
        return False

    # Check that each number is between 0 and 255
    for i in range(1, 5):
        num = int(match.group(i))
        if num < 0 or num > 255:
            return False

    # If all checks pass, return True
    return True


if __name__ == "__main__":
    main()
