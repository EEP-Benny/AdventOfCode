export class MemoryGame {
  lastTurnANumberWasSpoken = new Map<number, number>();
  currentTurn = 0;
  lastNumber: number;

  constructor(startingNumbers: number[]) {
    for (const startingNumber of startingNumbers) {
      this.speakNumber(startingNumber);
    }
  }
  speakNumber(num: number) {
    if (this.lastNumber !== undefined) {
      this.lastTurnANumberWasSpoken.set(this.lastNumber, this.currentTurn);
    }
    this.lastNumber = num;
    this.currentTurn++;
  }

  singleTurn() {
    let nextNumber = 0;
    const lastTurnTheLastNumberWasSpoken = this.lastTurnANumberWasSpoken.get(
      this.lastNumber
    );
    if (lastTurnTheLastNumberWasSpoken !== undefined) {
      nextNumber = this.currentTurn - lastTurnTheLastNumberWasSpoken;
    }
    this.speakNumber(nextNumber);
  }

  get2020thNumberSpoken() {
    while (this.currentTurn < 2020) {
      this.singleTurn();
    }
    return this.lastNumber;
  }
  get30000000thNumberSpoken() {
    while (this.currentTurn < 30000000) {
      this.singleTurn();
    }
    return this.lastNumber;
  }
}

export function solution1() {
  return new MemoryGame([11, 0, 1, 10, 5, 19]).get2020thNumberSpoken();
}
export function solution2() {
  return new MemoryGame([11, 0, 1, 10, 5, 19]).get30000000thNumberSpoken();
}
