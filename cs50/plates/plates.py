def main():
    plate = input("Plate: ").upper()
    if is_valid(plate):
        print("Valid")
    else:
        print("Invalid")


def is_valid(s):
    # Rule 1: Length must be between 2 and 6 characters
    if not (2 <= len(s) <= 6):
        return False

    # Rule 2: Must start with at least two letters
    if not s[:2].isalpha():
        return False

    # Rule 3: No punctuation, spaces, or special characters
    if not s.isalnum():
        return False

    # Rule 4: Numbers must be at the end and first digit cannot be '0'
    number_started = False
    for i, char in enumerate(s):
        if char.isdigit():
            if not number_started:
                if char == '0':  # First number cannot be '0'
                    return False
                number_started = True
            elif not s[i-1].isdigit():  # If a letter comes after a number
                return False

    return True


main()
