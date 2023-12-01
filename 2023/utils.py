def getInput(year: int, day: int):
    with open(f"{year}/{day:02d}.input.txt", "r") as reader:
        return reader.read().splitlines()
