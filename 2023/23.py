from dataclasses import dataclass
from collections import Counter
from functools import cached_property
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


class Trail(list[Position]):
    pass


@dataclass(frozen=True)
class Map:
    tiles: tuple[str]

    def __getitem__(self, position):
        if (0 <= position.y < len(self.tiles)) and (
            0 <= position.x < len(self.tiles[position.y])
        ):
            return self.tiles[position.y][position.x]
        return None

    def get_reachable_neighbors(self, pos: Position) -> list[Position]:
        return [
            neighbor_pos
            for neighbor_pos in [
                Position(pos.x + 1, pos.y),
                Position(pos.x - 1, pos.y),
                Position(pos.x, pos.y + 1),
                Position(pos.x, pos.y - 1),
            ]
            if self[neighbor_pos] in [".", ">", "<", "v", "^"]
        ]

    def get_reachable_neighbors_with_slippery_slopes(
        self, pos: Position
    ) -> list[Position]:
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

    def find_slippery_hiking_trails(self, starting_position: Position) -> list[Trail]:
        trail = [starting_position]
        while True:
            current_pos = trail[-1]
            last_pos = trail[-2] if len(trail) > 1 else None
            next_positions = [
                pos
                for pos in self.get_reachable_neighbors_with_slippery_slopes(
                    current_pos
                )
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
                    for next_trail in self.find_slippery_hiking_trails(next_pos)
                ]
            else:
                raise AssertionError(f"too many branches at {current_pos}")

    @cached_property
    def trail_map(self) -> dict[Position, list[Trail]]:
        crossings_to_explore = set([Position(1, 0)])
        trail_map = dict[Position, list[Trail]]()
        while crossings_to_explore:
            crossing = crossings_to_explore.pop()
            if crossing in trail_map:
                continue
            trails_from_crossing = []
            for initial_tile in self.get_reachable_neighbors(crossing):
                trail = [initial_tile]
                while True:
                    current_pos = trail[-1]
                    last_pos = trail[-2] if len(trail) > 1 else crossing
                    next_positions = [
                        pos
                        for pos in self.get_reachable_neighbors(current_pos)
                        if pos != last_pos
                    ]
                    if len(next_positions) == 1:
                        # continue following the trail
                        trail.append(next_positions[0])
                        continue
                    else:
                        # found a crossing or the end
                        trails_from_crossing.append(trail)
                        crossings_to_explore.add(current_pos)
                        break
            trail_map[crossing] = trails_from_crossing
        return trail_map

    def find_dry_hiking_trail_lengths(
        self,
        starting_position: Position,
        already_visited_crossings=frozenset[Position](),
    ) -> list[int]:
        trail_lengths = list[int]()
        next_trails = self.trail_map[starting_position]
        if len(next_trails) == 1 and next_trails[0][-1] in already_visited_crossings:
            # we found the exit, return one empty trail
            return [0]
        for trail in next_trails:
            next_crossing = trail[-1]
            if next_crossing in already_visited_crossings:
                continue
            next_already_visited_crossings = already_visited_crossings.union(
                {next_crossing}
            )
            for next_trail_length in self.find_dry_hiking_trail_lengths(
                next_crossing, next_already_visited_crossings
            ):
                trail_lengths.append(len(trail) + next_trail_length)
        return trail_lengths


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
map = Map(tuple(input))

check_assumptions(map)


def solution1():
    return max(
        len(trail) - 1 for trail in map.find_slippery_hiking_trails(Position(1, 0))
    )


def solution2():
    return max(map.find_dry_hiking_trail_lengths(Position(1, 0)))


if __name__ == "__main__":
    print(solution1())
    print(solution2())
