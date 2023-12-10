import re
from collections import UserList

from utils import getInput


def is_symbol(string: str) -> bool:
    return re.match(r"[\.\d]", string) is None


class Schematic(UserList[str]):
    def is_symbol_around(self, x: int, y: int) -> bool:
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                try:
                    if is_symbol(self[y + dy][x + dx]):
                        return True
                except IndexError:
                    pass
        return False


input = getInput(2023, 3)
schematic = Schematic(input)


def solution1():
    part_numbers = []
    for y, line in enumerate(schematic):
        for match in re.finditer(r"\d+", line):
            has_symbol_at_start = schematic.is_symbol_around(match.start(), y)
            has_symbol_at_end = schematic.is_symbol_around(match.end() - 1, y)
            if has_symbol_at_start or has_symbol_at_end:
                part_numbers.append(int(match.group(0)))
    return sum(part_numbers)


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
