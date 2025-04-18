from twttr import shorten

def test_str():
    assert shorten("Twitter") == "Twttr"

def test_uppercase():
    assert shorten("HELLO") == "HLL"

def test_lowercase():
    assert shorten("hello") == "hll"

def test_numbers():
    assert shorten("h3ll0") == "h3ll0"

def test_punctuation():
    assert shorten("hello, world!") == "hll, wrld!"

def test_empty():
    assert shorten("") == ""

