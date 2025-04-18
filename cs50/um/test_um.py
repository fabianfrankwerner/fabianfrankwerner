from um import count


def test_standalone_um():
    assert count("um") == 1
    assert count("Um") == 1
    assert count("UM") == 1
    assert count("um, hello") == 1
    assert count("hello, um") == 1


def test_multiple_um():
    assert count("um, um") == 2
    assert count("um, thanks, um...") == 2
    assert count("um... um... um...") == 3
    assert count("Um, thanks for the, um, album.") == 2


def test_substring_um():
    assert count("yummy") == 0
    assert count("album") == 0
    assert count("umbrella") == 0
    assert count("column") == 0


def test_mixed_cases():
    assert count("Um, thanks, UM, for the, um, help.") == 3
    assert count("ummmm") == 0
    assert count("um?!") == 1
    assert count("!um?") == 1


def test_with_punctuation():
    assert count("um.") == 1
    assert count("um!") == 1
    assert count("um?") == 1
    assert count("(um)") == 1
    assert count("um-like") == 1  # Should count "um" because of the word boundary
