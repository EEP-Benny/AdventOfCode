import re

from utils import getInput


def getNumbersFromString(my_str: str):
    return [int(i) for i in re.findall(r"\d", my_str)]


def getAllNumbersFromString(my_str: str):
    mapping = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
    }
    keys = "|".join(mapping.keys())
    for match in re.findall(rf"(?=(\d|{keys}))", my_str):
        yield mapping.get(match, False) or int(match)


def combineNumbers(num_arr):
    return int(f"{num_arr[0]}{num_arr[-1]}")


def solution1():
    input = getInput(2023, 1)
    return sum([combineNumbers(getNumbersFromString(line)) for line in input])


def solution2():
    input = getInput(2023, 1)
    return sum([combineNumbers(list(getAllNumbersFromString(line))) for line in input])


if __name__ == "__main__":
    print(solution1())
    print(solution2())
