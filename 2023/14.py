from collections import UserList
from utils import getInput


class Platform(UserList[str]):
    def get_load_after_tilting(self) -> int:
        total_load = 0
        for x in range(len(self[0])):
            slide_stop = 0
            for y in range(len(self)):
                if self[y][x] == "#":
                    slide_stop = y + 1
                if self[y][x] == "O":
                    total_load += len(self) - slide_stop
                    slide_stop += 1
        return total_load


input = getInput(2023, 14)
platform = Platform(input)


def solution1():
    return platform.get_load_after_tilting()


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
