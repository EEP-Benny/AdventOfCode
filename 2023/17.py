from enum import Enum
from dataclasses import dataclass, field
from queue import PriorityQueue
from utils import getInput


class Direction(Enum):
    UP = (0, -1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)
    DOWN = (0, 1)


@dataclass(frozen=True)
class Position:
    x: int
    y: int


@dataclass(frozen=True)
class PositionAndNextDirection(Position):
    is_next_direction_horizontal: bool

    def go_distance(self, distance: int):
        if self.is_next_direction_horizontal:
            return PositionAndNextDirection(self.x + distance, self.y, False)
        else:
            return PositionAndNextDirection(self.x, self.y + distance, True)


@dataclass(order=True)
class QueueEntry:
    heuristic: int
    heat_loss_so_far: int
    pos: PositionAndNextDirection = field(compare=False)


@dataclass
class Map:
    grid: list[list[int]]

    def __getitem__(self, coord: Position):
        if 0 <= coord.y < len(self.grid) and 0 <= coord.x < len(self.grid[coord.y]):
            return self.grid[coord.y][coord.x]
        else:
            return None

    def find_shortest_path(self, min_straight: int, max_straight: int) -> int:
        queue = PriorityQueue[QueueEntry]()
        for pos in [
            PositionAndNextDirection(0, 0, True),
            PositionAndNextDirection(0, 0, False),
        ]:
            queue.put(QueueEntry(0, 0, pos))
        target_pos = Position(len(self.grid[0]) - 1, len(self.grid) - 1)
        already_found = dict[PositionAndNextDirection, int]()
        while queue:
            entry = queue.get_nowait()

            if entry.pos in already_found:
                if already_found[entry.pos] > entry.heat_loss_so_far:
                    print(
                        f"Something went wrong at {entry.pos=}: {already_found[entry.pos]=} > {entry.heat_loss_so_far=}"
                    )
                continue
            already_found[entry.pos] = entry.heat_loss_so_far

            if entry.pos.x == target_pos.x and entry.pos.y == target_pos.y:
                return entry.heat_loss_so_far
            for distance in range(min_straight, max_straight + 1):
                for distance_sign in [1, -1]:
                    next = entry.pos.go_distance(distance * distance_sign)
                    if self[next] is None:
                        continue
                    additional_heat_loss = sum(
                        self[entry.pos.go_distance(d * distance_sign)]
                        for d in range(1, distance + 1)
                    )
                    next_heat_loss = entry.heat_loss_so_far + additional_heat_loss
                    heuristic = (
                        next_heat_loss + target_pos.x - next.x + target_pos.y - next.y
                    )
                    queue.put(QueueEntry(heuristic, next_heat_loss, next))


def parse_input(input: "list[str]") -> Map:
    return Map([[int(tile) for tile in line] for line in input])


input = getInput(2023, 17)
map = parse_input(input)


def solution1():
    return map.find_shortest_path(min_straight=1, max_straight=3)


def solution2():
    return map.find_shortest_path(min_straight=4, max_straight=10)


if __name__ == "__main__":
    print(solution1())
    print(solution2())
