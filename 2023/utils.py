def getRawInput(year: int, day: int) -> str:
    with open(f"{year}/{day:02d}.input.txt", "r") as reader:
        return reader.read()


def getInput(year: int, day: int):
    return getRawInput(year, day).splitlines()
