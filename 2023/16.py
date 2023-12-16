from enum import Enum
from dataclasses import dataclass
from utils import getInput


class Direction(Enum):
    UP = (0, -1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)
    DOWN = (0, 1)


@dataclass(frozen=True)
class Coordinate:
    x: int
    y: int

    def step(self, dir: Direction) -> "Coordinate":
        return Coordinate(self.x + dir.value[0], self.y + dir.value[1])


def get_reflection(tile: str, dir: Direction) -> list[Direction]:
    if tile == ".":
        return [dir]
    if tile == "\\":
        return {
            Direction.DOWN: [Direction.RIGHT],
            Direction.LEFT: [Direction.UP],
            Direction.RIGHT: [Direction.DOWN],
            Direction.UP: [Direction.LEFT],
        }[dir]
    if tile == "/":
        return {
            Direction.DOWN: [Direction.LEFT],
            Direction.LEFT: [Direction.DOWN],
            Direction.RIGHT: [Direction.UP],
            Direction.UP: [Direction.RIGHT],
        }[dir]
    if tile == "|":
        if dir in [Direction.LEFT, Direction.RIGHT]:
            return [Direction.UP, Direction.DOWN]
        else:
            return [dir]
    if tile == "-":
        if dir in [Direction.UP, Direction.DOWN]:
            return [Direction.LEFT, Direction.RIGHT]
        else:
            return [dir]
    raise AssertionError(f"{dir=}, {tile=} was not handled")


@dataclass
class Contraption:
    grid: list[list[str]]

    def __getitem__(self, coord: Coordinate):
        if 0 <= coord.y < len(self.grid) and 0 <= coord.x < len(self.grid[coord.y]):
            return self.grid[coord.y][coord.x]
        else:
            return None

    def get_tiles_energized_by_light_beam(
        self, initial_coord: Coordinate, initial_dir: Direction
    ) -> int:
        beams_to_check = set[tuple[Coordinate, Direction]](
            [(initial_coord, initial_dir)]
        )
        energized_tiles = set[Coordinate]()
        already_checked_beams = set[tuple[Coordinate, Direction]]()
        while beams_to_check:
            coord, dir = beams_to_check.pop()
            tile = self[coord]
            if tile is None or (coord, dir) in already_checked_beams:
                continue
            energized_tiles.add(coord)
            already_checked_beams.add((coord, dir))
            for new_direction in get_reflection(tile, dir):
                beams_to_check.add((coord.step(new_direction), new_direction))
        return len(energized_tiles)


def parse_input(input: "list[str]") -> Contraption:
    return Contraption([[tile for tile in line] for line in input])


input = getInput(2023, 16)
contraption = parse_input(input)


def solution1():
    return contraption.get_tiles_energized_by_light_beam(
        Coordinate(0, 0), Direction.RIGHT
    )


def solution2():
    starting_configurations: list[tuple[Coordinate, Direction]] = []
    size_x = len(contraption.grid[0])
    size_y = len(contraption.grid)
    for x in range(0, size_x):
        starting_configurations.append((Coordinate(x, 0), Direction.DOWN))
        starting_configurations.append((Coordinate(x, size_y - 1), Direction.UP))
    for y in range(0, size_y):
        starting_configurations.append((Coordinate(0, y), Direction.RIGHT))
        starting_configurations.append((Coordinate(size_x - 1, y), Direction.LEFT))
    return max(
        contraption.get_tiles_energized_by_light_beam(coord, dir)
        for coord, dir in starting_configurations
    )


if __name__ == "__main__":
    print(solution1())
    print(solution2())
