def main():
    user_input = input("Input: ")
    print(f"Output: {shorten(user_input)}")

def is_vowel(l):
    return l in {"a", "e", "i", "o", "u", "A", "E", "I", "O", "U"}


def shorten(word):
    output = ""

    for char in word:
        if not is_vowel(char):
            output += char

    return output


if __name__ == "__main__":
    main()
