use std::collections::HashSet;

use crate::utils::get_input;

#[derive(Debug, PartialEq)]
enum Direction {
    Up,
    Right,
    Down,
    Left,
}
use Direction::*;

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
struct Position {
    x: i32,
    y: i32,
}

impl Position {
    fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }

    fn neighbor(&self, dir: &Direction) -> Self {
        match dir {
            Up => Self::new(self.x, self.y - 1),
            Right => Self::new(self.x + 1, self.y),
            Down => Self::new(self.x, self.y + 1),
            Left => Self::new(self.x - 1, self.y),
        }
    }
}

#[derive(Debug, PartialEq)]
struct Blizzard {
    position: Position,
    direction: Direction,
}

impl Blizzard {
    fn new(position: Position, direction: Direction) -> Self {
        Self {
            position,
            direction,
        }
    }
}

#[derive(Debug, PartialEq)]
struct Valley {
    blizzard_list: Vec<Blizzard>,
    potential_expedition_positions: HashSet<Position>,
    start_position: Position,
    target_position: Position,
    bottom_right_corner: Position,
    minutes_since_start: u32,
}

impl Valley {
    fn from_input(input: &str) -> Self {
        let mut blizzard_list = Vec::new();
        let mut target_position = Position::new(0, 0);
        let mut bottom_right_corner = Position::new(0, 0);
        for (line, y) in input.lines().zip(0..) {
            for (char, x) in line.chars().zip(0..) {
                match char {
                    '^' => blizzard_list.push(Blizzard::new(Position::new(x, y), Up)),
                    '>' => blizzard_list.push(Blizzard::new(Position::new(x, y), Right)),
                    'v' => blizzard_list.push(Blizzard::new(Position::new(x, y), Down)),
                    '<' => blizzard_list.push(Blizzard::new(Position::new(x, y), Left)),
                    '.' => target_position = Position::new(x, y), // target is the last . in the input
                    '#' => bottom_right_corner = Position::new(x, y), // bottom right corner will be processed last
                    _ => panic!("unexpected symbol {char}"),
                }
            }
        }
        let start_position = Position::new(1, 0);
        Self {
            blizzard_list,
            potential_expedition_positions: HashSet::from([start_position]),
            start_position,
            target_position,
            bottom_right_corner,
            minutes_since_start: 0,
        }
    }

    fn get_current_blizzard_positions(&self) -> HashSet<Position> {
        HashSet::from_iter(self.blizzard_list.iter().map(|blizzard| blizzard.position))
    }

    fn simulate_step(&mut self) {
        for blizzard in &mut self.blizzard_list {
            blizzard.position = blizzard.position.neighbor(&blizzard.direction);
            if blizzard.position.x < 1 {
                blizzard.position.x = self.bottom_right_corner.x - 1
            }
            if blizzard.position.x > self.bottom_right_corner.x - 1 {
                blizzard.position.x = 1
            }
            if blizzard.position.y < 1 {
                blizzard.position.y = self.bottom_right_corner.y - 1
            }
            if blizzard.position.y > self.bottom_right_corner.y - 1 {
                blizzard.position.y = 1
            }
        }
        let blizzard_positions = self.get_current_blizzard_positions();
        self.potential_expedition_positions = self
            .potential_expedition_positions
            .iter()
            .flat_map(|pos| {
                [
                    *pos, // wait
                    pos.neighbor(&Up),
                    pos.neighbor(&Right),
                    pos.neighbor(&Down),
                    pos.neighbor(&Left),
                ]
            })
            .filter(|pos| {
                (pos == &self.target_position || pos == &self.start_position)
                    || !blizzard_positions.contains(pos)
                        && (pos.x > 0 && pos.x < self.bottom_right_corner.x)
                        && (pos.y > 0 && pos.y < self.bottom_right_corner.y)
            })
            .collect();

        self.minutes_since_start += 1;
        // println!(
        //     "{} potential positions after {} minutes",
        //     self.potential_expedition_positions.len(),
        //     self.minutes_since_start,
        // );
    }

    fn get_minutes_until_target(&mut self) -> u32 {
        while !self
            .potential_expedition_positions
            .contains(&self.target_position)
        {
            self.simulate_step();
            if self.potential_expedition_positions.is_empty() {
                panic!("no more positions to explore");
            }
        }
        self.minutes_since_start
    }
}

fn part1(input: &str) -> u32 {
    Valley::from_input(input).get_minutes_until_target()
}

fn part2(input: &str) -> u32 {
    let mut valley = Valley::from_input(input);
    let start = valley.start_position;
    let target = valley.target_position;

    // go to exit
    valley.get_minutes_until_target();

    // go back to start
    valley.start_position = target;
    valley.target_position = start;
    valley.potential_expedition_positions = HashSet::from([target]);
    valley.get_minutes_until_target();

    // and to the exit again
    valley.start_position = start;
    valley.target_position = target;
    valley.potential_expedition_positions = HashSet::from([start]);
    valley.get_minutes_until_target()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 24))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 24))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT_SIMPLE: &str = "
