from dataclasses import dataclass
from utils import getInput


@dataclass
class Coordinate:
    x: int
    y: int


@dataclass
class Universe:
    galaxies: list[Coordinate]

    def expand(self, factor: int) -> "Universe":
        x_coords = set(c.x for c in self.galaxies)
        y_coords = set(c.y for c in self.galaxies)
        x_offset = 0
        y_offset = 0
        x_mapping: dict[int, int] = {}
        y_mapping: dict[int, int] = {}
        for x in range(max(x_coords) + 1):
            if x in x_coords:
                x_mapping[x] = x + x_offset
            else:
                x_offset += factor - 1
        for y in range(max(y_coords) + 1):
            if y in y_coords:
                y_mapping[y] = y + y_offset
            else:
                y_offset += factor - 1
        return Universe(
            [Coordinate(x_mapping[c.x], y_mapping[c.y]) for c in self.galaxies]
        )

    def get_sum_of_shortest_paths(self) -> int:
        sum_of_distances = 0
        for c1 in self.galaxies:
            for c2 in self.galaxies:
                sum_of_distances += abs(c1.x - c2.x) + abs(c1.y - c2.y)
        return sum_of_distances // 2


def parse_input(input: "list[str]") -> Universe:
    galaxies: list[Coordinate] = []
    for y, line in enumerate(input):
        for x, shape in enumerate(line):
            if shape == "#":
                galaxies.append(Coordinate(x, y))
    return Universe(galaxies)


input = getInput(2023, 11)
universe = parse_input(input)


def solution1():
    expanded_universe = universe.expand(2)
    return expanded_universe.get_sum_of_shortest_paths()


def solution2():
    expanded_universe = universe.expand(1000000)
    return expanded_universe.get_sum_of_shortest_paths()


if __name__ == "__main__":
    print(solution1())
    print(solution2())
