import re
from dataclasses import dataclass, replace
from collections import UserDict
from utils import getRawInput


class Part(UserDict[str, int]):
    def get_rating_sum(self):
        return self["x"] + self["m"] + self["a"] + self["s"]


def split_range(r: range, value: int) -> tuple[range, range]:
    return (range(r.start, value), range(value, r.end))


@dataclass
class CombinationRange:
    x: range
    m: range
    a: range
    s: range

    def split_at(
        self, prop: str, value: int
    ) -> tuple["CombinationRange", "CombinationRange"]:
        if prop == "x":
            return (
                replace(self, x=range(self.x.start, value)),
                replace(self, x=range(value, self.x.stop)),
            )
        if prop == "m":
            return (
                replace(self, m=range(self.m.start, value)),
                replace(self, m=range(value, self.m.stop)),
            )
        if prop == "a":
            return (
                replace(self, a=range(self.a.start, value)),
                replace(self, a=range(value, self.a.stop)),
            )
        if prop == "s":
            return (
                replace(self, s=range(self.s.start, value)),
                replace(self, s=range(value, self.s.stop)),
            )

    def get_size(self) -> int:
        return len(self.x) * len(self.m) * len(self.a) * len(self.s)


@dataclass
class Rule:
    comp_prop: str
    comp_is_lt: bool
    comp_value: int
    next_workflow: str


@dataclass
class Workflow:
    name: str
    rules: list[Rule]
    fallback_workflow: str

    def get_next_workflow(self, part: Part) -> str:
        for rule in self.rules:
            if rule.comp_is_lt:
                if part[rule.comp_prop] < rule.comp_value:
                    return rule.next_workflow
            else:
                if part[rule.comp_prop] > rule.comp_value:
                    return rule.next_workflow
        return self.fallback_workflow

    def get_next_workflows_for_combinations(
        self, combinations: CombinationRange
    ) -> list[tuple[str, CombinationRange]]:
        next_workflows: list[tuple[str, CombinationRange]] = []
        remaining_combinations = combinations
        for rule in self.rules:
            if rule.comp_is_lt:
                left, right = remaining_combinations.split_at(
                    rule.comp_prop, rule.comp_value
                )
                next_workflows.append((rule.next_workflow, left))
                remaining_combinations = right
            else:
                left, right = remaining_combinations.split_at(
                    rule.comp_prop, rule.comp_value + 1
                )
                next_workflows.append((rule.next_workflow, right))
                remaining_combinations = left
        next_workflows.append((self.fallback_workflow, remaining_combinations))
        return next_workflows


@dataclass
class System:
    workflows: dict[str, Workflow]

    def is_part_accepted(self, part: Part) -> bool:
        workflow = "in"
        while workflow not in ["R", "A"]:
            workflow = self.workflows[workflow].get_next_workflow(part)
        return workflow == "A"

    def count_accepted_combinations(self) -> int:
        all_combinations = CombinationRange(
            x=range(1, 4001),
            m=range(1, 4001),
            a=range(1, 4001),
            s=range(1, 4001),
        )
        accepted_combinations: list[CombinationRange] = []
        workflows_to_consider = [("in", all_combinations)]
        while workflows_to_consider:
            workflow_name, combinations = workflows_to_consider.pop()
            if workflow_name == "R":
                continue
            if workflow_name == "A":
                accepted_combinations.append(combinations)
                continue
            workflows_to_consider.extend(
                self.workflows[workflow_name].get_next_workflows_for_combinations(
                    combinations
                )
            )
        return sum(comb.get_size() for comb in accepted_combinations)


def parse_part(input: str) -> Part:
    return Part(
        x=int(re.search(r"x=(\d+)", input)[1]),
        m=int(re.search(r"m=(\d+)", input)[1]),
        a=int(re.search(r"a=(\d+)", input)[1]),
        s=int(re.search(r"s=(\d+)", input)[1]),
    )


def parse_rule(input: str) -> Rule:
    matches = re.match(r"(x|m|a|s)(<|>)(\d+):(\w+)", input)
    return Rule(
        comp_prop=matches[1],
        comp_is_lt=matches[2] == "<",
        comp_value=int(matches[3]),
        next_workflow=matches[4],
    )


def parse_workflow(input: str) -> Workflow:
    matches = re.match(r"(\w+)\{(.*),(\w+)\}", input)
    return Workflow(
        name=matches[1],
        rules=[parse_rule(rule) for rule in matches[2].split(",")],
        fallback_workflow=matches[3],
    )


def parse_input(input: str) -> tuple[System, list[Part]]:
    workflows_input, parts_input = input.split("\n\n")
    workflows = {
        workflow.name: workflow
        for workflow in (parse_workflow(line) for line in workflows_input.splitlines())
    }
    parts = [parse_part(line) for line in parts_input.splitlines()]
    return (System(workflows), parts)


input = getRawInput(2023, 19)
system, parts = parse_input(input)


def solution1():
    return sum(part.get_rating_sum() for part in parts if system.is_part_accepted(part))


def solution2():
    return system.count_accepted_combinations()


if __name__ == "__main__":
    print(solution1())
    print(solution2())
