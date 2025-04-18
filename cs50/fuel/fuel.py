def main():
    while True:
        fraction = input("Fraction: ")

        try:
            x, y = map(int, fraction.split("/"))
            if y == 0:
                raise ZeroDivisionError
            percentage = convert(x, y)
            if percentage > 100:
                continue
            elif percentage <= 1:
                print("E")
            elif percentage >= 99:
                print("F")
            else:
                print(f"{percentage}%")
            break
        except (ValueError, ZeroDivisionError):
            pass

def convert(a, b):
    return round((a / b) * 100)

main()
