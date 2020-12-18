import {
  evaluateExpression,
  parseExpressionArray,
  parseExpressionWithInvertedPrecedence,
  parseExpressionWithoutPrecedence,
} from "./18";

test("parseExpressionArray", () => {
  expect(parseExpressionArray("1 + 2 * 3")).toEqual([1, "+", 2, "*", 3]);
  expect(parseExpressionArray("1 + (2 * 3)")).toEqual([1, "+", [2, "*", 3]]);
});

test("parseExpressionWithoutPrecedence", () => {
  expect(parseExpressionWithoutPrecedence("1 + 2 * 3")).toEqual({
    operator: "*",
    lhs: { operator: "+", lhs: 1, rhs: 2 },
    rhs: 3,
  });
  expect(parseExpressionWithoutPrecedence("1 + (2 * 3)")).toEqual({
    operator: "+",
    lhs: 1,
    rhs: { operator: "*", lhs: 2, rhs: 3 },
  });
  expect(parseExpressionWithoutPrecedence("2 * 3 + (4 * 5)")).toEqual({
    operator: "+",
    lhs: { operator: "*", lhs: 2, rhs: 3 },
    rhs: { operator: "*", lhs: 4, rhs: 5 },
  });
});

test("parseExpressionWithInvertedPrecedence", () => {
  expect(
    parseExpressionWithInvertedPrecedence("1 + 2 * 3 + 4 * 5 + 6")
  ).toEqual({
    operator: "*",
    lhs: {
      operator: "*",
      lhs: { operator: "+", lhs: 1, rhs: 2 },
      rhs: { operator: "+", lhs: 3, rhs: 4 },
    },
    rhs: { operator: "+", lhs: 5, rhs: 6 },
  });
});

test("evaluateExpression", () => {
  const pe1 = (str: string) =>
    evaluateExpression(parseExpressionWithoutPrecedence(str));
  expect(pe1("1 + 2 * 3 + 4 * 5 + 6")).toBe(71);
  expect(pe1("1 + (2 * 3) + (4 * (5 + 6))")).toBe(51);
  expect(pe1("2 * 3 + (4 * 5)")).toBe(26);
  expect(pe1("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toBe(437);
  expect(pe1("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toBe(12240);
  expect(pe1("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toBe(13632);

  const pe2 = (str: string) =>
    evaluateExpression(parseExpressionWithInvertedPrecedence(str));
  expect(pe2("1 + 2 * 3 + 4 * 5 + 6")).toBe(231);
  expect(pe2("1 + (2 * 3) + (4 * (5 + 6))")).toBe(51);
  expect(pe2("2 * 3 + (4 * 5)")).toBe(46);
  expect(pe2("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toBe(1445);
  expect(pe2("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toBe(669060);
  expect(pe2("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toBe(23340);
});
