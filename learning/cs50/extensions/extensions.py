name = input("File name: ").strip().lower().split(".")[-1]

match name:
    case "jpg":
        print("image/jpeg")
    case "jpeg" | "png" | "gif":
        print(f"image/{name}")
    case "pdf" | "zip":
        print(f"application/{name}")
    case "txt":
        print(f"text/plain")
    case _:
        print("application/octet-stream")
