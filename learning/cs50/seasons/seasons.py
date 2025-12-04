from datetime import date
import sys
import inflect

p = inflect.engine()

def main():
    # Prompt user for birth date
    birth_date_str = input("Date of Birth: ")

    try:
        # Convert the input string to a date object
        birth_date = validate_date(birth_date_str)

        # Calculate minutes
        minutes = calculate_minutes(birth_date)

        # Convert to words and print
        print(convert_to_words(minutes))

    except ValueError:
        sys.exit("Invalid date")


def validate_date(date_str):
    """Validate and convert date string to date object"""
    try:
        year, month, day = date_str.split("-")
        return date(int(year), int(month), int(day))
    except (ValueError, TypeError):
        raise ValueError("Invalid date format")


def calculate_minutes(birth_date):
    """Calculate minutes between birth date and today"""
    today = date.today()
    diff = today - birth_date
    return diff.days * 24 * 60


def convert_to_words(minutes):
    """Convert minutes to words without 'and'"""
    words = p.number_to_words(minutes, andword="")
    return words.capitalize() + " minutes"


if __name__ == "__main__":
    main()
