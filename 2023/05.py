import re

from utils import getRawInput
from dataclasses import dataclass


@dataclass
class InputOutputMap:
    mapping_ranges: "list[(int, int, int)]"

    def apply_mapping(self, input: int) -> int:
        for output_start, input_start, length in self.mapping_ranges:
            if input_start <= input < input_start + length:
                return output_start - input_start + input
        return input


def parseMap(input: str) -> InputOutputMap:
    mapping_ranges = [
        tuple(int(a) for a in x.split(" ")) for x in input.splitlines()[1:]
    ]
    return InputOutputMap(mapping_ranges)


@dataclass
class Almanac:
    seeds: "list[int]"
    maps: "list[InputOutputMap]"

    def map_seed_to_location(self, seed: int) -> int:
        for map in self.maps:
            seed = map.apply_mapping(seed)
        return seed


def parseAlmanac(input: str) -> Almanac:
    seed_section, *map_sections = input.strip().split("\n\n")
    seeds = [int(x) for x in seed_section.split(" ")[1:]]
    maps = [parseMap(x) for x in map_sections]
    return Almanac(seeds, maps)


input = getRawInput(2023, 5)
almanac = parseAlmanac(input)


def solution1():
    return min(almanac.map_seed_to_location(seed) for seed in almanac.seeds)


def solution2():
    pass


if __name__ == "__main__":
    print(solution1())
    print(solution2())
