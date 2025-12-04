from seasons import validate_date, calculate_minutes, convert_to_words
import pytest
from datetime import date, timedelta


def test_validate_date_valid():
    """Test with valid date format"""
    assert validate_date("2000-01-01") == date(2000, 1, 1)
    assert validate_date("1999-12-31") == date(1999, 12, 31)


def test_validate_date_invalid():
    """Test with invalid date formats"""
    with pytest.raises(ValueError):
        validate_date("January 1, 2000")

    with pytest.raises(ValueError):
        validate_date("01/01/2000")

    with pytest.raises(ValueError):
        validate_date("2000/01/01")

    with pytest.raises(ValueError):
        validate_date("01-01-2000")

    with pytest.raises(ValueError):
        validate_date("2000-13-01")  # Invalid month


def test_calculate_minutes():
    """Test minute calculation"""
    # One day ago should be 1440 minutes
    one_day_ago = date.today() - timedelta(days=1)
    assert calculate_minutes(one_day_ago) == 1440

    # Create a date exactly one year ago (not considering leap years)
    one_year_ago = date(date.today().year - 1, date.today().month, date.today().day)
    # 365 days × 24 hours × 60 minutes = 525,600 minutes
    assert calculate_minutes(one_year_ago) in [525600, 527040]  # Account for leap years


def test_convert_to_words():
    """Test conversion to words"""
    assert convert_to_words(1) == "One minutes"
    assert convert_to_words(525600) == "Five hundred twenty-five thousand, six hundred minutes"
    assert convert_to_words(1051200) == "One million, fifty-one thousand, two hundred minutes"
