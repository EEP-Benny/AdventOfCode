import { getSeatId } from "./05";

test("getSeatId", () => {
  expect(getSeatId("BFFFBBFRRR")).toBe(567);
  expect(getSeatId("FFFBBBFRRR")).toBe(119);
  expect(getSeatId("BBFFBBFRLL")).toBe(820);
});
