use lazy_static::lazy_static;
use regex::Regex;
use std::collections::HashMap;

use crate::utils::get_input;

#[derive(Debug, PartialEq, Clone, Copy)]
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

    fn get_potential_neighbor(&self, position: &Position, facing: &Facing) -> Option<Position> {
        let candidate_position = match facing {
            Facing::Right => Position {
                x: position.x + 1,
                y: position.y,
            },
            Facing::Down => Position {
                x: position.x,
                y: position.y + 1,
            },
            Facing::Left => Position {
                x: position.x - 1,
                y: position.y,
            },
            Facing::Up => Position {
                x: position.x,
                y: position.y - 1,
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
        position: &Position,
        facing: &Facing,
    ) -> (Position, Facing) {
        self.get_potential_neighbor(&position, facing)
            .map(|position| (position, *facing))
            .unwrap_or_else(|| {
                let mut candidate_position = position.clone();
                let opposite_facing = facing.clockwise().clockwise();
                loop {
                    match self.get_potential_neighbor(&candidate_position, &opposite_facing) {
                        Some(new_position) => candidate_position = new_position,
                        None => return (candidate_position, *facing),
                    }
                }
            })
    }

    fn get_neighbor_on_cube(&self, position: &Position, facing: &Facing) -> (Position, Facing) {
        self.get_potential_neighbor(&position, facing)
            .map(|position| (position, *facing))
            .unwrap_or_else(|| {
                // walk around the edge
                let mut current_position = *position;
                let mut current_facing = facing.clockwise();
                let mut stack = Vec::<bool>::new(); // whether there was a outer corner at this point along the edge
                loop {
                    // println!(
                    //     "at {current_position:?}, facing {current_facing:?}, {} entries on stack",
                    //     stack.len()
                    // );
                    if let Some(_) = self
                        .get_potential_neighbor(&current_position, &current_facing.anticlockwise())
                    {
                        // found a left turn / inner corner
                        current_facing = current_facing.anticlockwise();
                        break; // now tracking back
                    } else if let Some(position) =
                        self.get_potential_neighbor(&current_position, &current_facing)
                    {
                        // straight edge
                        current_position = position;
                        stack.push(false);
                    } else {
                        // found a right turn / outer corner
                        current_facing = current_facing.clockwise();
                        stack.push(true);
                    }
                }
                while let Some(stack_entry) = stack.pop() {
                    // println!(
                    //     "at {current_position:?}, facing {current_facing:?}, {} entries on stack",
                    //     stack.len()
                    // );

                    if let Some(position) =
                        self.get_potential_neighbor(&current_position, &current_facing)
                    {
                        // straight edge
                        current_position = position;
                    } else {
                        // found a right turn / outer corner
                        if !stack_entry {
                            current_facing = current_facing.clockwise();
                        } else {
                            // two outer corners meet -> calculate detour
                            (current_position, current_facing) =
                                self.get_neighbor_on_cube(&current_position, &current_facing);
                        }
                    }
                }
                (current_position, current_facing.clockwise())
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

fn execute_instructions(
    board: &Board,
    instructions: &Vec<Instruction>,
    neighbor_fn: fn(&Board, &Position, &Facing) -> (Position, Facing),
) -> (Position, Facing) {
    let mut current_position = board.get_starting_position();
    let mut current_facing = Facing::Right;
    for instruction in instructions {
        match instruction {
            Instruction::GoForward(amount) => {
                for _ in 1..=*amount {
                    let (new_position, new_facing) =
                        neighbor_fn(board, &current_position, &current_facing);
                    if board.0.get(&new_position) == Some(&Tile::Open) {
                        current_position = new_position;
                        current_facing = new_facing;
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
    let (final_position, final_facing) =
        execute_instructions(&board, &instructions, Board::get_neighbor_with_wraparound);
    get_passwort(final_position, final_facing)
}

fn part2(input: &str) -> u32 {
    let (board, instructions) = parse_input(input);
    let (final_position, final_facing) =
        execute_instructions(&board, &instructions, Board::get_neighbor_on_cube);
    get_passwort(final_position, final_facing)
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
            (Position { x: 1, y: 7 }, Facing::Right)
        );

        assert_eq!(
            board.get_neighbor_with_wraparound(&Position { x: 6, y: 8 }, &Facing::Down),
            (Position { x: 6, y: 5 }, Facing::Right)
        );
    }

    #[test]
    fn test_wraparound_cube() {
        let (board, _) = parse_input(EXAMPLE_INPUT.trim_matches('\n'));

        // example: A -> B
        assert_eq!(
            board.get_neighbor_on_cube(&Position { x: 12, y: 6 }, &Facing::Right),
            (Position { x: 15, y: 9 }, Facing::Down)
        );

        assert_eq!(
            board.get_neighbor_on_cube(&Position { x: 12, y: 5 }, &Facing::Right),
            (Position { x: 16, y: 9 }, Facing::Down)
        );

        assert_eq!(
            board.get_neighbor_on_cube(&Position { x: 12, y: 4 }, &Facing::Right),
            (Position { x: 16, y: 9 }, Facing::Left)
        );

        // example: C -> D
        assert_eq!(
            board.get_neighbor_on_cube(&Position { x: 11, y: 12 }, &Facing::Down),
            (Position { x: 2, y: 8 }, Facing::Up)
        );

        // example: D -> C
        assert_eq!(
            board.get_neighbor_on_cube(&Position { x: 2, y: 8 }, &Facing::Down),
            (Position { x: 11, y: 12 }, Facing::Up)
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
        assert_eq!(part2(EXAMPLE_INPUT.trim_matches('\n')), 5031);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 43466);
        assert_eq!(solution2(), 162155);
    }
}
