import re

from utils import getInput
from dataclasses import dataclass


@dataclass
class SetOfCubes:
    red: int
    green: int
    blue: int

    def get_power(self) -> int:
        return self.red * self.green * self.blue

    def __le__(self, other: "SetOfCubes"):
        return (
            self.red <= other.red
            and self.green <= other.green
            and self.blue <= other.blue
        )


def parseSetOfCubes(string: str) -> SetOfCubes:
    red_match = re.search(r"(\d+) red", string)
    green_match = re.search(r"(\d+) green", string)
    blue_match = re.search(r"(\d+) blue", string)
    red = int(red_match[1]) if red_match is not None else 0
    green = int(green_match[1]) if green_match is not None else 0
    blue = int(blue_match[1]) if blue_match is not None else 0
    return SetOfCubes(red, green, blue)


@dataclass
class Game:
    id: int
    sets_of_cubes: "list[SetOfCubes]"

    def is_possible(self, available_cubes: SetOfCubes):
        return all(
            set_of_cubes <= available_cubes for set_of_cubes in self.sets_of_cubes
        )

    def get_minimal_set_of_cubes(self) -> SetOfCubes:
        max_red = max(s.red for s in self.sets_of_cubes)
        max_green = max(s.green for s in self.sets_of_cubes)
        max_blue = max(s.blue for s in self.sets_of_cubes)
        return SetOfCubes(max_red, max_green, max_blue)


def parseGame(line: str) -> Game:
    match = re.match(r"Game (\d+): (.*)", line)
    assert match is not None
    id = int(match[1])
    sets_of_cubes = [parseSetOfCubes(string) for string in match[2].split(";")]
    return Game(id, sets_of_cubes)


input = getInput(2023, 2)
games = [parseGame(line) for line in input]


def solution1():
    available_cubes = SetOfCubes(red=12, green=13, blue=14)
    return sum([game.id for game in games if game.is_possible(available_cubes)])


def solution2():
    return sum([game.get_minimal_set_of_cubes().get_power() for game in games])


if __name__ == "__main__":
    print(solution1())
    print(solution2())
