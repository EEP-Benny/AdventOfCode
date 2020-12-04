import {
  containsAllRequiredFields,
  countPassportsWithAllRequiredFields,
  hasAllFieldsValid,
  validators,
} from "./04";

test("containsAllRequiredFields", () => {
  const passportString1 = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm`;
  const passportString2 = `iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929`;
  const passportString3 = `hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm`;
  const passportString4 = `hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

  expect(containsAllRequiredFields(passportString1)).toBe(true);
  expect(containsAllRequiredFields(passportString2)).toBe(false);
  expect(containsAllRequiredFields(passportString3)).toBe(true);
  expect(containsAllRequiredFields(passportString4)).toBe(false);
});

test("countPassportsWithAllRequiredFields", () => {
  const batch = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in`;

  expect(countPassportsWithAllRequiredFields(batch)).toEqual(2);
});

test("validators", () => {
  expect(validators.get("byr")("2002")).toBe(true);
  expect(validators.get("byr")("2003")).toBe(false);

  expect(validators.get("hgt")("60in")).toBe(true);
  expect(validators.get("hgt")("190cm")).toBe(true);
  expect(validators.get("hgt")("190in")).toBe(false);
  expect(validators.get("hgt")("190")).toBe(false);

  expect(validators.get("hcl")("#123abc")).toBe(true);
  expect(validators.get("hcl")("#123abz")).toBe(false);
  expect(validators.get("hcl")("123abc")).toBe(false);

  expect(validators.get("ecl")("brn")).toBe(true);
  expect(validators.get("ecl")("wat")).toBe(false);

  expect(validators.get("pid")("000000001")).toBe(true);
  expect(validators.get("pid")("0123456789")).toBe(false);
});

test("hasAllFieldsValid", () => {
  const invalidPassports = [
    `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926`,
    `iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946`,
    `hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277`,
    `hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007`,
  ];

  const validPassports = [
    `pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f`,
    `eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm`,
    `hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022`,
    `iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`,
  ];

  for (const invalidPassport of invalidPassports) {
    expect(hasAllFieldsValid(invalidPassport)).toBe(false);
  }
  for (const validPassport of validPassports) {
    expect(hasAllFieldsValid(validPassport)).toBe(true);
  }
});
