use crate::utils::{get_input, Splittable};
use lazy_static::lazy_static;
use regex::Regex;
use std::vec;

type WorryLevel = u64;

#[derive(Debug, PartialEq, Clone)]
enum Operation {
    Square,
    Add(WorryLevel),
    Mul(WorryLevel),
}

#[derive(Debug, PartialEq, Clone)]
struct Monkey {
    items: Vec<WorryLevel>,
    operation: Operation,
    test_divisible_by: WorryLevel,
    throw_to_monkey_if_true: usize,
    throw_to_monkey_if_false: usize,
}

impl Monkey {
    fn from_string(input: &str) -> Option<Self> {
        lazy_static! {
            static ref RE: Regex = Regex::new(
                r"^Monkey \d+:\n  Starting items: ([\d, ]+)\n  Operation: new = old ([+*]) (\d+|old)\n  Test: divisible by (\d+)\n    If true: throw to monkey (\d+)\n    If false: throw to monkey (\d+)$"
            )
            .unwrap();
        }
        let captures = RE.captures(input)?;
        let items = captures[1].split_and_map(", ", |x| x.parse().unwrap());
        let operation = match (&captures[2], &captures[3]) {
            ("*", "old") => Some(Operation::Square),
            ("*", number_string) => Some(Operation::Mul(number_string.parse().ok()?)),
            ("+", number_string) => Some(Operation::Add(number_string.parse().ok()?)),
            _ => None,
        }
        .expect("Should be a valid operation");
        let test_divisible_by = captures[4].parse().ok()?;
        let throw_to_monkey_if_true = captures[5].parse().ok()?;
        let throw_to_monkey_if_false = captures[6].parse().ok()?;

        Some(Self {
            items,
            operation,
            test_divisible_by,
            throw_to_monkey_if_true,
            throw_to_monkey_if_false,
        })
    }
}

struct WorryGame {
    monkeys: Vec<Monkey>,
    inspection_counter: Vec<u64>,
    greatest_common_test_divisor: WorryLevel,
    round_count: u32,
    does_worry_level_drop: bool,
}

impl WorryGame {
    fn from_input(input: &str, does_worry_level_drop: bool) -> Self {
        let monkeys = input.split_and_map("\n\n", |monkey_string| {
            Monkey::from_string(monkey_string).expect("Should be a valid monkey")
        });
        Self {
            inspection_counter: vec![0; monkeys.len()],
            greatest_common_test_divisor: monkeys.iter().map(|m| m.test_divisible_by).product(),
            monkeys,
            round_count: 0,
            does_worry_level_drop,
        }
    }

    fn play_round(&mut self) {
        for i in 0..self.monkeys.len() {
            let items = std::mem::replace(&mut self.monkeys[i].items, vec![]);
            for item in items {
                let mut worry_level = item;
                match (&self.monkeys[i]).operation {
                    Operation::Square => worry_level = worry_level * worry_level,
                    Operation::Add(number) => worry_level = worry_level + number,
                    Operation::Mul(number) => worry_level = worry_level * number,
                }
                if self.does_worry_level_drop {
                    worry_level = worry_level / 3;
                } else {
                    // keep worry levels manageable
                    worry_level = worry_level % self.greatest_common_test_divisor;
                }
                let target_monkey = if worry_level % self.monkeys[i].test_divisible_by == 0 {
                    self.monkeys[i].throw_to_monkey_if_true
                } else {
                    self.monkeys[i].throw_to_monkey_if_false
                };
                self.monkeys[target_monkey].items.push(worry_level);
                self.inspection_counter[i] += 1;
            }
        }
        self.round_count += 1;
    }

    fn play_until_round(&mut self, round: u32) -> &Self {
        while self.round_count < round {
            self.play_round();
        }
        self
    }

    fn get_item_lists(&self) -> Vec<Vec<WorryLevel>> {
        self.monkeys.iter().map(|m| m.items.clone()).collect()
    }

    fn get_monkey_business(&self) -> u64 {
        let mut most_inspections = 0;
        let mut second_most_inspections = 0;
        for &inspections in &self.inspection_counter {
            if inspections > most_inspections {
                second_most_inspections = most_inspections;
                most_inspections = inspections;
            } else if inspections > second_most_inspections {
                second_most_inspections = inspections;
            }
        }
        most_inspections * second_most_inspections
    }
}

fn part1(input: &str) -> u64 {
    WorryGame::from_input(input, true)
        .play_until_round(20)
        .get_monkey_business()
}

fn part2(input: &str) -> u64 {
    WorryGame::from_input(input, false)
        .play_until_round(10000)
        .get_monkey_business()
}

pub fn solution1() -> u64 {
    part1(&get_input(2022, 11))
}

pub fn solution2() -> u64 {
    part2(&get_input(2022, 11))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
";

    #[test]
    fn test_monkey_from_string() {
        assert_eq!(
            Monkey::from_string(
                "Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3"
            ),
            Some(Monkey {
                items: vec![79, 98],
                operation: Operation::Mul(19),
                test_divisible_by: 23,
                throw_to_monkey_if_true: 2,
                throw_to_monkey_if_false: 3
            })
        );
    }

    #[test]
    fn test_play_round() {
        let mut game = WorryGame::from_input(EXAMPLE_INPUT.trim(), true);

        game.play_round();
        assert_eq!(
            game.get_item_lists(),
            vec![
                vec![20, 23, 27, 26],
                vec![2080, 25, 167, 207, 401, 1046],
                vec![],
                vec![]
            ]
        );

        game.play_round();
        assert_eq!(
            game.get_item_lists(),
            vec![
                vec![695, 10, 71, 135, 350],
                vec![43, 49, 58, 55, 362],
                vec![],
                vec![]
            ]
        );

        game.play_until_round(20);
        assert_eq!(
            game.get_item_lists(),
            vec![
                vec![10, 12, 14, 26, 34],
                vec![245, 93, 53, 199, 115],
                vec![],
                vec![]
            ]
        );
        assert_eq!(game.inspection_counter, vec![101, 95, 7, 105]);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 10605);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 2713310158);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 62491);
        assert_eq!(solution2(), 17408399184);
    }
}
