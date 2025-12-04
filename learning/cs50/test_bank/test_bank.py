from bank import value

def test_hello():
    assert value("hello") == 0
    assert value("Hello") == 0
    assert value("HELLO") == 0
    assert value("hello there") == 0

def test_h_words():
    assert value("howdy") == 20
    assert value("hi") == 20
    assert value("hey") == 20

def test_other_words():
    assert value("Good morning") == 100
    assert value("Bye") == 100
    assert value("what's up") == 100

def test_empty():
    assert value("") == 100  # Since `main()` strips input, empty should default to 100
