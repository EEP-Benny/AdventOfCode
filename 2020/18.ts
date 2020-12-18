import { getInputArray } from "../utils";

export type Expression =
  | number
  | {
      operator: "+" | "*";
      lhs: Expression;
      rhs: Expression;
    };
export function parseExpression(str: string): Expression {
  const strAsNumber = +str;
  if (!Number.isNaN(strAsNumber)) {
    return strAsNumber;
  }
  let openParentheses = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    switch (str[i]) {
      case ")":
        openParentheses++;
        break;
      case "(":
        openParentheses--;
        break;
      case "+":
      case "*":
        if (openParentheses === 0) {
          return {
            operator: str[i] as "+" | "*",
            lhs: parseExpression(str.substring(0, i - 1).trim()),
            rhs: parseExpression(str.substring(i + 1).trim()),
          };
        }
    }
  }
  if (str.startsWith("(") && str.endsWith(")")) {
    return parseExpression(str.substring(1, str.length - 1));
  }
  throw `Invalid expression: ${str}`;
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
    const expression = parseExpression(line);
    sum += evaluateExpression(expression);
  });
  return sum;
}
