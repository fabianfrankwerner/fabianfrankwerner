def get_num_words(text: str) -> int:
    count: int = 0
    words: list[str] = text.split()
    for word in words:
        count += 1

    return count

def get_num_chars(text: str) -> dict[str, int]:
    count = {}
    for char in text.lower():
        if char not in count:
            count[char] = 1
        else:
            count[char] += 1
    return count

def sort_on(tuple: tuple[str, int]) -> int:
    return tuple[1]

def chars_dict_to_sorted_list(chars: dict[str, int]) -> list[tuple[str, int]]:
    list = []

    for char in chars:
        list.append((char, chars[char]))

    return sorted(list, reverse=True, key=sort_on)
