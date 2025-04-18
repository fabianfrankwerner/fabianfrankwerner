def main():
    greeting = input("Greeting: ").strip()
    print(f"${value(greeting)}")

def value(greeting):
    greeting = greeting.lower().strip()

    if greeting == "":  # Handle empty input
        return 100
    elif greeting.startswith("hello"):
        return 0
    elif greeting[0] == "h":
        return 20
    else:
        return 100

if __name__ == "__main__":
    main()
