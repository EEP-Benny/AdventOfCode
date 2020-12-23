import { CupGame } from "./23";

test("CupGame", () => {
  const game = new CupGame("32415");
  expect(game.cups).toEqual([3, 2, 4, 1, 5]);
  expect(game.lowestCup).toEqual(1);
  expect(game.highestCup).toEqual(5);
});

test("CupGame.play", () => {
  const game = new CupGame("389125467");
  expect(game.lowestCup).toEqual(1);
  expect(game.highestCup).toEqual(9);

  expect(game.roundCounter).toEqual(0);
  expect(game.currentCupIndex).toEqual(0);
  expect(game.cups).toEqual([3, 8, 9, 1, 2, 5, 4, 6, 7]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(1);
  expect(game.currentCupIndex).toEqual(1);
  expect(game.cups).toEqual([3, 2, 8, 9, 1, 5, 4, 6, 7]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(2);
  expect(game.currentCupIndex).toEqual(5);
  expect(game.cups).toEqual([8, 9, 1, 3, 2, 5, 4, 6, 7]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(3);
  expect(game.currentCupIndex).toEqual(9);
  expect(game.cups).toEqual([8, 9, 1, 3, 4, 6, 7, 2, 5]);
  // game.playSingleRound();
  // expect(game.roundCounter).toEqual(4);
  // expect(game.currentCupIndex).toEqual(4);
  // expect(game.cups).toEqual([3, 2, 5, 8, 4, 6, 7, 9, 1]);
  // game.playSingleRound();
  // expect(game.roundCounter).toEqual(5);
  // expect(game.currentCupIndex).toEqual(5);
  // expect(game.cups).toEqual([9, 2, 5, 8, 4, 1, 3, 6, 7]);
  // game.playSingleRound();
  // expect(game.roundCounter).toEqual(6);
  // expect(game.currentCupIndex).toEqual(6);
  // expect(game.cups).toEqual([7, 2, 5, 8, 4, 1, 9, 3, 6]);
  game.playUntilRound(10);
  expect(game.roundCounter).toEqual(10);
  expect(game.currentCupIndex).toEqual(31);
  expect(game.cups).toEqual([9, 2, 6, 5, 8, 3, 7, 4, 1]);
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
  expect(game.cups[999999]).toEqual(1000000);
  expect(game.cups).toHaveLength(1000000);
});
