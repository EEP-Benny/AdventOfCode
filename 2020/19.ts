import { getInputArray } from "../utils";

type RuleObject = { [key: string]: string };

export function parseRules(ruleString: string): RuleObject {
  const ruleMap = {};
  ruleString.split("\n").forEach((line) => {
    const [ruleNumber, rule] = line.split(": ");
    ruleMap[ruleNumber] = rule;
  });
  return ruleMap;
}

export function transformRulesToRegexps(rules: RuleObject): RuleObject {
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
    return (
      "(" +
      rule
        .split(" | ")
        .map((subrule) =>
          subrule
            .split(" ")
            .map((ruleNumber) => getRegexpContent(ruleNumber))
            .join("")
        )
        .join("|") +
      ")"
    );
  }
  return Object.keys(rules).reduce((result, ruleNumber) => {
    result[ruleNumber] = getRegexpContent(ruleNumber);
    return result;
  }, {});
}

export function isMessageValid1(
  message: string,
  regexpStrings: RuleObject
): boolean {
  return new RegExp(`^${regexpStrings[0]}$`).test(message);
}
export function isMessageValid2(
  message: string,
  regexpStrings: RuleObject
): boolean {
  const regexpAll = new RegExp(
    `^(?<first>(${regexpStrings["42"]}){2,})(?<last>(${regexpStrings["31"]}){1,})$`
  );
  const matchAll = message.match(regexpAll);
  if (!matchAll) {
    return false;
  }
  const part42 = matchAll.groups.first;
  const part31 = matchAll.groups.last;
  const matches42 = part42.replace(new RegExp(regexpStrings["42"], "g"), ".");
  const matches31 = part31.replace(new RegExp(regexpStrings["31"], "g"), ".");

  return matches42.length > matches31.length;
}

function getInput() {
  return getInputArray({ day: 19, year: 2020, separator: "\n\n" });
}
export function solution1() {
  const [ruleString, messageString] = getInput();
  const regexps = transformRulesToRegexps(parseRules(ruleString));
  const messages = messageString.split("\n");
  return messages.filter((m) => isMessageValid1(m, regexps)).length;
}

export function solution2() {
  const [ruleString, messageString] = getInput();
  const regexps = transformRulesToRegexps(parseRules(ruleString));
  const messages = messageString.split("\n");
  return messages.filter((m) => isMessageValid2(m, regexps)).length;
}
