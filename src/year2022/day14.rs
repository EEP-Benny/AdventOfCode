use std::{collections::HashMap, hash::Hash, ops::Add};

use crate::utils::{get_input, Splittable};

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
struct Position {
    x: i32,
    y: i32,
}

impl Position {
    fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }
    fn from_string(string: &str) -> Option<Self> {
        let (x_string, y_string) = string.split_once(',')?;
        Some(Self {
            x: x_string.parse().ok()?,
            y: y_string.parse().ok()?,
        })
    }
}

impl Add<Position> for Position {
    fn add(self, rhs: Position) -> Self::Output {
        Position {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }

    type Output = Position;
}

const DOWN: Position = Position { x: 0, y: 1 };
const DOWN_LEFT: Position = Position { x: -1, y: 1 };
const DOWN_RIGHT: Position = Position { x: 1, y: 1 };

#[derive(Debug, PartialEq)]
enum StoneOrSand {
    Stone,
    Sand,
}

#[derive(Debug, PartialEq)]
struct Cave {
    grid: HashMap<Position, StoneOrSand>,
    deepest_stone: i32,
}

impl Cave {
    fn from_input(input: &str) -> Self {
        let mut grid: HashMap<Position, StoneOrSand> = HashMap::new();

        for line in input.lines() {
            let positions = line.split_and_map(" -> ", |string_pos| {
                Position::from_string(string_pos).expect("Should be parsable as a position")
            });
            grid.insert(positions[0], StoneOrSand::Stone);
            for i in 1..positions.len() {
                let current_position = positions[i];
                let last_position = positions[i - 1];
                let mut x_coordinates = [last_position.x, current_position.x];
                let mut y_coordinates = [last_position.y, current_position.y];
                x_coordinates.sort();
                y_coordinates.sort();
                for x in x_coordinates[0]..=x_coordinates[1] {
                    for y in y_coordinates[0]..=y_coordinates[1] {
                        grid.insert(Position::new(x, y), StoneOrSand::Stone);
                    }
                }
            }
        }

        Cave {
            deepest_stone: grid.keys().map(|pos| pos.y).max().unwrap(),
            grid,
        }
    }

    fn place_sand(&mut self) -> Result<Position, Position> {
        let mut pos = Position::new(500, 0);
        loop {
            match [DOWN, DOWN_LEFT, DOWN_RIGHT].iter().find_map(|&direction| {
                let next_position = pos + direction;
                (!self.grid.contains_key(&next_position)).then_some(next_position)
            }) {
                Some(next_position) => {
                    // go to next position
                    pos = next_position;
                }
                None => {
                    // let sand settle here
                    self.grid.insert(pos, StoneOrSand::Sand);
                    return Ok(pos);
                }
            };
            if pos.y > self.deepest_stone {
                // sand fell through
                return Err(pos);
            }
        }
    }
}

fn part1(input: &str) -> u32 {
    let mut cave = Cave::from_input(input);
    let mut sand_counter = 0;
    while cave.place_sand().is_ok() {
        sand_counter += 1;
    }
    sand_counter
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 14))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
";
    const EXAMPLE_INPUT_REVERSED: &str = "
496,6 -> 498,6 -> 498,4
494,9 -> 502,9 -> 502,4 -> 503,4
";

    #[test]
    fn test_parse_input() {
        let cave = Cave::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(
            cave.grid,
            HashMap::from([
                // first line of stone
                (Position::new(498, 4), StoneOrSand::Stone),
                (Position::new(498, 5), StoneOrSand::Stone),
                (Position::new(498, 6), StoneOrSand::Stone),
                (Position::new(497, 6), StoneOrSand::Stone),
                (Position::new(496, 6), StoneOrSand::Stone),
                // second line of stone
                (Position::new(503, 4), StoneOrSand::Stone),
                (Position::new(502, 4), StoneOrSand::Stone),
                (Position::new(502, 5), StoneOrSand::Stone),
                (Position::new(502, 6), StoneOrSand::Stone),
                (Position::new(502, 7), StoneOrSand::Stone),
                (Position::new(502, 8), StoneOrSand::Stone),
                (Position::new(502, 9), StoneOrSand::Stone),
                (Position::new(501, 9), StoneOrSand::Stone),
                (Position::new(500, 9), StoneOrSand::Stone),
                (Position::new(499, 9), StoneOrSand::Stone),
                (Position::new(498, 9), StoneOrSand::Stone),
                (Position::new(497, 9), StoneOrSand::Stone),
                (Position::new(496, 9), StoneOrSand::Stone),
                (Position::new(495, 9), StoneOrSand::Stone),
                (Position::new(494, 9), StoneOrSand::Stone),
            ])
        );
        assert_eq!(
            Cave::from_input(EXAMPLE_INPUT.trim()),
            Cave::from_input(EXAMPLE_INPUT_REVERSED.trim())
        );
    }

    #[test]
    fn test_place_sand() {
        let mut cave = Cave::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(cave.place_sand(), Ok(Position::new(500, 8)));
        assert_eq!(cave.place_sand(), Ok(Position::new(499, 8)));
        assert_eq!(cave.place_sand(), Ok(Position::new(501, 8)));
        assert_eq!(cave.place_sand(), Ok(Position::new(500, 7)));
        assert_eq!(cave.place_sand(), Ok(Position::new(498, 8)));
        for _ in 5..22 {
            cave.place_sand().unwrap();
        }
        assert_eq!(cave.place_sand(), Ok(Position::new(497, 5)));
        assert_eq!(cave.place_sand(), Ok(Position::new(495, 8)));
        assert_eq!(cave.place_sand(), Err(Position::new(493, 10)));
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 24);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 719);
    }
}
