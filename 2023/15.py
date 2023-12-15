from utils import getRawInput


def hash(string: str) -> int:
    current_value = 0
    for char in string:
        current_value += ord(char)
        current_value *= 17
        current_value %= 256
    return current_value


input = getRawInput(2023, 15).strip()
initializationSequence = input.split(",")


def solution1():
    return sum(hash(step) for step in initializationSequence)


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
