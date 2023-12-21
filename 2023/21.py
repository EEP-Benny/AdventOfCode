from dataclasses import dataclass
from utils import getInput


@dataclass(frozen=True)
class Position:
    x: int
    y: int

    def get_neighbors(self) -> "list[Position]":
        return [
            Position(self.x + 1, self.y),
            Position(self.x - 1, self.y),
            Position(self.x, self.y + 1),
            Position(self.x, self.y - 1),
        ]

    def is_even(self):
        return (self.x + self.y) % 2 == 0


@dataclass
class Garden:
    garden_plots: set[Position]
    starting_position: Position
    size: int


def parse_input(input: list[str]) -> Garden:
    garden_plots = set[Position]()
    starting_position = None

    for y, line in enumerate(input):
        for x, char in enumerate(line):
            if char == "#":
                continue
            if char == "S":
                starting_position = Position(x, y)
            garden_plots.add(Position(x, y))
    size = len(input)

    return Garden(garden_plots, starting_position, size)


input = getInput(2023, 21)
garden = parse_input(input)


def step_and_count(steps: int) -> int:
    positions_to_explore = [garden.starting_position]
    reachable_positions = set[Position](positions_to_explore)
    for _ in range(steps):
        positions_to_explore_next = []
        for pos in positions_to_explore:
            for neighbor in pos.get_neighbors():
                wrapped_neighbor = Position(
                    neighbor.x % garden.size, neighbor.y % garden.size
                )

                if (
                    wrapped_neighbor in garden.garden_plots
                    and neighbor not in reachable_positions
                ):
                    reachable_positions.add(neighbor)
                    positions_to_explore_next.append(neighbor)
        positions_to_explore = positions_to_explore_next
    return sum(
        1
        for pos in reachable_positions
        if (pos.is_even() == garden.starting_position.is_even()) == (steps % 2 == 0)
    )


def solution1():
    return step_and_count(64)


def solution2():
    steps_to_try = [i * garden.size + garden.starting_position.x for i in range(3)]
    results = [f"{{{steps}, {step_and_count(steps)}}}" for steps in steps_to_try]

    return (
        "https://www.wolframalpha.com/input?i=InterpolatingPolynomial[{"
        + ",".join(results)
        + "}, x]/.{x=26501365}"
    )


if __name__ == "__main__":
    print(solution1())
    print(solution2())
