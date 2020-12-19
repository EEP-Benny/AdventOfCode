import { getInputArray } from "../utils";

export function parseRules(ruleString: string): { [key: string]: string } {
  const ruleMap = {};
  ruleString.split("\n").forEach((line) => {
    const [ruleNumber, rule] = line.split(": ");
    ruleMap[ruleNumber] = rule;
  });
  return ruleMap;
}

export function transformRulesToRegexp(rules: {
  [key: string]: string;
}): RegExp {
  const regexpContents = {};
  function getRegexpContent(ruleNumber: string) {
    if (regexpContents[ruleNumber]) {
      return regexpContents[ruleNumber];
    }
    const rule = rules[ruleNumber];
    if (rule.startsWith('"')) {
      if (rule.length !== 3) {
        throw `Unexpected rule format: ${ruleNumber}: ${rule}`;
      }
      return rule[1];
    }
    return rule
      .split(" | ")
      .map((subrule) =>
        subrule
          .split(" ")
          .map((ruleNumber) => `(${getRegexpContent(ruleNumber)})`)
          .join("")
      )
      .join("|");
  }
  return new RegExp(`^${getRegexpContent("0")}$`);
}

export function countValidMessages(messages: string[], regexp: RegExp): number {
  let count = 0;
  for (const message of messages) {
    if (message.match(regexp)) {
      count++;
    }
  }
  return count;
}

export function solution1() {
  const [ruleString, messageString] = getInputArray({
    day: 19,
    year: 2020,
    separator: "\n\n",
  });
  const regexp = transformRulesToRegexp(parseRules(ruleString));
  const messages = messageString.split("\n");
  return countValidMessages(messages, regexp);
}
