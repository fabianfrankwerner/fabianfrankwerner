from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        # Set font for the header
        self.set_font("helvetica", "B", 24)
        # Move to the right to center the title
        title_width = self.get_string_width("CS50 Shirtificate")
        self.cell((210 - title_width) / 2)
        # Title
        self.cell(title_width, 10, "CS50 Shirtificate", align="C")
        # Line break
        self.ln(20)


def main():
    # Get the user's name
    name = input("Name: ")

    # Create the shirtificate PDF
    create_shirtificate(name)


def create_shirtificate(name):
    # Create PDF instance
    pdf = PDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(False)

    # Add a page
    pdf.add_page()

    # Add the shirt image
    pdf.image("shirtificate.png", x=10, y=70, w=190)

    # Add the user's name on top of the shirt
    pdf.set_font("helvetica", "B", 24)
    pdf.set_text_color(255, 255, 255)  # White text

    # Calculate text width to center it
    name_text = f"{name} took CS50"
    name_width = pdf.get_string_width(name_text)

    # Position the name text centered on top of the shirt
    pdf.set_xy((210 - name_width) / 2, 140)
    pdf.cell(name_width, 10, name_text, align="C")

    # Output the PDF
    pdf.output("shirtificate.pdf")


if __name__ == "__main__":
    main()
