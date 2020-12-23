import { CupGame } from "./23";

test("CupGame", () => {
  const game = new CupGame("32415");
  expect(game.cups).toEqual([3, 2, 4, 1, 5]);
});

test("CupGame.play", () => {
  const game = new CupGame("389125467");
  expect(game.roundCounter).toEqual(0);
  expect(game.cups).toEqual([3, 8, 9, 1, 2, 5, 4, 6, 7]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(1);
  expect(game.cups).toEqual([2, 8, 9, 1, 5, 4, 6, 7, 3]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(2);
  expect(game.cups).toEqual([5, 4, 6, 7, 8, 9, 1, 3, 2]);
  game.playSingleRound();
  expect(game.roundCounter).toEqual(3);
  expect(game.cups).toEqual([8, 9, 1, 3, 4, 6, 7, 2, 5]);
  game.playUntilRound(10);
  expect(game.roundCounter).toEqual(10);
  expect(game.cups).toEqual([8, 3, 7, 4, 1, 9, 2, 6, 5]);
});

test("CupGame.getCupLabels", () => {
  const game = new CupGame("389125467");
  game.playUntilRound(10);
  expect(game.getCupLabels()).toEqual("92658374");
  game.playUntilRound(100);
  expect(game.getCupLabels()).toEqual("67384529");
});
