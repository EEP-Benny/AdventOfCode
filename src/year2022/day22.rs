use lazy_static::lazy_static;
use regex::Regex;
use std::collections::HashMap;

use crate::utils::get_input;

#[derive(Debug, PartialEq)]
enum Facing {
    Right = 0,
    Down = 1,
    Left = 2,
    Up = 3,
}

impl Facing {
    fn clockwise(&self) -> Self {
        match self {
            Self::Right => Self::Down,
            Self::Down => Self::Left,
            Self::Left => Self::Up,
            Self::Up => Self::Right,
        }
    }

    fn anticlockwise(&self) -> Self {
        match self {
            Self::Right => Self::Up,
            Self::Down => Self::Right,
            Self::Left => Self::Down,
            Self::Up => Self::Left,
        }
    }
}

#[derive(Debug, PartialEq)]
enum Tile {
    Wall,
    Open,
}

#[derive(Debug, PartialEq)]
enum Instruction {
    GoForward(u32),
    TurnClockwise,
    TurnAnticlockwise,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
struct Position {
    x: u32,
    y: u32,
}

#[derive(Debug, PartialEq)]
struct Board(HashMap<Position, Tile>);

impl Board {
    fn from_string(string: &str) -> Self {
        let mut grid = HashMap::new();
        for (line, y) in string.lines().zip(1..) {
            for (char, x) in line.chars().zip(1..) {
                match char {
                    '#' => {
                        grid.insert(Position { x, y }, Tile::Wall);
                    }
                    '.' => {
                        grid.insert(Position { x, y }, Tile::Open);
                    }
                    _ => {}
                }
            }
        }

        Self(grid)
    }

    fn get_starting_position(&self) -> Position {
        let mut position = Position { x: 1, y: 1 };
        loop {
            if self.0.contains_key(&position) {
                break;
            }
            position.x += 1;
        }
        position
    }

    fn get_potential_neighbor(
        &self,
        current_position: &Position,
        facing: &Facing,
    ) -> Option<Position> {
        let mut candidate_position = match facing {
            Facing::Right => Position {
                x: current_position.x + 1,
                y: current_position.y,
            },
            Facing::Down => Position {
                x: current_position.x,
                y: current_position.y + 1,
            },
            Facing::Left => Position {
                x: current_position.x - 1,
                y: current_position.y,
            },
            Facing::Up => Position {
                x: current_position.x,
                y: current_position.y - 1,
            },
        };
        if self.0.contains_key(&candidate_position) {
            Some(candidate_position)
        } else {
            None
        }
    }

    fn get_neighbor_with_wraparound(
        &self,
        current_position: &Position,
        facing: &Facing,
    ) -> Position {
        self.get_potential_neighbor(&current_position, facing)
            .unwrap_or_else(|| {
                let mut candidate_position = current_position.clone();
                let opposite_facing = facing.clockwise().clockwise();
                loop {
                    match self.get_potential_neighbor(&candidate_position, &opposite_facing) {
                        Some(new_position) => candidate_position = new_position,
                        None => return candidate_position,
                    }
                }
            })
    }
}

fn parse_instructions(instruction_string: &str) -> Vec<Instruction> {
    lazy_static! {
        static ref RE: Regex = Regex::new(r"R|L|\d+").unwrap();
    }
    RE.find_iter(instruction_string)
        .map(|m| match m.as_str() {
            "R" => Instruction::TurnClockwise,
            "L" => Instruction::TurnAnticlockwise,
            numeric_string => Instruction::GoForward(numeric_string.parse().unwrap()),
        })
        .collect()
}
fn parse_input(input: &str) -> (Board, Vec<Instruction>) {
    let (board_string, instruction_string) = input.split_once("\n\n").unwrap();
    (
        Board::from_string(board_string),
        parse_instructions(instruction_string),
    )
}

fn execute_instructions(board: &Board, instructions: &Vec<Instruction>) -> (Position, Facing) {
    let mut current_position = board.get_starting_position();
    let mut current_facing = Facing::Right;
    for instruction in instructions {
        match instruction {
            Instruction::GoForward(amount) => {
                for _ in 1..=*amount {
                    let new_position =
                        board.get_neighbor_with_wraparound(&current_position, &current_facing);
                    if board.0.get(&new_position) == Some(&Tile::Open) {
                        current_position = new_position;
                    } else {
                        break; // we reached a wall
                    }
                }
            }
            Instruction::TurnClockwise => current_facing = current_facing.clockwise(),
            Instruction::TurnAnticlockwise => current_facing = current_facing.anticlockwise(),
        }
    }
    (current_position, current_facing)
}

fn get_passwort(position: Position, facing: Facing) -> u32 {
    position.y * 1000 + position.x * 4 + facing as u32
}

fn part1(input: &str) -> u32 {
    let (board, instructions) = parse_input(input);
    let (final_position, final_facing) = execute_instructions(&board, &instructions);
    get_passwort(final_position, final_facing)
}

fn part2(input: &str) -> u32 {
    0
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 22))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 22))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
";

    #[test]
    fn test_starting_position() {
        let (board, _) = parse_input(EXAMPLE_INPUT.trim_matches('\n'));

        assert_eq!(board.get_starting_position(), Position { x: 9, y: 1 });
    }

    #[test]
    fn test_wraparound() {
        let (board, _) = parse_input(EXAMPLE_INPUT.trim_matches('\n'));

        assert_eq!(
            board.get_neighbor_with_wraparound(&Position { x: 12, y: 7 }, &Facing::Right),
            Position { x: 1, y: 7 }
        );

        assert_eq!(
            board.get_neighbor_with_wraparound(&Position { x: 6, y: 8 }, &Facing::Down),
            Position { x: 6, y: 5 }
        );
    }

    #[test]
    fn test_parse_instructions() {
        assert_eq!(
            parse_instructions("10R5L5R10L4R5L5"),
            vec![
                Instruction::GoForward(10),
                Instruction::TurnClockwise,
                Instruction::GoForward(5),
                Instruction::TurnAnticlockwise,
                Instruction::GoForward(5),
                Instruction::TurnClockwise,
                Instruction::GoForward(10),
                Instruction::TurnAnticlockwise,
                Instruction::GoForward(4),
                Instruction::TurnClockwise,
                Instruction::GoForward(5),
                Instruction::TurnAnticlockwise,
                Instruction::GoForward(5),
            ]
        );
    }
    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim_matches('\n')), 6032);
        assert_eq!(part2(EXAMPLE_INPUT.trim_matches('\n')), 0);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 43466);
        assert_eq!(solution2(), 0);
    }
}
