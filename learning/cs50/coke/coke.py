def main():

    amount = int(50)
    print(f"Amount Due: {amount}")

    while amount > int(0):
        coin = int(input("Insert Coin: "))
        if coin in [25, 10, 5]:
            amount -= coin
            if amount == 0:
                print(f"Change Owed: {amount}")
            elif amount < 0:
                print(f"Change Owed: {abs(amount)}")
            else:
                print(f"Amount Due: {amount}")
        else:
            print(f"Amount Due: {amount}")


main()
