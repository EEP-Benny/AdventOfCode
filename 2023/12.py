from collections import UserString
from dataclasses import dataclass
from typing import Generator
import re
from functools import cache, wraps
from utils import getInput

indent = 0
logging_enabled = False


def log_calls(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        global indent, logging_enabled
        if logging_enabled:
            print("  " * indent, "> Evaluating", *args, "...")
            indent += 1
        result = func(*args, **kwargs)
        if logging_enabled:
            indent -= 1
            print("  " * indent, "< Evaluated", *args, "to", result)
        return result

    return wrapper


class SpringStates(UserString):
    def matches_contiguous_groups(self, groups: list[int]):
        regex = re.compile(
            r"^\.*" + r"\.+".join(f"#{{{group}}}" for group in groups) + r"\.*$"
        )
        return regex.match(self.data) is not None


@dataclass(frozen=True)
class SpringRow:
    spring_states: SpringStates
    contiguous_groups: tuple[int]

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

    def count_possible_spring_states_old(self) -> int:
        possibilities = 0
        for state in self.generate_spring_states():
            if state.matches_contiguous_groups(self.contiguous_groups):
                possibilities += 1
        return possibilities

    @cache
    @log_calls
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
                SpringStates(self.spring_states[1:]),
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
                    SpringStates(self.spring_states[first_group_len + 1 :]),
                    self.contiguous_groups[1:],
                ).count_possible_spring_states()
        else:
            # try both ways
            return (
                SpringRow(
                    SpringStates("." + self.spring_states[1:]), self.contiguous_groups
                ).count_possible_spring_states()
                + SpringRow(
                    SpringStates("#" + self.spring_states[1:]), self.contiguous_groups
                ).count_possible_spring_states()
            )

    def unfold(self):
        return SpringRow(
            SpringStates("?".join(self.spring_states.data for _ in range(5))),
            self.contiguous_groups * 5,
        )


def parse_input(input: "list[str]") -> list[SpringRow]:
    return [
        SpringRow(
            SpringStates(line.split(" ")[0]),
            tuple(int(x) for x in line.split(" ")[1].split(",")),
        )
        for line in input
    ]


input = getInput(2023, 12)
spring_rows = parse_input(input)
example_input = """
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
""".strip().splitlines()
# spring_rows = parse_input(example_input)

# TODO: debug
# print(f"{SpringRow('?#?#?#?#?#?#?#?', (1,3,1,6)).count_possible_spring_states()=}")


def solution1():
    return sum(spring_row.count_possible_spring_states() for spring_row in spring_rows)


def solution2():
    # for spring_row in spring_rows:
    #     spring_states = spring_row.count_possible_spring_states()
    #     spring_states_old = spring_row.count_possible_spring_states_old()
    #     if spring_states != spring_states_old:
    #         print(f"{spring_states}!={spring_states_old}:{spring_row}")
    #     # print(spring_row)
    #     # print(spring_row.count_possible_spring_states())
    # print(spring_row.unfold().count_possible_spring_states())
    return sum(
        spring_row.unfold().count_possible_spring_states() for spring_row in spring_rows
    )


def assertCount(
    spring_states: SpringStates, contiguous_groups: tuple[int], expected_count: int
):
    assert (
        SpringRow(spring_states, contiguous_groups).count_possible_spring_states()
        == expected_count
    )


if __name__ == "__main__":
    if False:
        logging_enabled = True
        print(f'{SpringRow("??.#??", (1, 2)).count_possible_spring_states()=}')
        logging_enabled = False
        assertCount("???", (1, 1), 1)
        assertCount("???.###", (1, 1, 3), 1)
        assertCount(".??..??...?##.", (1, 1, 3), 4)
        assertCount("?#?#?#?#?#?#?#?", (1, 3, 1, 6), 1)
        assertCount("?###????????", (3, 2, 1), 10)
        assertCount("?#??.???#?#?????", (4, 1, 1, 2, 3), 2)

    else:
        # logging_enabled = True
        print(solution1())
        print(solution2())
    pass
