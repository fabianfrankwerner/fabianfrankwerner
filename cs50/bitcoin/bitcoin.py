import sys
import requests

def main():
    # Check for command-line argument
    if len(sys.argv) != 2:
        sys.exit("Missing command-line argument")

    # Validate input as a number
    try:
        bitcoins = float(sys.argv[1])
    except ValueError:
        sys.exit("Command-line argument is not a number")

    # Fetch Bitcoin price
    try:
        response = requests.get("https://api.coincap.io/v2/assets/bitcoin")
        response.raise_for_status()
        data = response.json()
        price = float(data["data"]["priceUsd"])
    except requests.RequestException:
        sys.exit("Error fetching Bitcoin price")

    # Calculate cost and format output
    cost = bitcoins * price
    print(f"${cost:,.4f}")

if __name__ == "__main__":
    main()
