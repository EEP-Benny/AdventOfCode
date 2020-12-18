import { evaluateExpression, parseExpression } from "./18";

test("parseExpression", () => {
  expect(parseExpression("1 + 2 * 3")).toEqual({
    operator: "*",
    lhs: { operator: "+", lhs: 1, rhs: 2 },
    rhs: 3,
  });
  expect(parseExpression("1 + (2 * 3)")).toEqual({
    operator: "+",
    lhs: 1,
    rhs: { operator: "*", lhs: 2, rhs: 3 },
  });
  expect(parseExpression("2 * 3 + (4 * 5)")).toEqual({
    operator: "+",
    lhs: { operator: "*", lhs: 2, rhs: 3 },
    rhs: { operator: "*", lhs: 4, rhs: 5 },
  });
});

test("evaluateExpression", () => {
  const parseAndEvaluate = (str: string) =>
    evaluateExpression(parseExpression(str));
  expect(parseAndEvaluate("1 + 2 * 3 + 4 * 5 + 6")).toBe(71);
  expect(parseAndEvaluate("1 + (2 * 3) + (4 * (5 + 6))")).toBe(51);
  expect(parseAndEvaluate("2 * 3 + (4 * 5)")).toBe(26);
  expect(parseAndEvaluate("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toBe(437);
  expect(parseAndEvaluate("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toBe(
    12240
  );
  expect(
    parseAndEvaluate("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")
  ).toBe(13632);
});
