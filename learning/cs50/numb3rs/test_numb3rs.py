from numb3rs import validate


def test_valid_ipv4():
    assert validate("127.0.0.1") == True
    assert validate("255.255.255.255") == True
    assert validate("0.0.0.0") == True
    assert validate("1.2.3.4") == True
    assert validate("192.168.1.1") == True


def test_invalid_ipv4_out_of_range():
    assert validate("512.512.512.512") == False
    assert validate("275.3.6.28") == False  # The example from NUMB3RS
    assert validate("256.0.0.1") == False
    assert validate("0.0.0.256") == False
    assert validate("255.255.255.256") == False
    assert validate("-1.0.0.0") == False


def test_invalid_ipv4_format():
    assert validate("cat") == False
    assert validate("1.2.3") == False  # Missing a byte
    assert validate("1.2.3.4.5") == False  # Too many bytes
    assert validate("1.2.3.") == False  # Trailing dot
    assert validate(".1.2.3.4") == False  # Leading dot
    assert validate("1..2.3.4") == False  # Double dot
    assert validate("1.2.3.a") == False  # Non-numeric character
    assert validate("") == False  # Empty string
