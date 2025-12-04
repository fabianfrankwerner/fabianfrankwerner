import sys
import csv

def main():
    # Check command-line arguments
    check_arguments()

    # Process the CSV file
    input_file = sys.argv[1]
    output_file = sys.argv[2]

    process_csv(input_file, output_file)

def check_arguments():
    # Check if exactly two arguments are provided
    if len(sys.argv) < 3:
        sys.exit("Too few command-line arguments")
    elif len(sys.argv) > 3:
        sys.exit("Too many command-line arguments")

def process_csv(input_file, output_file):
    try:
        # Verify input file exists and is a .csv file
        if not input_file.endswith('.csv'):
            sys.exit("Not a CSV file")

        # Read input CSV
        with open(input_file, 'r') as csvfile:
            reader = csv.DictReader(csvfile)

            # Prepare output data
            output_data = []
            for row in reader:
                # Split name into last and first
                last, first = row['name'].split(', ')

                # Create new row with separated names
                output_data.append({
                    'first': first,
                    'last': last,
                    'house': row['house']
                })

        # Write output CSV
        with open(output_file, 'w', newline='') as csvfile:
            fieldnames = ['first', 'last', 'house']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # Write header
            writer.writeheader()

            # Write rows
            writer.writerows(output_data)

    except FileNotFoundError:
        sys.exit(f"Could not read {input_file}")
    except Exception as e:
        sys.exit(str(e))

if __name__ == "__main__":
    main()
