import sys
from pyfiglet import Figlet

if len(sys.argv) == 3:
    if sys.argv[1] in {"-f", "--font"}:
        print(Figlet(font=f"{sys.argv[2]}").renderText(input("Input: ")))
    else:
        sys.exit("Invalid usage")
elif len(sys.argv) == 1:
    print(Figlet(font="slant").renderText(input("Input: ")))
else:
    sys.exit("Invalid usage")


