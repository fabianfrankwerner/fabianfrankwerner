import pytest
from working import convert


def test_standard_format():
    assert convert("9:00 AM to 5:00 PM") == "09:00 to 17:00"
    assert convert("9:00 PM to 5:00 AM") == "21:00 to 05:00"
    assert convert("12:00 AM to 12:00 PM") == "00:00 to 12:00"
    assert convert("12:00 PM to 12:00 AM") == "12:00 to 00:00"


def test_alternate_formats():
    assert convert("9 AM to 5 PM") == "09:00 to 17:00"
    assert convert("9:00 AM to 5 PM") == "09:00 to 17:00"
    assert convert("9 AM to 5:00 PM") == "09:00 to 17:00"
    assert convert("10:30 PM to 8:50 AM") == "22:30 to 08:50"


def test_invalid_format():
    with pytest.raises(ValueError):
        convert("9 AM - 5 PM")  # Wrong separator
    with pytest.raises(ValueError):
        convert("09:00 AM - 17:00 PM")  # Wrong separator
    with pytest.raises(ValueError):
        convert("9:00 to 5:00")  # Missing AM/PM
    with pytest.raises(ValueError):
        convert("9:00 AM 5:00 PM")  # Missing "to"


def test_invalid_times():
    with pytest.raises(ValueError):
        convert("13:00 AM to 5:00 PM")  # Invalid hour
    with pytest.raises(ValueError):
        convert("9:00 AM to 13:00 PM")  # Invalid hour
    with pytest.raises(ValueError):
        convert("9:60 AM to 5:00 PM")  # Invalid minute
    with pytest.raises(ValueError):
        convert("9:00 AM to 5:60 PM")  # Invalid minute
