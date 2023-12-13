from collections import UserList
from utils import getRawInput


class Pattern(UserList[str]):
    def get_flipped(self) -> "Pattern":
        return Pattern(
            ["".join(self[x][y] for x in range(len(self))) for y in range(len(self[0]))]
        )

    def find_mirror_line(self) -> "int | None":
        for mirror_line in range(0, len(self) - 1):
            for upper, lower in zip(
                range(mirror_line, -1, -1), range(mirror_line + 1, len(self))
            ):
                if self[upper] != self[lower]:
                    break
            else:
                # no break in inner loop means that everything is symmetrical
                return mirror_line + 1  # counting starts at 1


def parse_input(input: str) -> list[Pattern]:
    return [Pattern(lines.splitlines()) for lines in input.split("\n\n")]


input = getRawInput(2023, 13)
patterns = parse_input(input)


def solution1():
    summary = 0
    for pattern in patterns:
        vertical_line = pattern.find_mirror_line()
        if vertical_line is not None:
            summary += vertical_line * 100
        else:
            horizontal_line = pattern.get_flipped().find_mirror_line()
            summary += horizontal_line
    return summary


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
