def encrypt_caesar(text, shift):
    result = []

    for char in text:
        if char.isalpha():
            base = ord("A") if char.isupper() else ord("a")
            offset = (ord(char) - base + shift) % 26
            result.append(chr(base + offset))
        else:
            result.append(char)

    return "".join(result)


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
    mode = input("Enter mode: ").strip().lower()
    text = input("Enter text: ")
    shift = int(input("Enter shift value: "))

    if mode == "encrypt":
        result = encrypt_caesar(text, shift)
    elif mode == "decrypt":
        result = decrypt_caesar(text, shift)
    else:
        print("Invalid mode. Use 'encrypt' or 'decrypt'.")
        return

    print(result)


if __name__ == "__main__":
    main()
