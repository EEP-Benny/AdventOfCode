from dataclasses import dataclass
from collections import OrderedDict
from utils import getRawInput


def hash(string: str) -> int:
    current_value = 0
    for char in string:
        current_value += ord(char)
        current_value *= 17
        current_value %= 256
    return current_value


class Box(OrderedDict[str, int]):
    pass


@dataclass
class LensConfiguration:
    boxes = [Box() for _ in range(256)]

    def perform_initialization_step(self, step: str):
        if step.endswith("-"):
            label = step[:-1]
            box = hash(label)
            try:
                del self.boxes[box][label]
            except KeyError:
                pass
        else:
            label, focal_length = step.split("=")
            box = hash(label)
            self.boxes[box][label] = int(focal_length)

    def perform_initialization_sequence(self, sequence: list[str]):
        for step in sequence:
            self.perform_initialization_step(step)

    def get_focusing_power(self) -> int:
        focusing_power = 0
        for box_index, box in enumerate(self.boxes):
            for lens_index, focal_length in enumerate(box.values()):
                focusing_power += (box_index + 1) * (lens_index + 1) * focal_length
        return focusing_power


input = getRawInput(2023, 15).strip()
initialization_sequence = input.split(",")


def solution1():
    return sum(hash(step) for step in initialization_sequence)


def solution2():
    lens_configuration = LensConfiguration()
    lens_configuration.perform_initialization_sequence(initialization_sequence)
    return lens_configuration.get_focusing_power()


if __name__ == "__main__":
    print(solution1())
    print(solution2())
