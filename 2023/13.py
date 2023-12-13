from collections import UserList
from typing import Generator
from utils import getRawInput


class Pattern(UserList[str]):
    def get_flipped(self) -> "Pattern":
        return Pattern(
            ["".join(self[x][y] for x in range(len(self))) for y in range(len(self[0]))]
        )

    def find_mirror_line(self, forbidden_line: "int | None") -> "int | None":
        for mirror_line in range(0, len(self) - 1):
            if mirror_line + 1 == forbidden_line:
                continue
            for upper, lower in zip(
                range(mirror_line, -1, -1), range(mirror_line + 1, len(self))
            ):
                if self[upper] != self[lower]:
                    break
            else:
                # no break in inner loop means that everything is symmetrical
                return mirror_line + 1  # counting starts at 1

    def get_reflection_summary(
        self, forbidden_summary: "int | None" = None
    ) -> "int | None":
        vertical_line = self.find_mirror_line(
            forbidden_summary / 100 if forbidden_summary is not None else None
        )
        if vertical_line is not None:
            return vertical_line * 100
        else:
            return self.get_flipped().find_mirror_line(
                forbidden_summary if forbidden_summary is not None else None
            )

    def get_unsmudged(self, smudge_x: int, smudge_y: int) -> "Pattern":
        def unsmudge_line(line, smudge_pos):
            if line[smudge_pos] == "#":
                return line[:smudge_pos] + "." + line[smudge_pos + 1 :]
            else:
                return line[:smudge_pos] + "#" + line[smudge_pos + 1 :]

        return Pattern(
            [
                line if y != smudge_y else unsmudge_line(line, smudge_x)
                for y, line in enumerate(self)
            ]
        )

    def get_all_unsmudged(self) -> "Generator[Pattern]":
        for x in range(len(self[0])):
            for y in range(len(self)):
                yield self.get_unsmudged(x, y)


def parse_input(input: str) -> list[Pattern]:
    return [Pattern(lines.splitlines()) for lines in input.split("\n\n")]


input = getRawInput(2023, 13)
patterns = parse_input(input)


def solution1():
    return sum(pattern.get_reflection_summary() for pattern in patterns)


def solution2():
    summary = 0
    for pattern in patterns:
        smudged_mirror_summary = pattern.get_reflection_summary()
        for unsmudged_pattern in pattern.get_all_unsmudged():
            mirror_summary = unsmudged_pattern.get_reflection_summary(
                forbidden_summary=smudged_mirror_summary
            )
            if mirror_summary is not None:
                summary += mirror_summary
                break
    return summary


if __name__ == "__main__":
    print(solution1())
    print(solution2())
