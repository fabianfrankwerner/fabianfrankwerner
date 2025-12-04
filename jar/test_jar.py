from jar import Jar
import pytest


def test_init():
    # Test default capacity
    jar = Jar()
    assert jar.capacity == 12
    assert jar.size == 0

    # Test custom capacity
    jar = Jar(8)
    assert jar.capacity == 8

    # Test negative capacity
    with pytest.raises(ValueError):
        Jar(-1)

    # Test non-integer capacity
    with pytest.raises(ValueError):
        Jar("invalid")


def test_str():
    jar = Jar()
    assert str(jar) == ""

    jar.deposit(1)
    assert str(jar) == "🍪"

    jar.deposit(11)
    assert str(jar) == "🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪"

    jar.withdraw(6)
    assert str(jar) == "🍪🍪🍪🍪🍪🍪"


def test_deposit():
    jar = Jar(10)

    # Test normal deposit
    jar.deposit(5)
    assert jar.size == 5

    # Test multiple deposits
    jar.deposit(3)
    assert jar.size == 8

    # Test deposit up to capacity
    jar.deposit(2)
    assert jar.size == 10

    # Test exceeding capacity
    with pytest.raises(ValueError):
        jar.deposit(1)

    # Test deposit of zero
    jar = Jar()
    jar.deposit(0)
    assert jar.size == 0


def test_withdraw():
    jar = Jar()

    # Set up jar with cookies
    jar.deposit(8)

    # Test normal withdrawal
    jar.withdraw(3)
    assert jar.size == 5

    # Test multiple withdrawals
    jar.withdraw(2)
    assert jar.size == 3

    # Test withdrawal to empty
    jar.withdraw(3)
    assert jar.size == 0

    # Test excessive withdrawal
    with pytest.raises(ValueError):
        jar.withdraw(1)

    # Test withdrawal of zero
    jar.deposit(5)
    jar.withdraw(0)
    assert jar.size == 5


def test_capacity_property():
    jar = Jar(20)
    assert jar.capacity == 20
    # Ensure capacity is read-only
    with pytest.raises(AttributeError):
        jar.capacity = 30


def test_size_property():
    jar = Jar()
    assert jar.size == 0

    jar.deposit(5)
    assert jar.size == 5

    # Ensure size is read-only
    with pytest.raises(AttributeError):
        jar.size = 10
