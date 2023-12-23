from dataclasses import dataclass
from collections import Counter
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


@dataclass
class Map:
    tiles: list[str]

    def __getitem__(self, position):
        if (0 <= position.y < len(self.tiles)) and (
            0 <= position.x < len(self.tiles[position.y])
        ):
            return self.tiles[position.y][position.x]
        return None

    def get_reachable_neighbors(self, pos: Position) -> list[Position]:
        neighbor_positions = {
            ">": Position(pos.x + 1, pos.y),
            "<": Position(pos.x - 1, pos.y),
            "v": Position(pos.x, pos.y + 1),
            "^": Position(pos.x, pos.y - 1),
        }

        if self[pos] in neighbor_positions:
            # predetermined direction
            return [neighbor_positions[self[pos]]]

        return [
            neighbor_pos
            for dir, neighbor_pos in neighbor_positions.items()
            if self[neighbor_pos] in [".", dir]
        ]

    def find_hiking_trails(self, starting_position: Position) -> list[list[Position]]:
        trail = [starting_position]
        while True:
            current_pos = trail[-1]
            last_pos = trail[-2] if len(trail) > 1 else None
            next_positions = [
                pos
                for pos in self.get_reachable_neighbors(current_pos)
                if pos != last_pos
            ]
            if len(next_positions) == 0:
                # we have reached the end
                return [trail]
            if len(next_positions) == 1:
                # continue following the trail
                trail.append(next_positions[0])
                continue
            elif len(next_positions) == 2:
                # we have reached a branching
                return [
                    trail + next_trail
                    for next_pos in next_positions
                    for next_trail in self.find_hiking_trails(next_pos)
                ]
            else:
                raise AssertionError(f"too many branches at {current_pos}")


flat_map = lambda f, xs: [y for ys in xs for y in f(ys)]


def check_assumptions(map: Map):
    for y, line in enumerate(map.tiles):
        for x, tile in enumerate(line):
            position = Position(x, y)
            surrounding_tiles = [map[pos] for pos in Position(x, y).get_neighbors()]
            counts = Counter(surrounding_tiles)
            if tile == "#":
                continue  # don't care about neighbors of walls
            if counts["#"] == 2:
                continue  # two walls means it is a normal path
            if 3 <= counts[">"] + counts["v"] + counts["^"] + counts["<"] <= 4:
                continue  # crossing with predefined directions
            raise AssertionError(position, counts)


input = getInput(2023, 23)
map = Map(input)

check_assumptions(map)


def solution1():
    return max(len(trail) - 1 for trail in map.find_hiking_trails(Position(1, 0)))


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
