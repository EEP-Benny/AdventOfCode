use lazy_static::lazy_static;
use regex::Regex;
use std::collections::HashMap;

use crate::utils::get_input;

type MonkeyName = String;
type MonkeyNumber = i64;

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

    fn get_root_monkeys(&self) -> (MonkeyName, MonkeyName) {
        let (left_monkey, right_monkey) = match self
            .monkeys
            .get("root")
            .expect("root monkey should always exist")
        {
            Monkey::Number(_) => panic!("root monkey should depend on two other monkeys"),
            Monkey::Add(left, right) => (left, right),
            Monkey::Sub(left, right) => (left, right),
            Monkey::Mul(left, right) => (left, right),
            Monkey::Div(left, right) => (left, right),
        };
        (left_monkey.clone(), right_monkey.clone())
    }

    fn set_human_number(&mut self, number: MonkeyNumber) {
        self.monkeys
            .insert("humn".to_string(), Monkey::Number(number));
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

fn part2(input: &str) -> MonkeyNumber {
    let mut monkeys = Monkeys::from_input(input);
    let (left_monkey, right_monkey) = monkeys.get_root_monkeys();
    let right_result = monkeys.evaluate_monkey(&right_monkey);

    monkeys.set_human_number(0);
    let left_result_low = monkeys.evaluate_monkey(&left_monkey);

    let high_guess = 1_000_000_000_000;
    monkeys.set_human_number(high_guess);
    let left_result_high = monkeys.evaluate_monkey(&left_monkey);

    // calculate in floating point to avoid integer overflow during multiplication
    let estimated_solution = (high_guess as f64 * (right_result - left_result_low) as f64
        / (left_result_high - left_result_low) as f64) as MonkeyNumber;

    // println!("Estimate: {estimated_solution}");

    for potential_solution in estimated_solution - 10..estimated_solution + 10 {
        monkeys
            .monkeys
            .insert("humn".to_string(), Monkey::Number(potential_solution));

        let left_result = monkeys.evaluate_monkey(&left_monkey);
        let right_result = monkeys.evaluate_monkey(&right_monkey);
        if left_result == right_result {
            return potential_solution as MonkeyNumber;
        }
        // println!("{left_result} != {right_result}");
    }
    panic!("Didn't find a result near the estimated solution {estimated_solution}");
}

pub fn solution1() -> MonkeyNumber {
    part1(&get_input(2022, 21))
}

pub fn solution2() -> MonkeyNumber {
    part2(&get_input(2022, 21))
}

#[cfg(test)]
mod tests {
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
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 301);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 38914458159166);
        assert_eq!(solution2(), 3665520865940);
    }
}
