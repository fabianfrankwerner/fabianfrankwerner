def convert_date(date_str):
    months = {
        "January": "01", "February": "02", "March": "03", "April": "04", "May": "05", "June": "06",
        "July": "07", "August": "08", "September": "09", "October": "10", "November": "11", "December": "12"
    }

    date_str = date_str.strip()

    if "/" in date_str:
        parts = date_str.split("/")
        if len(parts) == 3:
            month, day, year = parts
            if month.isdigit() and day.isdigit() and year.isdigit():
                month, day, year = int(month), int(day), int(year)
            else:
                return None
        else:
            return None
    elif " " in date_str and "," in date_str:
        parts = date_str.replace(",", "").split()
        if len(parts) == 3:
            month_name, day, year = parts
            if day.isdigit() and year.isdigit() and month_name in months:
                month = int(months[month_name])
                day, year = int(day), int(year)
            else:
                return None
        else:
            return None
    else:
        return None

    if not (1 <= month <= 12) or not (1 <= day <= 31):
        return None

    return f"{year:04d}-{month:02d}-{day:02d}"

def main():
    while True:
        try:
            date_str = input("Date: ").strip()
            formatted_date = convert_date(date_str)
            if formatted_date:
                print(formatted_date)
                break
        except EOFError:
            break

if __name__ == "__main__":
    main()
