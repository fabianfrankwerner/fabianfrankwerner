import os
import sys

def main():
    evaluate_argument_length(sys.argv)

def evaluate_argument_length(a):
    if len(a) == 2:
        evaluate_file_extension(a[1])
    elif len(a) < 2:
        print("Too few command-line arguments")
        sys.exit(1)
    else:
        print("Too many command-line arguments")
        sys.exit(1)

def evaluate_file_extension(e):
    if e.endswith(".py"):
        if not os.path.exists(e):
            print("File does not exist")
            sys.exit(1)
        else:
            evaluate_code_lines(e)
    else:
        print("Not a Python file")
        sys.exit(1)

def evaluate_code_lines(f):
    code_line_count = 0
    try:
        with open(f, 'r') as file:
            for line in file:
                stripped_line = line.strip()
                # Exclude blank lines and comments
                if stripped_line and not stripped_line.startswith('#'):
                    code_line_count += 1
        print(f"Number of lines of code: {code_line_count}")
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
