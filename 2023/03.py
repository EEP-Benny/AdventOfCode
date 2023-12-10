import re
from collections import UserList, defaultdict
from dataclasses import dataclass


from utils import getInput


def is_symbol(string: str) -> bool:
    return re.match(r"[\.\d]", string) is None


@dataclass
class NumberWithSymbol:
    number: int
    symbol: str
    x: int
    y: int


class Schematic(UserList[str]):
    def get_symbol_around(
        self, x: int, y: int, number: int
    ) -> "NumberWithSymbol | None":
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                try:
                    if is_symbol(self[y + dy][x + dx]):
                        return NumberWithSymbol(
                            symbol=self[y + dy][x + dx],
                            x=x + dx,
                            y=y + dy,
                            number=number,
                        )
                except IndexError:
                    pass
        return None

    def get_numbers_around_symbols(self) -> list[NumberWithSymbol]:
        numbers_with_symbols: list[NumberWithSymbol] = []
        for y, line in enumerate(self):
            for match in re.finditer(r"\d+", line):
                number = int(match.group(0))
                match_at_start = schematic.get_symbol_around(match.start(), y, number)
                match_at_end = schematic.get_symbol_around(match.end() - 1, y, number)
                if match_at_start or match_at_end:
                    numbers_with_symbols.append(match_at_start or match_at_end)
        return numbers_with_symbols


input = getInput(2023, 3)
schematic = Schematic(input)


def solution1():
    return sum(
        number_with_symbol.number
        for number_with_symbol in schematic.get_numbers_around_symbols()
    )


def solution2():
    gear_numbers = defaultdict(list)
    for number_with_symbol in schematic.get_numbers_around_symbols():
        if number_with_symbol.symbol == "*":
            gear_numbers[(number_with_symbol.x, number_with_symbol.y)].append(
                number_with_symbol.number
            )

    return sum(
        numbers[0] * numbers[1]
        for numbers in gear_numbers.values()
        if len(numbers) == 2
    )


if __name__ == "__main__":
    print(solution1())
    print(solution2())
