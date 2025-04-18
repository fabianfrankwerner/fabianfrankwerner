def main():
    expression = input("Expression: ").strip()
    x, operator, z = expression.split()
    x, z = float(x), float(z)

    match operator:
        case "+":
            result = add(x, z)
        case "-":
            result = subtract(x, z)
        case "*":
            result = multiply(x, z)
        case "/":
            result = divide(x, z)

    print(round(result, 1))

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    return a / b

main()
