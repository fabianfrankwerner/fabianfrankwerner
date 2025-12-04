def main():
    message = input()
    print(convert(message))


def convert(str):
    return str.replace(":)", "🙂").replace(":(", "🙁")

main()
