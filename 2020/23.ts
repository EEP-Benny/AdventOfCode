type Cup = number;
export class CupGame {
  // convention: the current cup is always at position 0
  cups: Cup[];
  lowestCup: Cup;
  highestCup: Cup;
  roundCounter = 0;

  constructor(cupsAsString: string, expandToAMillion = false) {
    this.cups = cupsAsString.split("").map((x) => +x);
    this.lowestCup = Math.min(...this.cups);
    this.highestCup = Math.max(...this.cups);
    if (expandToAMillion) {
      this.cups = Array(1000000)
        .fill(0)
        .map((_, i) => this.cups[i] ?? i + 1);
      this.highestCup = 1000000;
    }
  }

  playSingleRound() {
    let destinationCup = this.cups[0];
    let destinationCupIndex = -1;
    // search for a cup that isn't picked up (cups 1-3 are picked up)
    while (destinationCupIndex === -1) {
      destinationCup--;
      if (destinationCup < this.lowestCup) destinationCup = this.highestCup;
      destinationCupIndex = this.cups.indexOf(destinationCup, 4);
    }

    this.cups = this.cups.map((_, i) => {
      if (i <= destinationCupIndex - 4) {
        return this.cups[i + 4];
      }
      if (i <= destinationCupIndex - 1) {
        return this.cups[i + 4 - destinationCupIndex];
      }
      if (i <= this.cups.length - 2) {
        return this.cups[i + 1];
      } else {
        return this.cups[0];
      }
    });
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
export function solution2() {
  const game = new CupGame("942387615", true);
  game.playUntilRound(1000);
  // return game.getCupLabels();
}
