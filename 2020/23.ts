type Cup = number;
export class CupGame {
  // convention: the current cup is always at position 0
  cups: Cup[];
  lowestCup: Cup;
  highestCup: Cup;
  roundCounter = 0;

  constructor(cupsAsString: string) {
    this.cups = cupsAsString.split("").map((x) => +x);
    this.lowestCup = Math.min(...this.cups);
    this.highestCup = Math.max(...this.cups);
  }

  playSingleRound() {
    const pickedUpCups = this.cups.splice(1, 3);
    let destinationCup = this.cups[0];
    let destinationCupIndex = -1;
    while (destinationCupIndex === -1) {
      destinationCup--;
      if (destinationCup < this.lowestCup) destinationCup = this.highestCup;
      destinationCupIndex = this.cups.indexOf(destinationCup);
    }
    this.cups.splice(destinationCupIndex + 1, 0, ...pickedUpCups);
    const currentCup = this.cups.shift();
    this.cups.push(currentCup);
    this.roundCounter++;
  }

  playUntilRound(round: number) {
    while (this.roundCounter < round) {
      this.playSingleRound();
    }
  }

  getCupLabels(): string {
    const indexOfCup1 = this.cups.indexOf(1);
    return [...this.cups, ...this.cups]
      .slice(indexOfCup1 + 1, indexOfCup1 + this.cups.length)
      .join("");
  }
}

export function solution1() {
  const game = new CupGame("942387615");
  game.playUntilRound(100);
  return game.getCupLabels();
}
