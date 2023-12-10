from utils import getInput

from dataclasses import dataclass


@dataclass
class ScratchCard:
    winning_numbers: list[int]
    numbers_you_have: list[int]


def parse_input(lines: list[str]) -> list[ScratchCard]:
    return [
        ScratchCard(winning_numbers, numbers_you_have)
        for winning_numbers, numbers_you_have in (
            (
                [int(num) for num in num_str.split()]
                for num_str in line.split(":")[1].split("|")
            )
            for line in lines
        )
    ]


input = getInput(2023, 4)
scratch_cards = parse_input(input)


def solution1():
    points = 0
    for scratch_card in scratch_cards:
        matches = set(scratch_card.numbers_you_have).intersection(
            scratch_card.winning_numbers
        )
        if len(matches) > 0:
            points += 2 ** (len(matches) - 1)
    return points


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
