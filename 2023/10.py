from dataclasses import dataclass
from collections import namedtuple, UserDict
from utils import getInput

Coordinate = namedtuple("Coordinate", ["x", "y"])


@dataclass
class Tile:
    coordinate: Coordinate
    shape: str

    def get_connections(self) -> list[Coordinate]:
        x, y = self.coordinate
        return {
            "|": [Coordinate(x, y - 1), Coordinate(x, y + 1)],
            "-": [Coordinate(x - 1, y), Coordinate(x + 1, y)],
            "L": [Coordinate(x, y - 1), Coordinate(x + 1, y)],
            "J": [Coordinate(x, y - 1), Coordinate(x - 1, y)],
            "7": [Coordinate(x, y + 1), Coordinate(x - 1, y)],
            "F": [Coordinate(x + 1, y), Coordinate(x, y + 1)],
        }.get(self.shape, [])

    def is_connected_to(self, other: Coordinate) -> bool:
        return other in self.get_connections()


class Grid(UserDict[Coordinate, Tile]):
    pass


def parse_input(input: "list[str]") -> tuple[Grid, Coordinate]:
    grid = Grid()
    start_coordinate = Coordinate(0, 0)
    for y, line in enumerate(input):
        for x, shape in enumerate(line):
            coordinate = Coordinate(x, y)
            grid[coordinate] = Tile(coordinate, shape)
            if shape == "S":
                start_coordinate = coordinate
    return grid, start_coordinate


input = getInput(2023, 10)
grid, start_coordinate = parse_input(input)


def solution1():
    neighboring_tiles = [
        grid.get(Coordinate(start_coordinate.x + dx, start_coordinate.y + dy))
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]
    ]
    next_tiles = [
        tile for tile in neighboring_tiles if tile.is_connected_to(start_coordinate)
    ]
    assert len(next_tiles) == 2
    visited_coordinates = set([start_coordinate])
    step_count = 0
    while len(next_tiles) > 0:
        current_tiles = next_tiles
        next_tiles = []
        for tile in current_tiles:
            connections = tile.get_connections()
            for coordinate in connections:
                if coordinate not in visited_coordinates:
                    visited_coordinates.add(coordinate)
                    next_tiles.append(grid.get(coordinate))
        step_count += 1
    return step_count


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
