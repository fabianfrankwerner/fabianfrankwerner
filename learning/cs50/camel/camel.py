def main():
    print(to_snake_case(input("camelCase: ")))

def to_snake_case(word):

    result = ""

    for i in range(len(word)):
        if word[i].isupper():
            result += word[i].replace(word[i], f"_{word[i].lower()}")
        else:
            result += word[i]

    print(f"snake_case: {result}")

main()

# firstName -> first_name
