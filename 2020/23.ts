type Cup = number;
export class CupGame {
  // convention: the current cup is always at position 0
  cups: Cup[];
  currentCupIndex = 0;
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

  setCup(index: number, value: Cup) {
    this.cups[index % this.cups.length] = value;
  }
  getCup(index: number): Cup {
    return this.cups[index % this.cups.length];
  }

  playSingleRound() {
    const currentCup = this.getCup(this.currentCupIndex);
    const pickedUpCups = [1, 2, 3].map((i) =>
      this.getCup(this.currentCupIndex + i)
    );

    let destinationCup = currentCup;
    while (
      pickedUpCups.includes(destinationCup) ||
      destinationCup === currentCup
    ) {
      destinationCup--;
      if (destinationCup < this.lowestCup) destinationCup = this.highestCup;
    }
    let destinationCupIndex = this.cups.indexOf(destinationCup);
    if (destinationCupIndex < 0) {
      throw "couldn't find destination cup " + destinationCup;
    }
    while (destinationCupIndex < this.currentCupIndex - this.cups.length / 2) {
      destinationCupIndex += this.cups.length;
    }
    while (destinationCupIndex > this.currentCupIndex + this.cups.length / 2) {
      destinationCupIndex -= this.cups.length;
    }

    console.log({
      round: this.roundCounter,
      difference: this.currentCupIndex - destinationCupIndex,
      currentIndex: this.currentCupIndex,
      destinationIndex: destinationCupIndex,
      current: currentCup,
      destination: destinationCup,
    });
    if (this.currentCupIndex < destinationCupIndex) {
      // shift forward
      for (let i = this.currentCupIndex + 4; i <= destinationCupIndex; i++) {
        this.setCup(i - 3, this.getCup(i));
      }
      for (let i = 0; i < 3; i++) {
        this.setCup(destinationCupIndex - 2 + i, pickedUpCups[i]);
      }
    } else {
      // shift backward
      for (let i = this.currentCupIndex; i >= destinationCupIndex + 1; i--) {
        this.setCup(i + 3, this.getCup(i));
      }
      for (let i = 0; i < 3; i++) {
        this.setCup(destinationCupIndex + 1 + i, pickedUpCups[i]);
      }
      this.currentCupIndex += 3;
    }

    this.currentCupIndex++;
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
  // game.playUntilRound(100);
  return game.getCupLabels();
}
export function solution2() {
  const game = new CupGame("942387615", true);
  game.playUntilRound(20);
  console.log(game.cups.slice(0, 100));

  // return game.getCupLabels();
}
