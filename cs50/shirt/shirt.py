import sys
import os
from PIL import Image, ImageOps

def main():
    # Check command-line arguments
    check_arguments()

    # Open the input image
    try:
        input_image = Image.open(sys.argv[1])
    except FileNotFoundError:
        sys.exit("Input does not exist")

    # Open the shirt image
    shirt = Image.open("shirt.png")

    # Resize and crop the input image to match shirt size
    photo = ImageOps.fit(input_image, shirt.size)

    # Overlay the shirt
    photo.paste(shirt, shirt)

    # Save the result
    photo.save(sys.argv[2])

def check_arguments():
    # Check number of arguments
    if len(sys.argv) < 3:
        sys.exit("Too few command-line arguments")
    elif len(sys.argv) > 3:
        sys.exit("Too many command-line arguments")

    # Check file extensions
    input_name, input_ext = os.path.splitext(sys.argv[1])
    output_name, output_ext = os.path.splitext(sys.argv[2])

    # Validate extensions
    valid_extensions = ['.jpg', '.jpeg', '.png']
    if input_ext.lower() not in valid_extensions or output_ext.lower() not in valid_extensions:
        sys.exit("Invalid output")

    # Check that input and output have same extension
    if input_ext.lower() != output_ext.lower():
        sys.exit("Input and output have different extensions")

if __name__ == "__main__":
    main()
