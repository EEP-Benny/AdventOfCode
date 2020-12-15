import { MemoryGame } from "./15";

test("setup and singleTurn", () => {
  const game = new MemoryGame([0, 3, 6]);
  expect(game.lastTurnANumberWasSpoken).toEqual(
    new Map([
      [0, 1],
      [3, 2],
    ])
  );
  expect(game.lastNumber).toEqual(6);
  expect(game.currentTurn).toEqual(3);
  game.singleTurn();
  expect(game.lastNumber).toEqual(0);
  game.singleTurn();
  expect(game.lastNumber).toEqual(3);
  game.singleTurn();
  expect(game.lastNumber).toEqual(3);
  game.singleTurn();
  expect(game.lastNumber).toEqual(1);
  game.singleTurn();
  expect(game.lastNumber).toEqual(0);
  game.singleTurn();
  expect(game.lastNumber).toEqual(4);
  game.singleTurn();
  expect(game.lastNumber).toEqual(0);
});

test("get2020thNumberSpoken", () => {
  expect(new MemoryGame([0, 3, 6]).get2020thNumberSpoken()).toEqual(436);
  expect(new MemoryGame([1, 3, 2]).get2020thNumberSpoken()).toEqual(1);
  expect(new MemoryGame([2, 1, 3]).get2020thNumberSpoken()).toEqual(10);
  expect(new MemoryGame([1, 2, 3]).get2020thNumberSpoken()).toEqual(27);
  expect(new MemoryGame([2, 3, 1]).get2020thNumberSpoken()).toEqual(78);
  expect(new MemoryGame([3, 2, 1]).get2020thNumberSpoken()).toEqual(438);
  expect(new MemoryGame([3, 1, 2]).get2020thNumberSpoken()).toEqual(1836);
});
test("get30000000thNumberSpoken", () => {
  expect(new MemoryGame([0, 3, 6]).get30000000thNumberSpoken()).toEqual(175594);
  expect(new MemoryGame([1, 3, 2]).get30000000thNumberSpoken()).toEqual(2578);
  expect(new MemoryGame([2, 1, 3]).get30000000thNumberSpoken()).toEqual(
    3544142
  );
  expect(new MemoryGame([1, 2, 3]).get30000000thNumberSpoken()).toEqual(261214);
  expect(new MemoryGame([2, 3, 1]).get30000000thNumberSpoken()).toEqual(
    6895259
  );
  expect(new MemoryGame([3, 2, 1]).get30000000thNumberSpoken()).toEqual(18);
  expect(new MemoryGame([3, 1, 2]).get30000000thNumberSpoken()).toEqual(362);
});
