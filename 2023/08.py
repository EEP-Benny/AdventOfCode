import math
import re
from dataclasses import dataclass
from utils import getRawInput


@dataclass
class Node:
    left: str
    right: str


@dataclass
class Network:
    nodes: "dict[str, Node]"


def parse_input(input: str) -> "tuple[str, Network]":
    instructions, network_str = input.split("\n\n")
    network = Network(dict())
    for node_str in network_str.splitlines():
        id, left, right = re.match(r"(\w{3}) = \((\w{3}), (\w{3})\)", node_str).groups()
        network.nodes[id] = Node(left, right)
    return instructions, network


input = getRawInput(2023, 8)
instructions, network = parse_input(input)


def solution1():
    step_count = 0
    current_node_id = "AAA"
    while current_node_id != "ZZZ":
        current_node = network.nodes.get(current_node_id)
        instruction = instructions[step_count % len(instructions)]
        current_node_id = (
            current_node.left if instruction == "L" else current_node.right
        )
        step_count += 1
    return step_count


def solution2():
    def find_next_target_node(node_id: str) -> "tuple[int, str]":
        step = 0
        while not node_id.endswith("Z") or step == 0:
            node = network.nodes.get(node_id)
            instruction = instructions[step % len(instructions)]
            node_id = node.left if instruction == "L" else node.right
            step += 1

        assert step % len(instructions) == 0

        return (step, node_id)

    cycle_times = []
    for start_node in network.nodes.keys():
        if start_node.endswith("A"):
            initial_steps, target_node = find_next_target_node(start_node)
            cycle_steps, target_target_node = find_next_target_node(target_node)
            assert initial_steps == cycle_steps
            assert target_node == target_target_node
            cycle_times.append(initial_steps)
    return math.lcm(*cycle_times)


if __name__ == "__main__":
    print(solution1())
    print(solution2())
