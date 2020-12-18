import { getInputArray } from "../utils";

export type ExpressionArray = ("+" | "*" | ExpressionArray)[] | number;
export type Expression =
  | number
  | {
      operator: "+" | "*";
      lhs: Expression;
      rhs: Expression;
    };

export function parseExpressionArray(str: string): ExpressionArray {
  str = str.trim();
  const strAsNumber = +str;
  if (!Number.isNaN(strAsNumber)) {
    return strAsNumber;
  }
  const arr: ExpressionArray = [];
  let openParentheses = 0;
  let lastSplitAtIndex = 0;
  for (let i = 0; i <= str.length; i++) {
    switch (str[i]) {
      case "(":
        openParentheses++;
        break;
      case ")":
        openParentheses--;
        break;
      case "+":
      case "*":
        if (openParentheses === 0) {
          arr.push(
            parseExpressionArray(str.substring(lastSplitAtIndex, i - 1))
          );
          arr.push(str[i] as "+" | "*");
          lastSplitAtIndex = i + 1;
        }
        break;
    }
  }
  if (lastSplitAtIndex === 0) {
    if (str.startsWith("(") && str.endsWith(")")) {
      return parseExpressionArray(str.substring(1, str.length - 1));
    }
    // we didn't make any progress
    throw `Illegal expression: ${str}`;
  }
  arr.push(parseExpressionArray(str.substring(lastSplitAtIndex)));
  return arr;
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
