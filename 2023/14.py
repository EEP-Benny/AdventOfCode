from utils import getRawInput


def tilt_north(input: str) -> str:
    grid = [[symbol for symbol in line] for line in input.splitlines()]
    for x in range(len(grid[0])):
        slide_stop = 0
        for y in range(len(grid)):
            if grid[y][x] == "#":
                slide_stop = y + 1
            if grid[y][x] == "O":
                grid[y][x] = "."
                grid[slide_stop][x] = "O"
                slide_stop += 1
    return "\n".join("".join(line) for line in grid)


def tilt_west(input: str) -> str:
    grid = [[symbol for symbol in line] for line in input.splitlines()]
    for y in range(len(grid)):
        slide_stop = 0
        for x in range(len(grid[y])):
            if grid[y][x] == "#":
                slide_stop = x + 1
            if grid[y][x] == "O":
                grid[y][x] = "."
                grid[y][slide_stop] = "O"
                slide_stop += 1
    return "\n".join("".join(line) for line in grid)


def tilt_south(input: str) -> str:
    grid = [[symbol for symbol in line] for line in input.splitlines()]
    for x in range(len(grid[0])):
        slide_stop = len(grid) - 1
        for y in reversed(range(len(grid))):
            if grid[y][x] == "#":
                slide_stop = y - 1
            if grid[y][x] == "O":
                grid[y][x] = "."
                grid[slide_stop][x] = "O"
                slide_stop -= 1
    return "\n".join("".join(line) for line in grid)


def tilt_east(input: str) -> str:
    grid = [[symbol for symbol in line] for line in input.splitlines()]
    for y in range(len(grid)):
        slide_stop = len(grid[y]) - 1
        for x in reversed(range(len(grid[y]))):
            if grid[y][x] == "#":
                slide_stop = x - 1
            if grid[y][x] == "O":
                grid[y][x] = "."
                grid[y][slide_stop] = "O"
                slide_stop -= 1
    return "\n".join("".join(line) for line in grid)


def tilt_cycle(input: str, cycle: int = None) -> str:
    return tilt_east(tilt_south(tilt_west(tilt_north(input))))


def get_load_on_north_support_beams(input: str) -> int:
    grid = input.splitlines()
    return sum(line.count("O") * (len(grid) - y) for y, line in enumerate(grid))


platform = getRawInput(2023, 14)


def solution1():
    return get_load_on_north_support_beams(tilt_north(platform))


def solution2():
    expected_cycles = 1000000000
    tilted_platform = platform
    already_seen_platforms = dict()
    for cycle_number in range(expected_cycles):
        if tilted_platform in already_seen_platforms:
            repeating_cycles = cycle_number - already_seen_platforms[tilted_platform]
            break
        already_seen_platforms[tilted_platform] = cycle_number
        tilted_platform = tilt_cycle(tilted_platform)

    remaining_cycles = (expected_cycles - cycle_number) % repeating_cycles
    for _ in range(remaining_cycles):
        tilted_platform = tilt_cycle(tilted_platform)

    return get_load_on_north_support_beams(tilted_platform)


if __name__ == "__main__":
    print(solution1())
    print(solution2())
