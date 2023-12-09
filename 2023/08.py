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
    step_count = 0
    current_node_ids = [key for key in network.nodes.keys() if key.endswith("A")]
    while not all(id.endswith("Z") for id in current_node_ids):
        current_nodes = [network.nodes.get(id) for id in current_node_ids]
        instruction = instructions[step_count % len(instructions)]
        current_node_ids = [
            (node.left if instruction == "L" else node.right) for node in current_nodes
        ]
        step_count += 1
    return step_count


if __name__ == "__main__":
    print(solution1())
    print(solution2())
