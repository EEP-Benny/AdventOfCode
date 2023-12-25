from math import prod
from collections import defaultdict, UserDict, Counter
from random import choice, choices
from utils import getInput


class NodeGroup(frozenset[str]):
    pass


class Graph(UserDict[NodeGroup, Counter[NodeGroup]]):
    def collapse_nodes(self, node_a: NodeGroup, node_b: NodeGroup):
        new_node = NodeGroup([*node_a, *node_b])
        self[new_node] = Counter[NodeGroup]()
        for connected_node, weight in list(self[node_a].items()):
            if connected_node == node_b:
                continue
            del self[connected_node][node_a]
            self[connected_node][new_node] += weight
            self[new_node][connected_node] += weight
        for connected_node, weight in list(self[node_b].items()):
            if connected_node == node_a:
                continue
            del self[connected_node][node_b]
            self[connected_node][new_node] += weight
            self[new_node][connected_node] += weight
        del self[node_a]
        del self[node_b]

    def find_min_cut(self):
        """
        Karger's algorithm, collapse random edges until there are only two nodes.
        Works because it is more likely to collapse a non-min-cut edge than a min-cut edge
        https://en.wikipedia.org/wiki/Karger%27s_algorithm
        """
        copy = Graph(
            {node: connected_nodes.copy() for node, connected_nodes in self.items()}
        )
        while len(copy) > 2:
            node_a = choice(list(copy.keys()))
            (node_b,) = choices(list(copy[node_a]), copy[node_a].values())
            copy.collapse_nodes(node_a, node_b)
        return copy


def parse_input(input: list[str]) -> Graph:
    adjacent_nodes = defaultdict[NodeGroup, Counter[NodeGroup]](Counter[NodeGroup])
    for line in input:
        start_node, end_nodes = line.split(": ")
        for end_node in end_nodes.split():
            start_node_group = NodeGroup([start_node])
            end_node_group = NodeGroup([end_node])
            adjacent_nodes[start_node_group][end_node_group] += 1
            adjacent_nodes[end_node_group][start_node_group] += 1
    return Graph(dict(adjacent_nodes))


input = getInput(2023, 25)
graph = parse_input(input)


def solution1():
    while True:
        min_graph = graph.find_min_cut()
        nodes = list(min_graph.keys())
        connection_count = min_graph[nodes[0]][nodes[1]]
        if connection_count == 3:
            return prod(len(node) for node in min_graph)


if __name__ == "__main__":
    print(solution1())
