def main():
    user_input = input("Input: ")
    print(f"Output: {shorten(user_input)}")

def is_vowel(l):
    return l.lower() in {"a", "e", "i", "o", "u"}

def shorten(word):
    return "".join(char for char in word if not is_vowel(char))

if __name__ == "__main__":
    main()
