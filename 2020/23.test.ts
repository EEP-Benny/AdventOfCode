import { CupGame } from "./23";

test("CupGame", () => {
  const game = new CupGame("32415");
  expect(game.getCupArray()).toEqual([3, 2, 4, 1, 5]);
  expect(game.lowestCup).toEqual(1);
  expect(game.highestCup).toEqual(5);
});

test("CupGame.play", () => {
  const game = new CupGame("389125467");
  expect(game.lowestCup).toEqual(1);
  expect(game.highestCup).toEqual(9);

  expect(game.roundCounter).toEqual(0);
  expect(game.currentCup).toEqual(3);
  expect(game.getCupArray(3)).toEqual([3, 8, 9, 1, 2, 5, 4, 6, 7]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(1);
  expect(game.currentCup).toEqual(2);
  expect(game.getCupArray(3)).toEqual([3, 2, 8, 9, 1, 5, 4, 6, 7]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(2);
  expect(game.currentCup).toEqual(5);
  expect(game.getCupArray(3)).toEqual([3, 2, 5, 4, 6, 7, 8, 9, 1]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(3);
  expect(game.currentCup).toEqual(8);
  expect(game.getCupArray(7)).toEqual([7, 2, 5, 8, 9, 1, 3, 4, 6]);
  game.playUntilRound(10);
  expect(game.roundCounter).toEqual(10);
  expect(game.currentCup).toEqual(8);
  expect(game.getCupArray(5)).toEqual([5, 8, 3, 7, 4, 1, 9, 2, 6]);
});

test("CupGame.getCupLabels", () => {
  const game = new CupGame("389125467");
  game.playUntilRound(10);
  expect(game.getCupLabels()).toEqual("92658374");
  game.playUntilRound(100);
  expect(game.getCupLabels()).toEqual("67384529");
});

test("CupGame.expandToAMillion", () => {
  const game = new CupGame("389125467", true);
  expect(game.lowestCup).toEqual(1);
  expect(game.highestCup).toEqual(1000000);
  expect(game.cups.getCount()).toEqual(1000000);
  expect(game.getCupArray(999999).slice(0, 15)).toEqual([
    999999,
    1000000,
    3,
    8,
    9,
    1,
    2,
    5,
    4,
    6,
    7,
    10,
    11,
    12,
    13,
  ]);
});

test("CupGame.getProductOfCupsWithStars", () => {
  const game = new CupGame("389125467", true);
  game.playUntilRound(10000000);
  expect(game.getProductOfCupsWithStars()).toEqual(149245887792);
});
