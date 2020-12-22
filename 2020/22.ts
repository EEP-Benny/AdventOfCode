import { getInput } from "../utils";

function parseInput(input: string) {
  const [, player1String, player2String] = input
    .trim()
    .match(/^Player 1:\n([\d\n]+)\n\nPlayer 2:\n([\d\n]+)$/);
  return [
    player1String.split("\n").map((x) => +x),
    player2String.split("\n").map((x) => +x),
  ];
}

export class CombatGame {
  player1Cards: number[];
  player2Cards: number[];
  roundCounter = 0;
  winner: 1 | 2 | undefined;

  static fromInput(input: string) {
    const game = new CombatGame();
    [game.player1Cards, game.player2Cards] = parseInput(input);
    return game;
  }

  checkForWin() {
    if (this.player2Cards.length === 0) {
      this.winner = 1;
    }
    if (this.player1Cards.length === 0) {
      this.winner = 2;
    }
  }
  playSingleRound() {
    const player1Card = this.player1Cards.shift();
    const player2Card = this.player2Cards.shift();
    if (player1Card > player2Card) {
      this.player1Cards.push(player1Card, player2Card);
    } else {
      this.player2Cards.push(player2Card, player1Card);
    }
    this.checkForWin();
    this.roundCounter++;
  }

  playUntilWin() {
    while (this.winner === undefined) {
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

export class RecursiveCombatGame extends CombatGame {
  alreadySeenCardsOfPlayer1: Set<string> = new Set();
  alreadySeenCardsOfPlayer2: Set<string> = new Set();

  static fromInput(input: string) {
    const game = new RecursiveCombatGame();
    [game.player1Cards, game.player2Cards] = parseInput(input);
    return game;
  }

  infiniteLoopPrevented() {
    const player1CardsString = this.player1Cards.join(",");
    const player2CardsString = this.player2Cards.join(",");
    if (
      this.alreadySeenCardsOfPlayer1.has(player1CardsString) ||
      this.alreadySeenCardsOfPlayer2.has(player2CardsString)
    ) {
      return true;
    } else {
      this.alreadySeenCardsOfPlayer1.add(player1CardsString);
      this.alreadySeenCardsOfPlayer2.add(player2CardsString);
      return false;
    }
  }

  playSingleRound() {
    if (this.infiniteLoopPrevented()) {
      this.winner = 1;
      return;
    }
    const player1Card = this.player1Cards.shift();
    const player2Card = this.player2Cards.shift();
    let winnerOfThisRound: 1 | 2;
    if (
      this.player1Cards.length >= player1Card &&
      this.player2Cards.length >= player2Card
    ) {
      const subGame = new RecursiveCombatGame();
      subGame.player1Cards = this.player1Cards.slice(0, player1Card);
      subGame.player2Cards = this.player2Cards.slice(0, player2Card);
      subGame.playUntilWin();
      winnerOfThisRound = subGame.winner;
    } else {
      winnerOfThisRound = player1Card > player2Card ? 1 : 2;
    }
    if (winnerOfThisRound === 1) {
      this.player1Cards.push(player1Card, player2Card);
    } else {
      this.player2Cards.push(player2Card, player1Card);
    }
    this.checkForWin();
    this.roundCounter++;
  }
}

export function solution1() {
  const game = CombatGame.fromInput(getInput(22, 2020));
  return game.getWinningScore();
}

export function solution2() {
  const game = RecursiveCombatGame.fromInput(getInput(22, 2020));
  return game.getWinningScore();
}
