import { CombatGame, RecursiveCombatGame } from "./22";

const input = `
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
`.trim();

test("CombatGame.constructor", () => {
  const game = CombatGame.fromInput(input);
  expect(game.player1Cards).toEqual([9, 2, 6, 3, 1]);
  expect(game.player2Cards).toEqual([5, 8, 4, 7, 10]);
});

test("CombatGame.playSingleRound", () => {
  const game = CombatGame.fromInput(input);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(1);
  expect(game.player1Cards).toEqual([2, 6, 3, 1, 9, 5]);
  expect(game.player2Cards).toEqual([8, 4, 7, 10]);
  game.playSingleRound();
  game.playSingleRound();
  game.playSingleRound();
  expect(game.roundCounter).toEqual(4);
  expect(game.player1Cards).toEqual([1, 9, 5, 6, 4]);
  expect(game.player2Cards).toEqual([10, 8, 2, 7, 3]);
});

test("CombatGame.playUntilWin", () => {
  const game = CombatGame.fromInput(input);
  game.playUntilWin();
  expect(game.roundCounter).toEqual(29);
  expect(game.player1Cards).toEqual([]);
  expect(game.player2Cards).toEqual([3, 2, 10, 6, 8, 5, 9, 4, 7, 1]);
});

test("CombatGame.getWinningScore", () => {
  const game = CombatGame.fromInput(input);
  expect(game.getWinningScore()).toEqual(306);
});

test("RecursiveCombatGame", () => {
  const game = RecursiveCombatGame.fromInput(input);
  expect(game.getWinningScore()).toEqual(291);
});
