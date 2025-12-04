import os
import sys
import csv
from tabulate import tabulate

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
    if e.endswith(".csv"):
        if not os.path.exists(e):
            print("File does not exist")
            sys.exit(1)
        else:
            evaluate_table_format(e)
    else:
        print("Not a CSV file")
        sys.exit(1)

def evaluate_table_format(f):
    try:
        with open(f, 'r') as file:
            reader = csv.reader(file)  # Using the csv.reader to handle comma separation
            table_data = list(reader)  # Convert CSV rows to a list of lists
            print(tabulate(table_data, headers="firstrow", tablefmt="grid"))  # Pass to tabulate for rendering
    except Exception as e:
        print(f"Error reading file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
