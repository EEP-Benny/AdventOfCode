from dataclasses import dataclass
from utils import getInput


@dataclass
class Position:
    x: int
    y: int
    z: int


@dataclass(frozen=True)
class Hailstone:
    px: int
    py: int
    pz: int
    dx: int
    dy: int
    dz: int

    def get_position_at_time(self, t: int) -> Position:
        return Position(
            self.px + t * self.dx, self.py + t * self.dy, self.pz + t * self.dz
        )

    def get_path_intersection_2d(self, other: "Hailstone") -> "int|None":
        denominator = self.dx * other.dy - self.dy * other.dx
        if denominator == 0:
            return None
        numerator = (other.px - self.px) * other.dy + (self.py - other.py) * other.dx
        return numerator / denominator


def count_future_path_intersections_in_test_area(
    hailstones: list[Hailstone], area_min: int, area_max: int
) -> int:
    count = 0
    for i, hailstone1 in enumerate(hailstones):
        for hailstone2 in hailstones[i + 1 :]:
            t1 = hailstone1.get_path_intersection_2d(hailstone2)
            t2 = hailstone2.get_path_intersection_2d(hailstone1)
            if t1 is None or t2 is None:
                # print("Hailstones' paths are parallel; they never intersect.")
                continue
            # print(t1, t2)
            if t1 < 0:
                # print("Hailstones' paths crossed in the past for hailstone A.")
                continue
            if t2 < 0:
                # print("Hailstones' paths crossed in the past for hailstone B.")
                continue
            crossing_point = hailstone1.get_position_at_time(t1)
            if (
                area_min <= crossing_point.x <= area_max
                and area_min <= crossing_point.y <= area_max
            ):
                count += 1
                # print(
                #     f"Hailstones' paths will cross inside the test area (at x={crossing_point.x:.5}, y={crossing_point.y:.5})."
                # )
            # else:
            #     print(
            #         f"Hailstones' paths will cross outside the test area (at x={crossing_point.x:.5}, y={crossing_point.y:.5})."
            #     )
    return count


def parse_input(input: list[str]) -> list[Hailstone]:
    return [
        Hailstone(
            *[int(num) for num in line.replace(",", " ").replace("@", " ").split()]
        )
        for line in input
    ]


input = getInput(2023, 24)
hailstones, area_min, area_max = parse_input(input), 200000000000000, 400000000000000
example_input = """
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
""".strip().splitlines()
# hailstones, area_min, area_max = parse_input(example_input), 7, 27


def solution1():
    return count_future_path_intersections_in_test_area(hailstones, area_min, area_max)


def solution2():
    equations = [
        f"px + t{i} * dx == {hailstone.px} + t{i} * {hailstone.dx} && "
        + f"py + t{i} * dy == {hailstone.py} + t{i} * {hailstone.dy} &&"
        + f"pz + t{i} * dz == {hailstone.pz} + t{i} * {hailstone.dz}"
        for i, hailstone in enumerate(hailstones[:3])
    ]
    print()
    print(
        "Open https://www.wolfram.com/language/#playground, paste in the following query, then calculate px + py + pz by hand."
    )
    print()
    return "Solve[" + " && ".join(equations) + "]"


if __name__ == "__main__":
    print(solution1())
    print(solution2())
