def decrypt_caesar(text, shift):
    result = []

    for char in text:
        if char.isalpha():
            base = ord("A") if char.isupper() else ord("a")
            offset = (ord(char) - base - shift) % 26
            result.append(chr(base + offset))
        else:
            result.append(char)

    return "".join(result)


def main() -> None:
    mode = input("Enter mode: ")
    text = input("Enter text: ")
    shift = int(input("Enter shift value: "))

    print(f"Mode: {mode}")
    print(f"Text: {text}")
    print(f"Shift: {shift}")


if __name__ == "__main__":
    main()
