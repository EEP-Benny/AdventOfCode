use lazy_static::lazy_static;
use regex::Regex;
use std::collections::HashMap;

use crate::utils::get_input;

type MonkeyName = String;
type MonkeyNumber = u64;

#[derive(Debug, PartialEq)]
enum Monkey {
    Number(MonkeyNumber),
    Add(MonkeyName, MonkeyName),
    Sub(MonkeyName, MonkeyName),
    Mul(MonkeyName, MonkeyName),
    Div(MonkeyName, MonkeyName),
}

impl Monkey {
    fn from_string(string: &str) -> Option<(MonkeyName, Self)> {
        lazy_static! {
            static ref RE: Regex =
                Regex::new(r"^(?P<monkey_name>\w+): (?:(?P<number>\d+)|(?P<left>\w+) (?P<operand>\+|-|\*|/) (?P<right>\w+))$").unwrap();
        }
        let captures = RE.captures(string)?;

        let monkey_name = captures.name("monkey_name")?.as_str().to_string();
        let number = captures
            .name("number")
            .and_then(|m| m.as_str().parse::<MonkeyNumber>().ok());
        let operand = captures.name("operand").map(|m| m.as_str());
        let left = captures.name("left").map(|m| m.as_str().to_string());
        let right = captures.name("right").map(|m| m.as_str().to_string());
        let monkey = match operand {
            None => Monkey::Number(number?),
            Some("+") => Monkey::Add(left?, right?),
            Some("-") => Monkey::Sub(left?, right?),
            Some("*") => Monkey::Mul(left?, right?),
            Some("/") => Monkey::Div(left?, right?),
            Some(_) => panic!("Unknown operand {operand:?}"),
        };
        // let operand = captures
        Some((monkey_name, monkey))
    }
}

#[derive(Debug, PartialEq)]
struct Monkeys {
    monkeys: HashMap<MonkeyName, Monkey>,
}

impl Monkeys {
    fn from_input(input: &str) -> Self {
        Self {
            monkeys: HashMap::from_iter(input.lines().filter_map(Monkey::from_string)),
        }
    }

    fn evaluate_monkey(&self, monkey_name: &MonkeyName) -> MonkeyNumber {
        let monkey = self
            .monkeys
            .get(monkey_name)
            .expect("There should be a monkey with the requested name");
        match monkey {
            Monkey::Number(number) => *number,
            Monkey::Add(left, right) => self.evaluate_monkey(left) + self.evaluate_monkey(right),
            Monkey::Sub(left, right) => self.evaluate_monkey(left) - self.evaluate_monkey(right),
            Monkey::Mul(left, right) => self.evaluate_monkey(left) * self.evaluate_monkey(right),
            Monkey::Div(left, right) => self.evaluate_monkey(left) / self.evaluate_monkey(right),
        }
    }
}

fn part1(input: &str) -> MonkeyNumber {
    Monkeys::from_input(input).evaluate_monkey(&"root".to_string())
}

fn part2(input: &str) -> u32 {
    0
}

pub fn solution1() -> MonkeyNumber {
    part1(&get_input(2022, 21))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 21))
}

#[cfg(test)]
mod tests {

    use std::time::Instant;

    use super::*;

    const EXAMPLE_INPUT: &str = "
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
";

    #[test]
    fn test_monkey_from_string() {
        assert_eq!(
            Monkey::from_string("root: pppw + sjmn"),
            Some((
                "root".to_string(),
                Monkey::Add("pppw".to_string(), "sjmn".to_string())
            ))
        );
        assert_eq!(
            Monkey::from_string("ptdq: humn - dvpt"),
            Some((
                "ptdq".to_string(),
                Monkey::Sub("humn".to_string(), "dvpt".to_string())
            ))
        );
        assert_eq!(
            Monkey::from_string("sjmn: drzm * dbpl"),
            Some((
                "sjmn".to_string(),
                Monkey::Mul("drzm".to_string(), "dbpl".to_string())
            ))
        );
        assert_eq!(
            Monkey::from_string("pppw: cczh / lfqf"),
            Some((
                "pppw".to_string(),
                Monkey::Div("cczh".to_string(), "lfqf".to_string())
            ))
        );
        assert_eq!(
            Monkey::from_string("hmdt: 32"),
            Some(("hmdt".to_string(), Monkey::Number(32)))
        );
    }

    #[test]
    fn test_evaluate_monkey() {
        let monkeys = Monkeys::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(monkeys.evaluate_monkey(&"hmdt".to_string()), 32);
        assert_eq!(monkeys.evaluate_monkey(&"zczc".to_string()), 2);
        assert_eq!(monkeys.evaluate_monkey(&"drzm".to_string()), 30);
        assert_eq!(monkeys.evaluate_monkey(&"sjmn".to_string()), 150);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 152);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 0);
    }

    #[test]
    fn test_solutions() {
        let start = Instant::now();
        assert_eq!(solution1(), 38914458159166);
        let duration1 = start.elapsed();
        assert_eq!(solution2(), 0);
        let duration2 = start.elapsed() - duration1;
        println!(
            "Part 1 took {}ms, Part 2 took {}ms",
            duration1.as_millis(),
            duration2.as_millis(),
        );
    }
}
