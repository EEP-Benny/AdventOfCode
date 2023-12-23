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
class PositionAndSpeed(Position):
    direction: Direction
    speed: int

    def get_next_options(
        self,
    ) -> "list[PositionAndSpeed]":
        next_direction_and_speed = (
            [(self.direction, self.speed + 1)] if self.speed < 2 else []
        ) + (
            [(Direction.DOWN, 0), (Direction.UP, 0)]
            if self.direction in [Direction.LEFT, Direction.RIGHT]
            else [(Direction.RIGHT, 0), (Direction.LEFT, 0)]
        )
        return [
            PositionAndSpeed(self.x + dir.value[0], self.y + dir.value[1], dir, speed)
            for dir, speed in next_direction_and_speed
        ]


@dataclass(order=True)
class QueueEntry:
    heuristic: int
    heat_loss_so_far: int
    pos: PositionAndSpeed = field(compare=False)


@dataclass
class Map:
    grid: list[list[int]]

    def __getitem__(self, coord: Position):
        if 0 <= coord.y < len(self.grid) and 0 <= coord.x < len(self.grid[coord.y]):
            return self.grid[coord.y][coord.x]
        else:
            return None

    def find_shortest_path(self) -> int:
        queue = PriorityQueue[QueueEntry]()
        for pos in [
            PositionAndSpeed(1, 0, Direction.RIGHT, 1),
            PositionAndSpeed(0, 1, Direction.DOWN, 1),
        ]:
            queue.put(QueueEntry(0, self[pos], pos))
        target_pos = Position(len(self.grid[0]) - 1, len(self.grid) - 1)
        already_found = dict[PositionAndSpeed, int]()
        coming_from = dict[PositionAndSpeed, Position]()
        while queue:
            entry = queue.get_nowait()
            if entry.pos.x == target_pos.x and entry.pos.y == target_pos.y:
                return entry.heat_loss_so_far
            for next in entry.pos.get_next_options():
                heat_loss_on_entry = self[next]
                if heat_loss_on_entry is None:
                    continue
                next_heat_loss = entry.heat_loss_so_far + heat_loss_on_entry
                if next not in already_found:
                    already_found[next] = next_heat_loss
                    coming_from[next] = Position(entry.pos.x, entry.pos.y)
                    heuristic = (
                        next_heat_loss + target_pos.x - next.x + target_pos.y - next.y
                    )
                    queue.put(QueueEntry(heuristic, next_heat_loss, next))


def parse_input(input: "list[str]") -> Map:
    return Map([[int(tile) for tile in line] for line in input])


input = getInput(2023, 17)
map = parse_input(input)


def solution1():
    return map.find_shortest_path()


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
