import sys

def main():
    plate = input("Plate: ")
    if is_valid(plate):
        print("Valid")
        sys.exit(0)
    else:
        print("Invalid")
        sys.exit(1)


def is_valid(s):
    # Rule 1: Length must be between 2 and 6 characters
    if not (2 <= len(s) <= 6):
        return False

    # Rule 2: Must start with at least two letters
    if len(s) < 2 or not s[:2].isalpha():
        return False

    # Rule 3: No punctuation, spaces, or special characters allowed
    if not s.isalnum():
        return False

    # Rule 4: Numbers must be at the end & first number cannot be '0'
    number_started = False
    for i, char in enumerate(s):
        if char.isdigit():
            if not number_started:
                if char == '0':  # First number cannot be '0'
                    return False
                number_started = True
        elif number_started:  # If a letter appears after a number, invalid
            return False

    return True


if __name__ == "__main__":
    main()
