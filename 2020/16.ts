import { getInput } from "../utils";

export type FieldRule = {
  name: string;
  min1: number;
  max1: number;
  min2: number;
  max2: number;
};
export function parseRule(ruleString: string) {
  const match = ruleString.match(/^([\w ]+): (\d+)-(\d+) or (\d+)-(\d+)$/);
  return {
    name: match[1],
    min1: +match[2],
    max1: +match[3],
    min2: +match[4],
    max2: +match[5],
  };
}
export function parseInput(input: string) {
  const split = input.trim().split("\n\n");
  const rules: FieldRule[] = split[0].split("\n").map(parseRule);
  const yourTicket: number[] = split[1]
    .split("\n")[1]
    .split(",")
    .map((v) => +v);
  const nearbyTickets: number[][] = split[2]
    .split("\n")
    .splice(1) // remove first line (which is "nearby tickets:")
    .map((line) => line.split(",").map((v) => +v));
  return { rules, yourTicket, nearbyTickets };
}

export function valueMatchesRule(value: number, rule: FieldRule) {
  return (
    (value >= rule.min1 && value <= rule.max1) ||
    (value >= rule.min2 && value <= rule.max2)
  );
}

export function valueMatchesAnyRule(value: number, rules: FieldRule[]) {
  return rules.some((rule) => valueMatchesRule(value, rule));
}

export function sumOfInvalidValues(rules: FieldRule[], values: number[]) {
  let sum = 0;
  for (const value of values) {
    if (!valueMatchesAnyRule(value, rules)) {
      sum += value;
    }
  }
  return sum;
}

export function ruleMatchesAllTicketsAtIndex(
  rule: FieldRule,
  tickets: number[][],
  index: number
) {
  for (const ticket of tickets) {
    if (!valueMatchesRule(ticket[index], rule)) {
      return false;
    }
  }
  return true;
}

export function getFieldNameOrder(rules: FieldRule[], tickets: number[][]) {
  const validTickets = tickets.filter((ticket) =>
    ticket.every((value) => valueMatchesAnyRule(value, rules))
  );
  const possibleFields: string[][] = [];
  for (let i = 0; i < validTickets[0].length; i++) {
    possibleFields[i] = [];
    rules.forEach((rule) => {
      if (ruleMatchesAllTicketsAtIndex(rule, validTickets, i)) {
        possibleFields[i].push(rule.name);
      }
    });
  }
  const fieldOrder: string[] = [];
  function foundFieldAtIndex(fieldName: string, index: number) {
    // insert field in the result array
    fieldOrder[index] = fieldName;

    // remove the field from the search space
    for (let j = 0; j < possibleFields.length; j++) {
      possibleFields[j] = possibleFields[j].filter((x) => x !== fieldName);
    }
  }
  for (let round = 0; round < possibleFields.length; round++) {
    for (let i = 0; i < possibleFields.length; i++) {
      if (possibleFields[i].length === 1) {
        foundFieldAtIndex(possibleFields[i][0], i);
        break;
      }
    }
  }
  return fieldOrder;
}

export function solution1() {
  const parsedInput = parseInput(getInput(16, 2020));
  return sumOfInvalidValues(
    parsedInput.rules,
    [].concat(...parsedInput.nearbyTickets)
  );
}

export function solution2() {
  const parsedInput = parseInput(getInput(16, 2020));
  const fieldOrder = getFieldNameOrder(
    parsedInput.rules,
    parsedInput.nearbyTickets
  );
  let product = 1;

  fieldOrder.forEach((ruleName, i) => {
    if (ruleName.startsWith("departure")) {
      product *= parsedInput.yourTicket[i];
    }
  });
  return product;
}
