import re
import math
from utils import getInput
from dataclasses import dataclass


@dataclass
class Race:
    time: int
    record_distance: int

    def get_win_possibilities(self) -> int:
        t = self.time
        d = self.record_distance
        min_hold_time = math.ceil((t - math.sqrt(t * t - 4 * d)) / 2)
        max_hold_time = math.floor((t + math.sqrt(t * t - 4 * d)) / 2)
        print(min_hold_time, max_hold_time)
        return max_hold_time - min_hold_time + 1


def parse_input(input: "list[str]") -> "list[Race]":
    times = re.split(r"\s+", input[0])[1:]
    distances = re.split(r"\s+", input[1])[1:]
    return [Race(int(time), int(distance)) for time, distance in zip(times, distances)]


input = getInput(2023, 6)


def solution1():
    return math.prod([race.get_win_possibilities() for race in parse_races(input)])


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
