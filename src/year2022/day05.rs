use crate::utils::{get_input, Splittable};
use std::collections::HashMap;

type Crate = char;
type StackNumber = char;

#[derive(Debug, PartialEq)]
struct StackOfCrates {
    stacks: HashMap<StackNumber, Vec<Crate>>,
    stack_numbers: Vec<StackNumber>,
}

impl StackOfCrates {
    fn from_input_string(input: &str) -> Self {
        let mut stacks = HashMap::new();
        let mut stack_numbers = Vec::new();
        let input_lines: Vec<Vec<char>> = input
            .lines()
            .rev()
            .map(|line| line.chars().collect())
            .collect();
        for column in (1..input_lines[0].len()).step_by(4) {
            let stack_number = input_lines[0][column];
            stack_numbers.push(stack_number);
            let mut stack = Vec::new();

            for row in 1..input_lines.len() {
                let crate_char = input_lines[row][column];
                if crate_char == ' ' {
                    break;
                }
                stack.push(crate_char)
            }
            stacks.insert(stack_number, stack);
        }

        StackOfCrates {
            stacks,
            stack_numbers,
        }
    }

    fn move_crates(self: &mut Self, amount: u32, source: StackNumber, target: StackNumber) {
        for _ in 0..amount {
            let crate_char = self
                .stacks
                .get_mut(&source)
                .expect("Stack {source} should exist")
                .pop()
                .expect("Stack {source} should not be empty");
            self.stacks
                .get_mut(&target)
                .expect("Stack {target} should exist")
                .push(crate_char);
        }
    }

    fn execute_moves(self: &mut Self, instructions: Vec<&str>) {
        for instruction in instructions {
            let parts = instruction.split_to_strings(" ");
            let amount: u32 = parts[1].parse().expect("Should be a number");
            let source = parts[3]
                .chars()
                .next()
                .expect("Instruction should contain a source");
            let target = parts[5]
                .chars()
                .next()
                .expect("Instruction should contain a source");
            self.move_crates(amount, source, target);
        }
    }

    fn top_crates(self: &Self) -> String {
        self.stack_numbers
            .iter()
            .map(|stack_number| {
                self.stacks[stack_number]
                    .last()
                    .expect("Stack should not be empty")
            })
            .collect()
    }
}

fn part1(input: &str) -> String {
    let input_parts = input.split_to_strings("\n\n");
    let mut stack = StackOfCrates::from_input_string(&input_parts[0]);
    stack.execute_moves(input_parts[1].lines().collect());

    stack.top_crates()
}

pub fn solution1() -> String {
    part1(&get_input(2022, 05))
}

#[cfg(test)]
mod tests {
    use std::vec;

    use super::*;

    const EXAMPLE_INPUT: &str = "
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
";

    const EXAMPLE_STACK: &str = "    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 ";

    #[test]
    fn test_stack_from_input_string() {
        assert_eq!(
            StackOfCrates::from_input_string(EXAMPLE_STACK),
            StackOfCrates {
                stacks: HashMap::from([
                    ('1', vec!['Z', 'N']),
                    ('2', vec!['M', 'C', 'D']),
                    ('3', vec!['P'])
                ]),
                stack_numbers: vec!['1', '2', '3']
            }
        );
    }

    #[test]
    fn test_move_crates() {
        let mut stack = StackOfCrates::from_input_string(EXAMPLE_STACK);

        stack.move_crates(1, '2', '1');
        assert_eq!(
            stack,
            StackOfCrates {
                stacks: HashMap::from([
                    ('1', vec!['Z', 'N', 'D']),
                    ('2', vec!['M', 'C']),
                    ('3', vec!['P']),
                ]),
                stack_numbers: vec!['1', '2', '3']
            }
        );

        stack.move_crates(3, '1', '3');
        assert_eq!(
            stack,
            StackOfCrates {
                stacks: HashMap::from([
                    ('1', vec![]),
                    ('2', vec!['M', 'C']),
                    ('3', vec!['P', 'D', 'N', 'Z'])
                ]),
                stack_numbers: vec!['1', '2', '3']
            }
        );

        stack.move_crates(2, '2', '1');
        assert_eq!(
            stack,
            StackOfCrates {
                stacks: HashMap::from([
                    ('1', vec!['C', 'M']),
                    ('2', vec![]),
                    ('3', vec!['P', 'D', 'N', 'Z'])
                ]),
                stack_numbers: vec!['1', '2', '3']
            }
        );

        stack.move_crates(1, '1', '2');
        assert_eq!(
            stack,
            StackOfCrates {
                stacks: HashMap::from([
                    ('1', vec!['C']),
                    ('2', vec!['M']),
                    ('3', vec!['P', 'D', 'N', 'Z'])
                ]),
                stack_numbers: vec!['1', '2', '3']
            }
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim_matches('\n')), "CMZ");
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), "VGBBJCRMN");
    }
}
