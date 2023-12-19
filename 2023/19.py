import re
from dataclasses import dataclass
from collections import UserDict
from utils import getRawInput


class Part(UserDict[str, int]):
    def get_rating_sum(self):
        return self["x"] + self["m"] + self["a"] + self["s"]


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


@dataclass
class System:
    workflows: dict[str, Workflow]

    def is_part_accepted(self, part: Part) -> bool:
        workflow = "in"
        while workflow not in ["R", "A"]:
            workflow = self.workflows[workflow].get_next_workflow(part)
        return workflow == "A"


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
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
