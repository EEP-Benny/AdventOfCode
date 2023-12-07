from operator import itemgetter
from collections import Counter
from dataclasses import dataclass
from utils import getInput


card_strengths = {
    card: i + 2
    for i, card in enumerate(
        reversed("A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2".split(", "))
    )
}


@dataclass
class Hand:
    cards: "list[str]"

    def get_score(self) -> int:
        counter = Counter(self.cards)
        counts = [count for el, count in counter.most_common()]
        if counts[0] == 5:
            return 5  # Five of a kind
        elif counts[0] == 4:
            return 4  # Four of a kind
        elif counts[0] == 3 and counts[1] == 2:
            return 3.5  # Full house
        elif counts[0] == 3:
            return 3  # Three of a kind
        elif counts[0] == 2 and counts[1] == 2:
            return 2  # Two pair
        elif counts[0] == 2:
            return 1  # One pair
        else:
            return 0  # High card

    def get_decorated(self) -> "tuple[int, list[int], Hand]":
        return (self.get_score(), [card_strengths[card] for card in self.cards], self)


def parse_input_line(line: str) -> "tuple[Hand, int]":
    hand_str, bid_str = line.split()
    return (Hand(list(hand_str)), int(bid_str))


def parse_input(input: "list[str]"):
    return [parse_input_line(line) for line in input]


input = getInput(2023, 7)
hands_and_bids = parse_input(input)


def solution1():
    decorated_hands_and_bids = [
        (hand.get_decorated(), bid) for hand, bid in hands_and_bids
    ]
    decorated_hands_and_bids.sort(key=itemgetter(0))
    sorted_hands_and_bids = [
        (decorated_hand[-1], bid) for decorated_hand, bid in decorated_hands_and_bids
    ]
    return sum(
        (index + 1) * bid for index, (hand, bid) in enumerate(sorted_hands_and_bids)
    )


def solution2():
    return


if __name__ == "__main__":
    print(solution1())
    print(solution2())