#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#
";

    const EXAMPLE_INPUT_COMPLEX: &str = "
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
";

    #[test]
    fn test_parse_input() {
        assert_eq!(
            Valley::from_input(EXAMPLE_INPUT_SIMPLE.trim()),
            Valley {
                blizzard_list: vec![
                    Blizzard::new(Position::new(1, 2), Right),
                    Blizzard::new(Position::new(4, 4), Down),
                ],
                potential_expedition_positions: HashSet::from([Position::new(1, 0)]),
                start_position: Position::new(1, 0),
                target_position: Position::new(5, 6),
                bottom_right_corner: Position::new(6, 6),
                minutes_since_start: 0,
            }
        );
        assert_eq!(
            Valley::from_input(EXAMPLE_INPUT_COMPLEX.trim()),
            Valley {
                blizzard_list: vec![
                    Blizzard::new(Position::new(1, 1), Right),
                    Blizzard::new(Position::new(2, 1), Right),
                    Blizzard::new(Position::new(4, 1), Left),
                    Blizzard::new(Position::new(5, 1), Up),
                    Blizzard::new(Position::new(6, 1), Left),
                    Blizzard::new(Position::new(2, 2), Left),
                    Blizzard::new(Position::new(5, 2), Left),
                    Blizzard::new(Position::new(6, 2), Left),
                    Blizzard::new(Position::new(1, 3), Right),
                    Blizzard::new(Position::new(2, 3), Down),
                    Blizzard::new(Position::new(4, 3), Right),
                    Blizzard::new(Position::new(5, 3), Left),
                    Blizzard::new(Position::new(6, 3), Right),
                    Blizzard::new(Position::new(1, 4), Left),
                    Blizzard::new(Position::new(2, 4), Up),
                    Blizzard::new(Position::new(3, 4), Down),
                    Blizzard::new(Position::new(4, 4), Up),
                    Blizzard::new(Position::new(5, 4), Up),
                    Blizzard::new(Position::new(6, 4), Right),
                ],
                potential_expedition_positions: HashSet::from([Position::new(1, 0)]),
                start_position: Position::new(1, 0),
                target_position: Position::new(6, 5),
                bottom_right_corner: Position::new(7, 5),
                minutes_since_start: 0,
            }
        );
    }

    #[test]
    fn test_simulate_step() {
        let mut valley = Valley::from_input(EXAMPLE_INPUT_SIMPLE.trim());

        assert_eq!(
            valley.blizzard_list,
            vec![
                Blizzard::new(Position::new(1, 2), Right),
                Blizzard::new(Position::new(4, 4), Down),
            ]
        );

        valley.simulate_step();
        assert_eq!(
            valley.blizzard_list,
            vec![
                Blizzard::new(Position::new(2, 2), Right),
                Blizzard::new(Position::new(4, 5), Down),
            ]
        );

        valley.simulate_step();
        assert_eq!(
            valley.blizzard_list,
            vec![
                Blizzard::new(Position::new(3, 2), Right),
                Blizzard::new(Position::new(4, 1), Down),
            ]
        );

        valley.simulate_step();
        assert_eq!(
            valley.blizzard_list,
            vec![
                Blizzard::new(Position::new(4, 2), Right),
                Blizzard::new(Position::new(4, 2), Down),
            ]
        );

        valley.simulate_step();
        assert_eq!(
            valley.blizzard_list,
            vec![
                Blizzard::new(Position::new(5, 2), Right),
                Blizzard::new(Position::new(4, 3), Down),
            ]
        );

        valley.simulate_step();
        assert_eq!(
            valley.blizzard_list,
            vec![
                Blizzard::new(Position::new(1, 2), Right),
                Blizzard::new(Position::new(4, 4), Down),
            ]
        );
    }

    #[test]
    fn test_simulate_step_complex() {
        let mut valley = Valley::from_input(EXAMPLE_INPUT_COMPLEX.trim());

        // Initial state
        assert!(valley
            .potential_expedition_positions
            .contains(&Position::new(1, 0)));

        // after 1 minute
        valley.simulate_step();
        assert!(valley
            .potential_expedition_positions
            .contains(&Position::new(1, 1)));
        assert_eq!(
            valley.blizzard_list,
            vec![
                Blizzard::new(Position::new(2, 1), Right),
                Blizzard::new(Position::new(3, 1), Right),
                Blizzard::new(Position::new(3, 1), Left),
                Blizzard::new(Position::new(5, 4), Up),
                Blizzard::new(Position::new(5, 1), Left),
                Blizzard::new(Position::new(1, 2), Left),
                Blizzard::new(Position::new(4, 2), Left),
                Blizzard::new(Position::new(5, 2), Left),
                Blizzard::new(Position::new(2, 3), Right),
                Blizzard::new(Position::new(2, 4), Down),
                Blizzard::new(Position::new(5, 3), Right),
                Blizzard::new(Position::new(4, 3), Left),
                Blizzard::new(Position::new(1, 3), Right),
                Blizzard::new(Position::new(6, 4), Left),
                Blizzard::new(Position::new(2, 3), Up),
                Blizzard::new(Position::new(3, 1), Down),
                Blizzard::new(Position::new(4, 3), Up),
                Blizzard::new(Position::new(5, 3), Up),
                Blizzard::new(Position::new(1, 4), Right),
            ]
        );

        // after 2 minutes
        valley.simulate_step();
        assert!(valley
            .potential_expedition_positions
            .contains(&Position::new(1, 2)));

        // after 3 minutes
        valley.simulate_step();
        assert!(valley
            .potential_expedition_positions
            .contains(&Position::new(1, 2)));

        // after 4 minutes
        valley.simulate_step();
        assert!(valley
            .potential_expedition_positions
            .contains(&Position::new(1, 1)));
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT_COMPLEX.trim()), 18);
        assert_eq!(part2(EXAMPLE_INPUT_COMPLEX.trim()), 54);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 292);
        assert_eq!(solution2(), 816);
    }
}
