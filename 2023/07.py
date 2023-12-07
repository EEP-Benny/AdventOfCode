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


def get_score_from_counter(counter: Counter) -> int:
    counts = [count for _, count in counter.most_common()]
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


@dataclass
class Hand:
    cards: "list[str]"

    def get_score(self) -> int:
        counter = Counter(self.cards)
        return get_score_from_counter(counter)

    def get_score_with_joker(self):
        counter_orig = Counter(self.cards)
        if counter_orig.get("J") in [0, 5]:
            # no jokers or all jokers
            return get_score_from_counter(counter_orig)
        most_common_not_joker_card = [
            card for card, _ in counter_orig.most_common() if card != "J"
        ][0]
        counter_with_joker = Counter(
            [card if card != "J" else most_common_not_joker_card for card in self.cards]
        )
        return get_score_from_counter(counter_with_joker)


def decorate(hand: Hand) -> "tuple[int, list[int]]":
    return (hand.get_score(), [card_strengths[card] for card in hand.cards])


def decorate_with_joker(hand: Hand) -> "tuple[int, list[int]]":
    return (
        hand.get_score_with_joker(),
        [card_strengths[card] if card != "J" else 1 for card in hand.cards],
    )


def parse_input_line(line: str) -> "tuple[Hand, int]":
    hand_str, bid_str = line.split()
    return (Hand(list(hand_str)), int(bid_str))


def parse_input(input: "list[str]"):
    return [parse_input_line(line) for line in input]


def calculate_winnings(hands_and_bids, get_decoration) -> int:
    decorated_hands_and_bids = [
        (get_decoration(hand), hand, bid) for hand, bid in hands_and_bids
    ]
    decorated_hands_and_bids.sort(key=itemgetter(0))
    sorted_hands_and_bids = [(hand, bid) for _, hand, bid in decorated_hands_and_bids]
    return sum(
        (index + 1) * bid for index, (_, bid) in enumerate(sorted_hands_and_bids)
    )


input = getInput(2023, 7)
hands_and_bids = parse_input(input)


def solution1():
    return calculate_winnings(hands_and_bids, decorate)


def solution2():
    return calculate_winnings(hands_and_bids, decorate_with_joker)


if __name__ == "__main__":
    print(solution1())
    print(solution2())
