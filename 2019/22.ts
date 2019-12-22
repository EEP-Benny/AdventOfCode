import { getInput } from '../utils';

enum Instruction {
    DealIntoNewStack,
    CutNCards,
    DealWithIncrement,
}

abstract class Shuffling {
    abstract dealIntoNewStack(): this;
    abstract cutNCards(n: number): this;
    abstract dealWithIncrement(n: number): this;
    public applyInstructions(instructions: [Instruction, number][]): this {
        instructions.forEach(([instruction, n]) => {
            switch (instruction) {
                case Instruction.DealIntoNewStack:
                    this.dealIntoNewStack();
                    break;
                case Instruction.CutNCards:
                    this.cutNCards(n);
                    break;
                case Instruction.DealWithIncrement:
                    this.dealWithIncrement(n);
                    break;
            }
        });
        return this;
    }
    public parseInstructions(instructionsString: string): this {
        return this.applyInstructions(parseInstructions(instructionsString));
    }
}
export function parseInstructions(instructionsString: string): [Instruction, number][] {
    const instructions = instructionsString.split("\n");
    return instructions.map(instruction => {
        const [, text, num] = instruction.match(/^\s*(.*?)\s*([-0-9]*)$/);
        const n = parseInt(num);
        switch (text) {
            case "deal into new stack":
                return [Instruction.DealIntoNewStack, 0];
            case "cut":
                return [Instruction.CutNCards, n];
            case "deal with increment":
                return [Instruction.DealWithIncrement, n];
            default:
                return [undefined, 0];
        }
    });
}

export class CardDeck extends Shuffling {
    public deck: number[];
    constructor(size: number) {
        super();
        this.deck = Array.from(Array(size).keys()); // equivalent to pythons range(size)
    }

    public dealIntoNewStack() {
        this.deck.reverse();
        return this;
    }

    public cutNCards(n: number) {
        this.deck = this.deck.slice(n).concat(this.deck.slice(0, n));
        return this;
    }

    public dealWithIncrement(n: number) {
        const size = this.deck.length;
        const newDeck = Array(size);
        for (let i = 0; i < size; i++) {
            newDeck[i * n % size] = this.deck[i];
        }
        this.deck = newDeck;
        return this;
    }
}

function modInverse(a: number, m: number) {
    const m0 = m;
    let y = 0;
    let x = 1;

    while (a > 1) {

        // q is quotient
        const q = Math.floor(a / m);

        let t = m;

        // m is remainder now, process
        // same as Euclid's algo
        m = a % m;
        a = t;
        t = y;

        // Update x and y
        y = x - q * y;
        x = t;

    }
    // Make x positive
    if (x < 0) {
        x = x + m0;
    }
    return x;
}
export class TrackingCardDeck extends Shuffling {
    public cardPosition: number;
    private inverse: number[] = [];
    private getInverse(n: number) {
        if (!this.inverse[n]) {
            this.inverse[n] = modInverse(n, this.size);
        }
        return this.inverse[n];
    }
    constructor(private size: number, finalPosition: number) {
        super();
        this.cardPosition = finalPosition;
    };

    public dealIntoNewStack() {
        this.cardPosition = this.size - this.cardPosition - 1;
        return this;
    }

    public cutNCards(n: number) {
        this.cardPosition = (this.cardPosition + this.size + n) % this.size;
        return this;
    }

    public dealWithIncrement(n: number) {
        this.cardPosition = (this.cardPosition * this.getInverse(n)) % this.size;
        return this;
    }

    public applyInstructions(instructions: [Instruction, number][]) {
        return super.applyInstructions([...instructions].reverse());
    }
}

export function solution1() {
    const deck = new CardDeck(10007).parseInstructions(getInput(22)).deck;
    const trackingDeck = new TrackingCardDeck(10007, deck.indexOf(2019)).parseInstructions(getInput(22));
    if (trackingDeck.cardPosition != 2019) {
        throw "Mismatch";
    }
    return deck.indexOf(2019);
}
/*
export function solution2() {
    const instructions = parseInstructions(getInput(22));
    const repetitions = 101741582076661;
    const deck = new TrackingCardDeck(119315717514047, 2020);
    const alreadyOccuredIn = new Map<number, number>();
    for (let i = 0; i < repetitions; i++) {
        deck.applyInstructions(instructions);
        if (alreadyOccuredIn.has(deck.cardPosition)) {
            // we are in a loop, no need to calculate the remaining repetions
            const loopLength = alreadyOccuredIn.get(deck.cardPosition);
            console.log("We are in a loop at iteration", i, ", ", deck.cardPosition, "already occured at iteration", alreadyOccuredIn.get(deck.cardPosition));
            // break;
        }
        alreadyOccuredIn.set(deck.cardPosition, i);
        // console.log(deck.positionOfCard);

        i % 100000 == 0 && console.log(i);
    }
    // return deck.deck.indexOf(2020);
    return deck.cardPosition;
}*/