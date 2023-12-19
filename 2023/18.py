import re
from dataclasses import dataclass
from utils import getInput


@dataclass(frozen=True)
class Position:
    x: int
    y: int

    def go(self, direction: str) -> "Position":
        if direction == "U":
            return Position(self.x, self.y - 1)
        if direction == "D":
            return Position(self.x, self.y + 1)
        if direction == "L":
            return Position(self.x - 1, self.y)
        if direction == "R":
            return Position(self.x + 1, self.y)


@dataclass
class DigStep:
    direction: str
    distance: int
    color: str


@dataclass
class Lagoon:
    dug_positions = set[Position]()

    def dig_trench(self, dig_steps: list[DigStep]):
        current_position = Position(0, 0)
        self.dug_positions.add(current_position)
        for dig_step in dig_steps:
            for i in range(dig_step.distance):
                current_position = current_position.go(dig_step.direction)
                self.dug_positions.add(current_position)

    def dig_interior(self):
        min_x = min(pos.x for pos in self.dug_positions)
        max_x = max(pos.x for pos in self.dug_positions)
        min_y = min(pos.y for pos in self.dug_positions)
        max_y = max(pos.y for pos in self.dug_positions)

        for y in range(min_y, max_y):
            is_inside = False
            for x in range(min_x, max_x):
                if (
                    Position(x, y) in self.dug_positions
                    and Position(x, y + 1) in self.dug_positions
                ):
                    is_inside = not is_inside
                if is_inside:
                    self.dug_positions.add(Position(x, y))


def parse_dig_step(line: str) -> DigStep:
    matches = re.match(r"(U|D|L|R) (\d+) \((#[0-9a-f]{6})\)", line)
    return DigStep(direction=matches[1], distance=int(matches[2]), color=matches[3])


def parse_input(input: list[str]) -> list[DigStep]:
    return [parse_dig_step(line) for line in input]


input = getInput(2023, 18)
dig_steps = parse_input(input)


def solution1():
    lagoon = Lagoon()
    lagoon.dig_trench(dig_steps)
    lagoon.dig_interior()
    return len(lagoon.dug_positions)


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
