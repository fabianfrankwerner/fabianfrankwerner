def main():
    while True:
        try:
            fraction = input("Fraction: ")
            percentage = convert(fraction)
            print(gauge(percentage))
            break
        except (ValueError, ZeroDivisionError):
            pass

def convert(fraction: str) -> int:
    try:
        x, y = map(int, fraction.split("/"))
        if y == 0:
            raise ZeroDivisionError("Denominator cannot be zero.")
        if x > y:
            raise ValueError("Numerator cannot be greater than denominator.")
        return round((x / y) * 100)
    except (ValueError, ZeroDivisionError) as e:
        raise e

def gauge(percentage: int) -> str:
    if percentage <= 1:
        return "E"
    elif percentage >= 99:
        return "F"
    return f"{percentage}%"

if __name__ == "__main__":
    main()
