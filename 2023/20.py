from dataclasses import dataclass, field
from collections import defaultdict, UserDict, Counter
from utils import getInput


@dataclass
class Pulse:
    is_high: bool
    sender: str
    receiver: str


@dataclass
class Module:
    name: str
    inputs: list[str]
    outputs: list[str]

    def pulse_to_all_outputs(self, is_high_pulse: bool) -> list[Pulse]:
        return [Pulse(is_high_pulse, self.name, output) for output in self.outputs]

    def process_pulse(self, pulse: Pulse) -> list[Pulse]:
        return self.pulse_to_all_outputs(pulse.is_high)


@dataclass
class FlipFlopModule(Module):
    is_on: bool = field(default=False)

    def process_pulse(self, pulse: Pulse) -> list[Pulse]:
        if not pulse.is_high:
            self.is_on = not self.is_on
            return self.pulse_to_all_outputs(self.is_on)
        return []


@dataclass()
class ConjunctionModule(Module):
    memory: dict[str, bool] = field(default_factory=dict)

    def process_pulse(self, pulse: Pulse) -> list[Pulse]:
        self.memory[pulse.sender] = pulse.is_high
        return self.pulse_to_all_outputs(
            not all(self.memory.get(input, False) for input in self.inputs)
        )


class ModuleConfiguration(UserDict[str, Module]):
    pass


def parse_input(input: list[str]) -> ModuleConfiguration:
    module_types = dict[str, str]()
    module_outputs = dict[str, list[str]]()
    module_inputs = defaultdict[str, list[str]](list)
    module_names = list[str]()
    for line in input:
        module_name, output_str = line.split(" -> ")
        if module_name[0] in "%&":
            module_type = module_name[0]
            module_name = module_name[1:]
            module_types[module_name] = module_type
        outputs = output_str.split(", ")
        module_outputs[module_name] = outputs
        for output in outputs:
            module_inputs[output].append(module_name)
        module_names.append(module_name)

    return ModuleConfiguration(
        {
            name: {"%": FlipFlopModule, "&": ConjunctionModule, None: Module}[
                module_types.get(name)
            ](name, module_inputs.get(name), module_outputs.get(name))
            for name in module_names
        }
    )


input = getInput(2023, 20)
modules = parse_input(input)


def push_the_button(module_config: ModuleConfiguration) -> dict[bool, int]:
    pulse_counter = Counter()

    pulses_to_process = [Pulse(False, "button", "broadcaster")]
    while pulses_to_process:
        pulse = pulses_to_process.pop()
        pulse_counter[pulse.is_high] += 1
        receiver = module_config.get(pulse.receiver)
        if receiver:
            pulses_to_process.extend(receiver.process_pulse(pulse))

    return pulse_counter


def solution1():
    counter = Counter()
    for _ in range(1000):
        counter += push_the_button(modules)
    return counter[True] * counter[False]


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
