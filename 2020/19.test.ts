import { countValidMessages, parseRules, transformRulesToRegexp } from "./19";

const ruleString1 = `
0: 1 2
1: "a"
2: 1 3 | 3 1
3: "b"
`.trim();

const ruleString2 = `
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"
`.trim();

test("parseRules", () => {
  expect(parseRules(ruleString1)).toEqual({
    "0": "1 2",
    "1": '"a"',
    "2": "1 3 | 3 1",
    "3": '"b"',
  });
});

test("transformRulesToRegexp", () => {
  expect(transformRulesToRegexp(parseRules(ruleString1))).toEqual(
    /^(a)((a)(b)|(b)(a))$/
  );
});

test("countValidMessages", () => {
  const messages = ["ababbb", "bababa", "abbbab", "aaabbb", "aaaabbb"];
  const regexp = transformRulesToRegexp(parseRules(ruleString2));
  expect(countValidMessages(messages, regexp)).toBe(2);
});
