import { getInput } from "../utils";

export class CombatGame {
  player1Cards: number[];
  player2Cards: number[];
  roundCounter = 0;

  constructor(input: string) {
    const [, player1String, player2String] = input
      .trim()
      .match(/^Player 1:\n([\d\n]+)\n\nPlayer 2:\n([\d\n]+)$/);
    this.player1Cards = player1String.split("\n").map((x) => +x);
    this.player2Cards = player2String.split("\n").map((x) => +x);
  }

  playSingleRound() {
    const player1Card = this.player1Cards.shift();
    const player2Card = this.player2Cards.shift();
    if (player1Card > player2Card) {
      this.player1Cards.push(player1Card, player2Card);
    } else {
      this.player2Cards.push(player2Card, player1Card);
    }
    this.roundCounter++;
  }

  playUntilWin() {
    while (this.player1Cards.length > 0 && this.player2Cards.length > 0) {
      this.playSingleRound();
    }
  }

  getWinningScore() {
    this.playUntilWin();
    const cards = [...this.player1Cards, ...this.player2Cards];
    let score = 0;
    cards.forEach((card, i) => {
      score += card * (cards.length - i);
    });
    return score;
  }
}

export function solution1() {
  const game = new CombatGame(getInput(22, 2020));
  return game.getWinningScore();
}
