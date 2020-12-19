import { getInputArray } from "../utils";

export type ExpressionArray = ("+" | "*" | ExpressionArray)[] | number;
export type Expression =
  | number
  | {
      operator: "+" | "*";
      lhs: Expression;
      rhs: Expression;
    };

/**
 * transforms the expression into a JSON array
 * @example `1 + (2 * 3)` -> `[1,"+",[2,"*",3]]`
 */
export function parseExpressionArray(str: string): ExpressionArray {
  const transformedString = str
    .replace(/\(/g, "[")
    .replace(/\)/g, "]")
    .replace(/\+/g, ',"+",')
    .replace(/\*/g, ',"*",');
  return JSON.parse("[" + transformedString + "]");
}

function parseExpression(
  str: string,
  getSplitIndex: (expArray: ("+" | "*" | ExpressionArray)[]) => number
) {
  function parseArray(expArray: ExpressionArray): Expression {
    if (typeof expArray === "number") {
      return expArray;
    }
    if (expArray.length === 1) {
      if (typeof expArray[0] === "string") {
        throw "Single operator found";
      }
      return parseArray(expArray[0]);
    }
    const splitIndex = getSplitIndex(expArray);
    const operator = expArray[splitIndex];
    if (typeof operator === "string") {
      return {
        operator: operator,
        lhs: parseArray(expArray.slice(0, splitIndex)),
        rhs: parseArray(expArray.slice(splitIndex + 1)),
      };
    } else {
      throw `Can't split expression ${expArray} at index ${splitIndex}: ${operator} is not a valid operator`;
    }
  }
  return parseArray(parseExpressionArray(str));
}
export function parseExpressionWithoutPrecedence(str: string): Expression {
  return parseExpression(str, (expArray) => expArray.length - 2);
}

export function parseExpressionWithInvertedPrecedence(str: string): Expression {
  return parseExpression(str, (expArray) =>
    expArray.lastIndexOf("*") >= 0
      ? expArray.lastIndexOf("*")
      : expArray.length - 2
  );
}

export function evaluateExpression(exp: Expression): number {
  if (typeof exp === "number") {
    return exp;
  }
  switch (exp.operator) {
    case "*":
      return evaluateExpression(exp.lhs) * evaluateExpression(exp.rhs);
    case "+":
      return evaluateExpression(exp.lhs) + evaluateExpression(exp.rhs);
  }
}

export function solution1() {
  const inputLines = getInputArray({ day: 18, year: 2020, separator: "\n" });
  let sum = 0;
  inputLines.forEach((line: string) => {
    const expression = parseExpressionWithoutPrecedence(line);
    sum += evaluateExpression(expression);
  });
  return sum;
}
export function solution2() {
  const inputLines = getInputArray({ day: 18, year: 2020, separator: "\n" });
  let sum = 0;
  inputLines.forEach((line: string) => {
    const expression = parseExpressionWithInvertedPrecedence(line);
    sum += evaluateExpression(expression);
  });
  return sum;
}
