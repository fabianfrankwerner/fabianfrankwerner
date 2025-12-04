import os
import sys
import argparse
from PIL import Image
from rembg import remove
import numpy as np


def main():
    """
    Main function that parses command line arguments and processes the image.
    If no arguments are provided, it runs in interactive mode.
    """
    # Create argument parser
    parser = argparse.ArgumentParser(description="Remove background from images")
    parser.add_argument("-i", "--input", help="Path to input image")
    parser.add_argument("-o", "--output", help="Path to output image")
    args = parser.parse_args()

    if args.input and args.output:
        # Command line mode
        try:
            result = remove_background(args.input, args.output)
            if result:
                print(f"Background removed successfully. Saved to {args.output}")
            else:
                print("Failed to remove background.")
        except Exception as e:
            print(f"Error: {e}")
    else:
        # Interactive mode
        try:
            input_path = input("Enter the path to your JPG image: ")

            # Validate input file exists and is jpg
            if not validate_input_file(input_path):
                sys.exit(1)

            # Generate output path
            output_path = generate_output_path(input_path)

            # Process the image
            result = remove_background(input_path, output_path)

            if result:
                print(f"Background removed successfully. Saved to {output_path}")
            else:
                print("Failed to remove background.")
        except KeyboardInterrupt:
            print("\nProcess interrupted by user.")
            sys.exit(0)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)


def validate_input_file(file_path):
    """
    Validates that the input file exists and is a JPG image.

    Args:
        file_path (str): The path to the input file

    Returns:
        bool: True if valid, False otherwise
    """
    # Check if file exists
    if not os.path.isfile(file_path):
        print(f"Error: The file '{file_path}' does not exist.")
        return False

    # Check file extension
    if not file_path.lower().endswith(('.jpg', '.jpeg')):
        print("Error: Input file must be a JPG image.")
        return False

    # Try to open the image to make sure it's valid
    try:
        with Image.open(file_path) as img:
            # Check if it's actually a JPG image
            if img.format not in ('JPEG', 'JPG'):
                print("Error: Input file must be a JPG image.")
                return False
    except Exception as e:
        print(f"Error: Could not open image file: {e}")
        return False

    return True


def generate_output_path(input_path):
    """
    Generates the output path by replacing the extension with .png
    and adding '_nobg' before the extension.

    Args:
        input_path (str): The path to the input file

    Returns:
        str: The path to the output file
    """
    # Split the path into directory, filename, and extension
    directory, filename = os.path.split(input_path)
    name, _ = os.path.splitext(filename)

    # Create new output path
    output_filename = f"{name}_nobg.png"
    if directory:
        output_path = os.path.join(directory, output_filename)
    else:
        output_path = output_filename

    return output_path


def remove_background(input_path, output_path):
    """
    Removes the background from an image and saves the result.

    Args:
        input_path (str): The path to the input image
        output_path (str): The path where to save the output image

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Open the input image
        with open(input_path, 'rb') as input_file:
            input_data = input_file.read()

        # Process the image to remove background
        output_data = remove(input_data)

        # Save the output image
        with open(output_path, 'wb') as output_file:
            output_file.write(output_data)

        return True
    except Exception as e:
        print(f"Error removing background: {e}")
        return False


if __name__ == "__main__":
    main()
