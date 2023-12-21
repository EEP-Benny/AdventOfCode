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

    return Garden(garden_plots, starting_position)


input = getInput(2023, 21)
garden = parse_input(input)


def solution1():
    positions_to_explore = [garden.starting_position]
    reachable_positions = set[Position](positions_to_explore)
    max_steps = 64
    for step in range(max_steps):
        positions_to_explore_next = []
        for pos in positions_to_explore:
            for neighbor in pos.get_neighbors():
                if (
                    neighbor in garden.garden_plots
                    and neighbor not in reachable_positions
                ):
                    reachable_positions.add(neighbor)
                    positions_to_explore_next.append(neighbor)
        positions_to_explore = positions_to_explore_next
    return sum(
        1
        for pos in reachable_positions
        if pos.is_even() == garden.starting_position.is_even()
    )


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
