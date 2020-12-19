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
export function parseExpressionWithoutPrecedence(str: string): Expression {
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
    const lastOperator = expArray[expArray.length - 2];
    if (lastOperator === "*" || lastOperator === "+") {
      return {
        operator: lastOperator,
        lhs: parseArray(expArray.slice(0, expArray.length - 2)),
        rhs: parseArray(expArray.slice(expArray.length - 1)),
      };
    }
    throw `Expected operator, but found ${lastOperator} for ${expArray}`;
  }
  return parseArray(parseExpressionArray(str));
}

export function parseExpressionWithInvertedPrecedence(str: string): Expression {
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
    const indexOfMultiplication = expArray.lastIndexOf("*");
    if (indexOfMultiplication >= 0) {
      return {
        operator: "*",
        lhs: parseArray(expArray.slice(0, indexOfMultiplication)),
        rhs: parseArray(expArray.slice(indexOfMultiplication + 1)),
      };
    } else
      return {
        operator: "+",
        lhs: parseArray(expArray.slice(0, expArray.length - 2)),
        rhs: parseArray(expArray.slice(expArray.length - 1)),
      };
  }
  return parseArray(parseExpressionArray(str));
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
