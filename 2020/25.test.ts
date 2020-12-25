import { findEncryptionKey, findLoopSize } from "./25";

test("findLoopSize", () => {
  expect(findLoopSize([5764801])).toEqual([8, 0]);
  expect(findLoopSize([17807724])).toEqual([11, 0]);
  expect(findLoopSize([17807724, 5764801])).toEqual([8, 1]);
});

test("findEncryptionKey", () => {
  expect(findEncryptionKey([17807724, 5764801])).toEqual(14897079);
});
