import { CardDeck, parseInstructions, TrackingCardDeck } from './22';

test("deck creation", () => {
    expect(new CardDeck(1).deck).toEqual([0]);
    expect(new CardDeck(10).deck).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("deal into new stack", () => {
    expect(new CardDeck(5).dealIntoNewStack().deck).toEqual([4, 3, 2, 1, 0]);
});

test("cut N cards", () => {
    expect(new CardDeck(10).cutNCards(3).deck).toEqual([3, 4, 5, 6, 7, 8, 9, 0, 1, 2]);
    expect(new CardDeck(10).cutNCards(-4).deck).toEqual([6, 7, 8, 9, 0, 1, 2, 3, 4, 5]);
});

test("deal with increment", () => {
    expect(new CardDeck(10).dealWithIncrement(3).deck).toEqual([0, 7, 4, 1, 8, 5, 2, 9, 6, 3]);
});

test("parse and apply instructions", () => {
    expect(new CardDeck(10).parseInstructions(`\
        deal with increment 7
        deal into new stack
        deal into new stack`
    ).deck).toEqual([0, 3, 6, 9, 2, 5, 8, 1, 4, 7]);

    expect(new CardDeck(10).parseInstructions(`\
        cut 6
        deal with increment 7
        deal into new stack`
    ).deck).toEqual([3, 0, 7, 4, 1, 8, 5, 2, 9, 6]);

    expect(new CardDeck(10).parseInstructions(`\
        deal with increment 7
        deal with increment 9
        cut -2`
    ).deck).toEqual([6, 3, 0, 7, 4, 1, 8, 5, 2, 9]);

    expect(new CardDeck(10).parseInstructions(`\
        deal into new stack
        cut -2
        deal with increment 7
        cut 8
        cut -4
        deal with increment 7
        cut 3
        deal with increment 9
        deal with increment 3
        cut -1`
    ).deck).toEqual([9, 2, 5, 8, 1, 4, 7, 0, 3, 6]);
});

test("Tracking card deck", () => {
    expect(new TrackingCardDeck(10, 1).cardPosition).toBe(1);
    expect(new TrackingCardDeck(10, 1).dealIntoNewStack().cardPosition).toBe(8);
    expect(new TrackingCardDeck(10, 1).cutNCards(3).cardPosition).toBe(4);
    expect(new TrackingCardDeck(10, 1).cutNCards(-4).cardPosition).toBe(7);
    expect(new TrackingCardDeck(10, 1).dealWithIncrement(3).cardPosition).toBe(7);
    expect(new TrackingCardDeck(10, 6).dealWithIncrement(3).cardPosition).toBe(2);
});

test("compare Tracking card deck with standard card deck", () => {
    const instructions = parseInstructions(`\
        deal into new stack
        cut -2
        deal with increment 7
        cut 8
        cut -4
        deal with increment 7
        cut 3
        deal with increment 9
        deal with increment 3
        cut -1`);
    const size = 1000;
    const standardDeck = new CardDeck(size).applyInstructions(instructions).deck;
    for (let i = 0; i < size; i++) {
        expect(new TrackingCardDeck(size, i).applyInstructions(instructions).cardPosition).toBe(standardDeck[i]);
    }
});