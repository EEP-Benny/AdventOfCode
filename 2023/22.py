from dataclasses import dataclass, field
from collections import UserList
from utils import getInput


@dataclass
class Position:
    x: int
    y: int
    z: int


@dataclass()
class Block:
    id: int
    pos_min: Position
    pos_max: Position
    supported_by: set["Block"] = field(default_factory=set)
    supports: set["Block"] = field(default_factory=set)

    def __hash__(self) -> int:
        return self.id

    def is_required_support(self):
        for supported_block in self.supports:
            if len(supported_block.supported_by) == 1:
                return True
        return False


class PileOfBlocks(UserList[Block]):
    def apply_gravity(self):
        min_x = min(block.pos_min.x for block in self)
        min_y = min(block.pos_min.y for block in self)
        max_x = max(block.pos_max.x for block in self)
        max_y = max(block.pos_max.y for block in self)
        assert min_x == 0
        assert min_y == 0
        ground = Block(-1, Position(min_x, min_y, 0), Position(max_x, max_y, 0))
        highest_block = [[ground for y in range(max_y + 1)] for x in range(max_x + 1)]
        for block in sorted(self, key=lambda block: block.pos_min.z):
            highest_height = 0
            highest_blocks = set[Block]()
            for x in range(block.pos_min.x, block.pos_max.x + 1):
                for y in range(block.pos_min.y, block.pos_max.y + 1):
                    highest_block_at_pos = highest_block[x][y]
                    height_at_pos = highest_block_at_pos.pos_max.z
                    if height_at_pos > highest_height:
                        highest_height = height_at_pos
                        highest_blocks = set([highest_block_at_pos])
                    elif height_at_pos == highest_height:
                        highest_blocks.add(highest_block_at_pos)
            block_height = block.pos_max.z - block.pos_min.z
            block.pos_min.z = highest_height + 1
            block.pos_max.z = block.pos_min.z + block_height
            for x in range(block.pos_min.x, block.pos_max.x + 1):
                for y in range(block.pos_min.y, block.pos_max.y + 1):
                    highest_block[x][y] = block
            block.supported_by = highest_blocks
            for supporting_block in highest_blocks:
                supporting_block.supports.add(block)


def parse_input(input: list[str]) -> PileOfBlocks:
    blocks = list[Block]()

    for id, line in enumerate(input):
        pos_min, pos_max = (
            Position(*[int(x) for x in pos_string.split(",")])
            for pos_string in line.split("~")
        )
        blocks.append(Block(id, pos_min, pos_max))

    return PileOfBlocks(blocks)


input = getInput(2023, 22)
pile_of_blocks = parse_input(input)
pile_of_blocks.apply_gravity()


def solution1():
    return sum(1 for block in pile_of_blocks if not block.is_required_support())


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
