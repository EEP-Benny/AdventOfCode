from collections import UserString
from dataclasses import dataclass
from typing import Generator
import re
from utils import getInput


class SpringStates(UserString):
    def matches_contiguous_groups(self, groups: list[int]):
        regex = re.compile(
            r"^\.*" + r"\.+".join(f"#{{{group}}}" for group in groups) + r"\.*$"
        )
        # print(regex)
        return regex.match(self.data) is not None


@dataclass
class SpringRow:
    spring_states: SpringStates
    contiguous_groups: list[int]

    def generate_spring_states(self) -> "Generator[SpringStates]":
        def generate_spring_states_inner(spring_states: SpringStates):
            if "?" in spring_states:
                yield from generate_spring_states_inner(
                    SpringStates(spring_states.replace("?", ".", 1))
                )
                yield from generate_spring_states_inner(
                    SpringStates(spring_states.replace("?", "#", 1))
                )
            else:
                yield spring_states

        yield from generate_spring_states_inner(self.spring_states)


def parse_input(input: "list[str]") -> list[SpringRow]:
    return [
        SpringRow(line.split(" ")[0], [int(x) for x in line.split(" ")[1].split(",")])
        for line in input
    ]


input = getInput(2023, 12)
spring_rows = parse_input(input)


def solution1():
    sum_of_possibilities = 0
    for spring_row in spring_rows:
        possibilities = 0
        for state in spring_row.generate_spring_states():
            if state.matches_contiguous_groups(spring_row.contiguous_groups):
                possibilities += 1
        sum_of_possibilities += possibilities
    return sum_of_possibilities


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
