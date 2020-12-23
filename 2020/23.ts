type Cup = number;

type LinkedListItem<T> = {
  value: T;
  next: LinkedListItem<T>;
};
export class LinkedList<T> {
  mapOfItems = new Map<T, LinkedListItem<T>>();

  static fromArray<T>(arr: T[]) {
    const list = new LinkedList<T>();
    arr.forEach((item) => {
      list.mapOfItems.set(item, { value: item, next: null });
    });
    for (let index = arr.length - 1; index >= 0; index--) {
      list.mapOfItems.set(arr[index], {
        value: arr[index],
        next: list.get(arr[index + 1]),
      });
    }
    list.get(arr[arr.length - 1]).next = list.get(arr[0]);
    return list;
  }

  get(value: T) {
    return this.mapOfItems.get(value);
  }
  getCount() {
    return this.mapOfItems.size;
  }

  toArray(firstValue: T): T[] {
    const arr = Array(this.getCount());
    let item = this.get(firstValue);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = item.value;
      item = item.next;
    }
    return arr;
  }
}
export class CupGame {
  // convention: the current cup is always at position 0
  cups: LinkedList<Cup>;
  currentCup: Cup;
  lowestCup: Cup;
  highestCup: Cup;
  roundCounter = 0;

  constructor(cupsAsString: string, expandToAMillion = false) {
    const cupsArray = cupsAsString.split("").map((x) => +x);
    this.currentCup = cupsArray[0];
    this.lowestCup = Math.min(...cupsArray);
    this.highestCup = Math.max(...cupsArray);
    if (expandToAMillion) {
      for (let i = this.highestCup + 1; i <= 1000000; i++) {
        cupsArray.push(i);
      }
      this.highestCup = 1000000;
    }
    this.cups = LinkedList.fromArray(cupsArray);
  }

  playSingleRound() {
    // pick up three cups next to the current cup and remove them from the circle
    const currentCupItem = this.cups.get(this.currentCup);
    const firstPickedUpCupItem = currentCupItem.next;
    const lastPickedUpCupItem = firstPickedUpCupItem.next.next;
    const pickedUpCups = [
      firstPickedUpCupItem.value,
      firstPickedUpCupItem.next.value,
      lastPickedUpCupItem.value,
    ];
    currentCupItem.next = lastPickedUpCupItem.next;

    // select a destination cup
    let destinationCup = this.currentCup;
    while (
      pickedUpCups.includes(destinationCup) ||
      destinationCup === this.currentCup
    ) {
      destinationCup--;
      if (destinationCup < this.lowestCup) destinationCup = this.highestCup;
    }

    // place the picked up cups after the destination cup
    const destinationCupItem = this.cups.get(destinationCup);
    const cupAfterInsertedCupsItem = destinationCupItem.next;
    destinationCupItem.next = firstPickedUpCupItem;
    lastPickedUpCupItem.next = cupAfterInsertedCupsItem;

    // select a new current cup
    this.currentCup = currentCupItem.next.value;

    this.roundCounter++;
  }

  playUntilRound(round: number) {
    while (this.roundCounter < round) {
      this.playSingleRound();
    }
  }

  getCupArray(startingCup?: Cup): Cup[] {
    if (startingCup === undefined) startingCup = this.currentCup;
    return this.cups.toArray(startingCup);
  }

  getCupLabels(): string {
    return this.getCupArray(1).slice(1).join("");
  }

  getProductOfCupsWithStars(): number {
    const cup1Item = this.cups.get(1);
    return cup1Item.next.value * cup1Item.next.next.value;
  }
}

export function solution1() {
  const game = new CupGame("942387615");
  game.playUntilRound(100);
  return game.getCupLabels();
}
export function solution2() {
  const game = new CupGame("942387615", true);
  game.playUntilRound(10000000);
  return game.getProductOfCupsWithStars();
}
