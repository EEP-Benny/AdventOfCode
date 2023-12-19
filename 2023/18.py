import re
from dataclasses import dataclass
from utils import getInput


@dataclass
class DigStep:
    direction: str
    distance: int


def parse_dig_step(line: str) -> DigStep:
    matches = re.match(r"(U|D|L|R) (\d+)", line)
    return DigStep(direction=matches[1], distance=int(matches[2]))


def parse_dig_step_from_color(line: str) -> DigStep:
    matches = re.search(r"#([0-9a-f]{5})([0-3])", line)
    return DigStep(direction="RDLU"[int(matches[2])], distance=int(matches[1], base=16))


@dataclass
class VerticalTrench:
    x: int
    y_start: int
    y_end: int


@dataclass
class Sweep:
    y_start: int
    y_end: int

    def __len__(self):
        return self.y_end - self.y_start + 1


def get_lagoon_size(dig_steps: list[DigStep]):
    current_x = 0
    current_y = 0

    vertical_trenches = list[VerticalTrench]()
    for dig_step in dig_steps:
        direction = dig_step.direction
        distance = dig_step.distance
        if direction == "U":
            vertical_trenches.append(
                VerticalTrench(
                    x=current_x, y_start=current_y, y_end=current_y + distance
                )
            )
            current_y += distance
        if direction == "D":
            vertical_trenches.append(
                VerticalTrench(
                    x=current_x, y_start=current_y, y_end=current_y - distance
                )
            )
            current_y -= distance
        if direction == "L":
            current_x -= distance
        if direction == "R":
            current_x += distance

    vertical_trenches.sort(key=lambda trench: trench.x)

    lagoon_volume = 0
    active_sweeps = list[Sweep]()
    last_x = vertical_trenches[0].x
    for trench in vertical_trenches:
        distance = trench.x - last_x
        last_x = trench.x
        for active_sweep in active_sweeps:
            lagoon_volume += len(active_sweep) * distance

        new_sweeps = []
        if trench.y_start < trench.y_end:  # moving upwards -> opening sweep
            for active_sweep in active_sweeps:
                if active_sweep.y_start == trench.y_end:
                    trench.y_end = active_sweep.y_end
                elif active_sweep.y_end == trench.y_start:
                    trench.y_start = active_sweep.y_start
                else:
                    new_sweeps.append(active_sweep)
            new_sweeps.append(Sweep(trench.y_start, trench.y_end))
        else:  # moving downwards -> closing sweep
            sweep = Sweep(trench.y_end, trench.y_start)  # trench is upside down
            for active_sweep in active_sweeps:
                if (
                    sweep.y_start >= active_sweep.y_start
                    and sweep.y_end <= active_sweep.y_end
                ):
                    if active_sweep.y_start < sweep.y_start:
                        new_sweeps.append(Sweep(active_sweep.y_start, sweep.y_start))
                        sweep.y_start += 1
                    if active_sweep.y_end > sweep.y_end:
                        new_sweeps.append(Sweep(sweep.y_end, active_sweep.y_end))
                        sweep.y_end -= 1
                    lagoon_volume += len(sweep)
                else:  # unrelated sweep
                    new_sweeps.append(active_sweep)
        active_sweeps = new_sweeps
    return lagoon_volume


input = getInput(2023, 18)


def solution1():
    return get_lagoon_size([parse_dig_step(line) for line in input])


def solution2():
    return get_lagoon_size([parse_dig_step_from_color(line) for line in input])


if __name__ == "__main__":
    print(solution1())
    print(solution2())
