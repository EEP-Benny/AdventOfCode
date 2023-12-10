from utils import getInput

from dataclasses import dataclass


@dataclass
class ScratchCard:
    winning_numbers: list[int]
    numbers_you_have: list[int]

    def get_match_count(self):
        return len(set(self.numbers_you_have).intersection(self.winning_numbers))


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
        match_count = scratch_card.get_match_count()
        if match_count > 0:
            points += 2 ** (match_count - 1)
    return points


def solution2():
    number_of_copies = [1 for _ in scratch_cards]
    for i, scratch_card in enumerate(scratch_cards):
        match_count = scratch_card.get_match_count()
        for copy_i in range(i + 1, i + 1 + match_count):
            try:
                number_of_copies[copy_i] += number_of_copies[i]
            except IndexError:
                pass
    return sum(number_of_copies)


if __name__ == "__main__":
    print(solution1())
    print(solution2())
