import { getInput } from "../utils";

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
export const validators = new Map<string, (v: string) => boolean>([
  ["byr", (v) => +v >= 1920 && +v <= 2002],
  ["iyr", (v) => +v >= 2010 && +v <= 2020],
  ["eyr", (v) => +v >= 2020 && +v <= 2030],
  [
    "hgt",
    (v) => {
      const num = parseInt(v);
      switch (v.substr(-2)) {
        case "cm":
          return num >= 150 && num <= 193;
        case "in":
          return num >= 59 && num <= 76;
        default:
          return false;
      }
    },
  ],
  ["hcl", (v) => /^#[0-9a-f]{6}$/.test(v)],
  [
    "ecl",
    (v) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].indexOf(v) > -1,
  ],
  ["pid", (v) => /^[0-9]{9}$/.test(v)],
]);

export function containsAllRequiredFields(passportString: string) {
  for (const field of requiredFields) {
    if (passportString.indexOf(field) === -1) {
      return false;
    }
  }
  return true;
}

export function hasAllFieldsValid(passportString: string) {
  let foundInvalid = false;
  validators.forEach((validator, key) => {
    const match = passportString.match(new RegExp(key + ":(\\S*)"));
    if (!match || !validator(match[1])) {
      foundInvalid = true;
    }
  });
  //   const fields = passportString.split(/\s/);
  //   console.log(fields);
  return !foundInvalid;
}

export function countPassportsWithAllRequiredFields(batch: string) {
  const passportStrings = batch.split("\n\n");
  return passportStrings.filter(containsAllRequiredFields).length;
}

export function countValidPassports(batch: string) {
  const passportStrings = batch.split("\n\n");
  return passportStrings.filter(hasAllFieldsValid).length;
}

export function solution1() {
  const batch = getInput(4, 2020);
  return countPassportsWithAllRequiredFields(batch);
}

export function solution2() {
  const batch = getInput(4, 2020);
  return countValidPassports(batch);
}
