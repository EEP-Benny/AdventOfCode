from utils import getInput


def get_diffs(seq: "list[int]") -> "list[list[int]]":
    diffs = [seq]
    while any(diff != 0 for diff in diffs[-1]):
        diffs.append(
            [diffs[-1][i + 1] - diffs[-1][i] for i in range(len(diffs[-1]) - 1)]
        )
    return diffs


def predict_next_value_in_sequence(seq: "list[int]") -> int:
    next_value = 0
    for diff_seq in reversed(get_diffs(seq)):
        next_value += diff_seq[-1]
    return next_value


def predict_previous_value_before_sequence(seq: "list[int]") -> int:
    previous_value = 0
    for diff_seq in reversed(get_diffs(seq)):
        previous_value = diff_seq[0] - previous_value
    return previous_value


def parse_input(input: "list[str]") -> "list[list[int]]":
    return [[int(x) for x in line.split()] for line in input]


input = getInput(2023, 9)
sequences = parse_input(input)


def solution1():
    return sum(predict_next_value_in_sequence(seq) for seq in sequences)


def solution2():
    return sum(predict_previous_value_before_sequence(seq) for seq in sequences)


if __name__ == "__main__":
    print(solution1())
    print(solution2())
