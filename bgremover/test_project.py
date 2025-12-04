import os
import pytest
import tempfile
from PIL import Image
import shutil
from project import validate_input_file, generate_output_path, remove_background


def create_test_jpg():
    """Helper function to create a test JPG file"""
    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()

    # Create a simple test image
    img_path = os.path.join(temp_dir, "test_image.jpg")
    img = Image.new('RGB', (100, 100), color='red')
    img.save(img_path, 'JPEG')

    return temp_dir, img_path


def test_validate_input_file():
    """Test the validate_input_file function"""
    # Create a test JPG file
    temp_dir, img_path = create_test_jpg()

    try:
        # Test with valid JPG file
        assert validate_input_file(img_path) == True

        # Test with non-existent file
        assert validate_input_file("nonexistent_file.jpg") == False

        # Test with wrong extension
        txt_path = os.path.join(temp_dir, "test.txt")
        with open(txt_path, 'w') as f:
            f.write("This is not an image")
        assert validate_input_file(txt_path) == False

    finally:
        # Clean up
        shutil.rmtree(temp_dir)


def test_generate_output_path():
    """Test the generate_output_path function"""
    # Test with simple filename
    assert generate_output_path("image.jpg") == "image_nobg.png"

    # Test with path
    assert generate_output_path("/path/to/image.jpg") == "/path/to/image_nobg.png"

    # Test with uppercase extension
    assert generate_output_path("IMAGE.JPG") == "IMAGE_nobg.png"

    # Test with no extension
    assert generate_output_path("image") == "image_nobg.png"


def test_remove_background():
    """Test the remove_background function"""
    # Create a test JPG file
    temp_dir, img_path = create_test_jpg()
    output_path = os.path.join(temp_dir, "output.png")

    try:
        # Test successful background removal
        # Note: This is a functional test that requires the rembg library
        # It might fail if rembg has issues or changes behavior
        result = remove_background(img_path, output_path)

        # Check if function returns True (success)
        assert result == True

        # Check if output file was created
        assert os.path.exists(output_path)

        # Check if output is a PNG image
        with Image.open(output_path) as img:
            assert img.format == "PNG"

        # Test with invalid input path
        invalid_result = remove_background("nonexistent.jpg", output_path)
        assert invalid_result == False

    finally:
        # Clean up
        shutil.rmtree(temp_dir)
