import { isValidPasswordWithCounting, isValidPasswordWithPosition } from "./02";

test("isValidPasswordWithCounting", () => {
  expect(isValidPasswordWithCounting("1-3 a: abcde")).toBe(true);
  expect(isValidPasswordWithCounting("1-3 b: cdefg")).toBe(false);
  expect(isValidPasswordWithCounting("2-9 c: ccccccccc")).toBe(true);
});
test("isValidPasswordWithPosition", () => {
  expect(isValidPasswordWithPosition("1-3 a: abcde")).toBe(true);
  expect(isValidPasswordWithPosition("1-3 b: cdefg")).toBe(false);
  expect(isValidPasswordWithPosition("2-9 c: ccccccccc")).toBe(false);
});
