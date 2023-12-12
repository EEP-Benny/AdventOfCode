from dataclasses import dataclass
from functools import cache
from utils import getInput


@dataclass(frozen=True)
class SpringRow:
    spring_states: str
    contiguous_groups: tuple[int]

    @cache
    def count_possible_spring_states(self) -> int:
        # ran out of groups
        if len(self.contiguous_groups) == 0:
            if "#" in self.spring_states:
                # there must be a group, but there is no group any more
                return 0
            else:
                # no group expected, no group there -> fits
                return 1

        if len(self.spring_states) == 0:
            # ran out of springs (but there is still a group left)
            return 0

        first_spring = self.spring_states[0]
        if first_spring == ".":
            # first group can't start here
            return SpringRow(
                # remove first symbol, keep groups
                self.spring_states[1:],
                self.contiguous_groups,
            ).count_possible_spring_states()
        elif first_spring == "#":
            first_group_len = self.contiguous_groups[0]
            if (
                len(self.spring_states) < first_group_len
                or "." in self.spring_states[0:first_group_len]
            ):
                # group doesn't fit here
                return 0
            if (
                len(self.spring_states) > first_group_len
                and self.spring_states[first_group_len] == "#"
            ):
                # but first group is not big enough
                return 0
            else:
                return SpringRow(
                    # consume first group
                    self.spring_states[first_group_len + 1 :],
                    self.contiguous_groups[1:],
                ).count_possible_spring_states()
        else:
            # try both ways
            return (
                SpringRow(
                    "." + self.spring_states[1:], self.contiguous_groups
                ).count_possible_spring_states()
                + SpringRow(
                    "#" + self.spring_states[1:], self.contiguous_groups
                ).count_possible_spring_states()
            )

    def unfold(self):
        return SpringRow(
            "?".join(self.spring_states for _ in range(5)),
            self.contiguous_groups * 5,
        )


def parse_input(input: "list[str]") -> list[SpringRow]:
    return [
        SpringRow(
            line.split(" ")[0],
            tuple(int(x) for x in line.split(" ")[1].split(",")),
        )
        for line in input
    ]


input = getInput(2023, 12)
spring_rows = parse_input(input)


def solution1():
    return sum(spring_row.count_possible_spring_states() for spring_row in spring_rows)


def solution2():
    return sum(
        spring_row.unfold().count_possible_spring_states() for spring_row in spring_rows
    )


if __name__ == "__main__":
    print(solution1())
    print(solution2())
