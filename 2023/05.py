import re

from utils import getRawInput
from dataclasses import dataclass


@dataclass
class InputOutputMap:
    mapping_ranges: "list[tuple[int, int, int]]"

    def apply_mapping_with_remaining_length(self, input: int) -> "tuple[int, int]":
        for output_start, input_start, length in self.mapping_ranges:
            if input_start <= input < input_start + length:
                output = output_start - input_start + input
                remaining_length = length - (input - input_start)
                return output, remaining_length

        output = input
        next_mapping_start = min(
            (x[1] for x in self.mapping_ranges if x[1] > input), default=None
        )
        remaining_length = (
            None if next_mapping_start is None else next_mapping_start - output
        )
        return input, remaining_length

    def apply_mapping(self, input: int) -> int:
        return self.apply_mapping_with_remaining_length(input)[0]

    def apply_mapping_to_ranges(
        self, input_ranges: "list[tuple[int, int]]"
    ) -> "list[tuple[int, int]]":
        output_ranges: "list[tuple[int, int]]" = []
        for input_range in input_ranges:
            start, length = input_range
            while length > 0:
                output, remaining_length = self.apply_mapping_with_remaining_length(
                    start
                )
                if remaining_length is None:
                    output_ranges.append((output, length))
                    break
                else:
                    output_ranges.append((output, min(remaining_length, length)))
                    start += remaining_length
                    length -= remaining_length
        return output_ranges


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

    def map_seed_ranges_to_location_starts(
        self, seed_ranges: "list[tuple[int, int]]"
    ) -> "list[int]":
        for map in self.maps:
            seed_ranges = map.apply_mapping_to_ranges(seed_ranges)
        return [x[0] for x in seed_ranges]


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
    seed_ranges = [
        tuple(almanac.seeds[i : i + 2]) for i in range(0, len(almanac.seeds), 2)
    ]
    return min(almanac.map_seed_ranges_to_location_starts(seed_ranges))


if __name__ == "__main__":
    print(solution1())
    print(solution2())
