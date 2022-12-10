use crate::utils::get_input;

#[derive(Debug, PartialEq)]
enum Instruction {
    Noop,
    AddX(i32),
}

#[derive(Debug, PartialEq)]
struct VideoSystem {
    register_at_cycle: Vec<i32>,
}

impl VideoSystem {
    fn new() -> Self {
        Self {
            register_at_cycle: vec![1, 1],
        }
    }
    fn run_instruction(&mut self, instruction: Instruction) {
        let current_register_value = *self
            .register_at_cycle
            .last()
            .expect("register should have a value");
        match instruction {
            Instruction::Noop => self.register_at_cycle.push(current_register_value),
            Instruction::AddX(number) => {
                self.register_at_cycle.push(current_register_value);
                self.register_at_cycle.push(current_register_value + number);
            }
        }
    }

    fn run_instructions(&mut self, instructions: Vec<Instruction>) {
        for instruction in instructions {
            self.run_instruction(instruction);
        }
    }

    fn get_interesting_signal_strengths(&self, indices: &[usize]) -> i32 {
        indices
            .iter()
            .map(|&index| index as i32 * self.register_at_cycle[index])
            .sum()
    }
}

fn parse_input(input: &str) -> Vec<Instruction> {
    input
        .lines()
        .map(
            |line| match line.split_whitespace().collect::<Vec<_>>()[..] {
                ["noop"] => Instruction::Noop,
                ["addx", number] => {
                    Instruction::AddX(number.parse().expect("addx argument should be numeric"))
                }
                _ => panic!("Unknown instruction {line}"),
            },
        )
        .collect()
}

fn part1(input: &str) -> u32 {
    let mut video_system = VideoSystem::new();
    video_system.run_instructions(parse_input(input));
    video_system
        .get_interesting_signal_strengths(&[20, 60, 100, 140, 180, 220])
        .try_into()
        .unwrap()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 10))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT_SHORT: &str = "noop\naddx 3\naddx -5";
    const EXAMPLE_INPUT_LONG: &str = "addx 15\naddx -11\naddx 6\naddx -3\naddx 5\naddx -1\naddx -8\naddx 13\naddx 4\nnoop\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx 5\naddx -1\naddx -35\naddx 1\naddx 24\naddx -19\naddx 1\naddx 16\naddx -11\nnoop\nnoop\naddx 21\naddx -15\nnoop\nnoop\naddx -3\naddx 9\naddx 1\naddx -3\naddx 8\naddx 1\naddx 5\nnoop\nnoop\nnoop\nnoop\nnoop\naddx -36\nnoop\naddx 1\naddx 7\nnoop\nnoop\nnoop\naddx 2\naddx 6\nnoop\nnoop\nnoop\nnoop\nnoop\naddx 1\nnoop\nnoop\naddx 7\naddx 1\nnoop\naddx -13\naddx 13\naddx 7\nnoop\naddx 1\naddx -33\nnoop\nnoop\nnoop\naddx 2\nnoop\nnoop\nnoop\naddx 8\nnoop\naddx -1\naddx 2\naddx 1\nnoop\naddx 17\naddx -9\naddx 1\naddx 1\naddx -3\naddx 11\nnoop\nnoop\naddx 1\nnoop\naddx 1\nnoop\nnoop\naddx -13\naddx -19\naddx 1\naddx 3\naddx 26\naddx -30\naddx 12\naddx -1\naddx 3\naddx 1\nnoop\nnoop\nnoop\naddx -9\naddx 18\naddx 1\naddx 2\nnoop\nnoop\naddx 9\nnoop\nnoop\nnoop\naddx -1\naddx 2\naddx -37\naddx 1\naddx 3\nnoop\naddx 15\naddx -21\naddx 22\naddx -6\naddx 1\nnoop\naddx 2\naddx 1\nnoop\naddx -10\nnoop\nnoop\naddx 20\naddx 1\naddx 2\naddx 2\naddx -6\naddx -11\nnoop\nnoop\nnoop";

    #[test]
    fn test_parse_input() {
        assert_eq!(
            parse_input(EXAMPLE_INPUT_SHORT),
            vec![
                Instruction::Noop,
                Instruction::AddX(3),
                Instruction::AddX(-5)
            ]
        )
    }

    #[test]
    fn test_run_instructions() {
        let mut video_system = VideoSystem::new();
        video_system.run_instructions(parse_input(EXAMPLE_INPUT_SHORT));
        assert_eq!(video_system.register_at_cycle, vec![1, 1, 1, 1, 4, 4, -1]);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT_LONG), 13140);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 12880);
    }
}
