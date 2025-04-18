import inflect

p = inflect.engine()
names = []

try:
    while True:
        name = input("Name: ").strip().title()
        names.append(name)
except EOFError:
    print()

    if len(names) == 1:
        farewell = names[0]
    else:
        farewell = p.join(names)

    print(f"Adieu, adieu, to {farewell}")
