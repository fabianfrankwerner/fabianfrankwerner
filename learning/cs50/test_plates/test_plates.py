from plates import is_valid

def test_length():
    assert is_valid("A") == False  # Too short
    assert is_valid("ABCDEFG") == False  # Too long
    assert is_valid("AB") == True  # Minimum valid length
    assert is_valid("ABC123") == True  # Maximum valid length

def test_no_special_characters():
    assert is_valid("AB 123") == False  # No spaces
    assert is_valid("AB!123") == False  # No special characters
    assert is_valid("ABC-12") == False  # No hyphens

def test_numbers_at_end():
    assert is_valid("ABC123") == True   # Valid format
    assert is_valid("AB12C3") == False  # Letter after a number is invalid
    assert is_valid("ABC12D") == False  # Ends with a letter after numbers (should be invalid!)


def test_no_leading_zero():
    assert is_valid("AB012") == False  # First number cannot be zero
    assert is_valid("ABC100") == True  # Valid case

def test_all_letters():
    assert is_valid("ABCDEF") == True  # All letters valid
    assert is_valid("CS50") == True  # Valid mix of letters and numbers
    assert is_valid("CS05") == False  # Invalid: Leading zero in number
    assert is_valid("PI3.14") == False  # Invalid: Special character
    assert is_valid("H") == False  # Invalid: Too short
    assert is_valid("OUTATIME") == False  # Invalid: Too long
