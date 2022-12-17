use crate::utils::get_input;
use lazy_static::lazy_static;
use std::{collections::HashSet, hash::Hash, iter::Cycle, ops::Add};

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
struct Position {
    x: i32,
    y: i32,
}

impl Position {
    fn new(x: i32, y: i32) -> Self {
        Self { x, y }
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

impl Add<&Position> for &Position {
    fn add(self, rhs: &Position) -> Self::Output {
        Position {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }

    type Output = Position;
}

#[derive(Debug, PartialEq, Clone)]
enum JetDirection {
    Left,
    Right,
}

fn parse_jet_directions(input: &str) -> Vec<JetDirection> {
    input
        .chars()
        .map(|char| match char {
            '<' => JetDirection::Left,
            '>' => JetDirection::Right,
            _ => panic!("Unknown jet direction {char}"),
        })
        .collect()
}

#[derive(Debug, PartialEq)]
struct Rock {
    coordinates: Vec<Position>,
    width: u32,
}

impl Rock {
    fn new(coordinates: Vec<Position>) -> Self {
        let width = coordinates
            .iter()
            .map(|position| position.x as u32)
            .max()
            .unwrap()
            + 1;
        Self { coordinates, width }
    }
}

lazy_static! {
    static ref ROCKS: Vec<Rock> = vec![
        Rock::new(vec![
            Position::new(0, 0),
            Position::new(1, 0),
            Position::new(2, 0),
            Position::new(3, 0)
        ]),
        Rock::new(vec![
            Position::new(1, 0),
            Position::new(0, 1),
            Position::new(1, 1),
            Position::new(2, 1),
            Position::new(1, 2)
        ]),
        Rock::new(vec![
            Position::new(0, 0),
            Position::new(1, 0),
            Position::new(2, 0),
            Position::new(2, 1),
            Position::new(2, 2)
        ]),
        Rock::new(vec![
            Position::new(0, 0),
            Position::new(0, 1),
            Position::new(0, 2),
            Position::new(0, 3)
        ]),
        Rock::new(vec![
            Position::new(0, 0),
            Position::new(1, 0),
            Position::new(0, 1),
            Position::new(1, 1)
        ]),
    ];
}

#[derive(Debug)]
struct Cave<'a> {
    occupied_positions: HashSet<Position>,
    current_height: u32,
    jet_direction_iterator: Cycle<std::vec::IntoIter<JetDirection>>,
    rock_iterator: Cycle<std::slice::Iter<'a, Rock>>,
}

impl Cave<'_> {
    fn new(input: &str) -> Self {
        Self {
            occupied_positions: HashSet::new(),
            current_height: 0,
            jet_direction_iterator: parse_jet_directions(input).into_iter().cycle(),
            rock_iterator: ROCKS.iter().cycle(),
        }
    }

    fn put_rock_at_position(&mut self, rock: &Rock, position: &Position) {
        for offset in &rock.coordinates {
            let piece_position = position + offset;
            self.current_height = self.current_height.max(piece_position.y as u32 + 1);
            self.occupied_positions.insert(piece_position);
        }
    }

    fn is_occupied(&self, position: &Position) -> bool {
        self.occupied_positions.contains(position)
    }

    fn does_rock_fit_in_position(&self, rock: &Rock, position: &Position) -> bool {
        if position.y < 0 || position.x < 0 || position.x as u32 + rock.width > 7 {
            // rock hits wall or floor
            return false;
        }
        for offset in &rock.coordinates {
            if self.is_occupied(&(position + offset)) {
                return false;
            }
        }
        true
    }

    fn place_next_rock(&mut self) {
        let rock = self.rock_iterator.next().unwrap();
        let mut position = Position::new(2, self.current_height as i32 + 3);
        // println!("Rock {rock:?} starts at position {position:?}");
        loop {
            // apply jet
            let jet_direction = self.jet_direction_iterator.next().unwrap();
            let new_position = position
                + match jet_direction {
                    JetDirection::Left => Position::new(-1, 0),
                    JetDirection::Right => Position::new(1, 0),
                };
            if self.does_rock_fit_in_position(rock, &new_position) {
                // println!("Successfully pushed {jet_direction:?}");
                position = new_position;
            }

            // apply gravity
            let new_position = position + Position::new(0, -1);
            if self.does_rock_fit_in_position(rock, &new_position) {
                // println!("Rock falls down");
                position = new_position;
            } else {
                // println!("Placed rock at position {position:?}");
                self.put_rock_at_position(rock, &position);
                return;
            }
        }
    }
}

fn part1(input: &str) -> u32 {
    let mut cave = Cave::new(input);
    for _ in 0..2022 {
        cave.place_next_rock();
    }
    cave.current_height
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 17))
}

#[cfg(test)]
mod tests {

    use super::*;

    const EXAMPLE_INPUT: &str = ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>";

    #[test]
    fn test_parse_jet_directions() {
        assert_eq!(
            parse_jet_directions(EXAMPLE_INPUT)[..6],
            [
                JetDirection::Right,
                JetDirection::Right,
                JetDirection::Right,
                JetDirection::Left,
                JetDirection::Left,
                JetDirection::Right,
            ]
        );
    }

    #[test]
    fn test_place_next_rock() {
        let mut cave = Cave::new(EXAMPLE_INPUT);
        cave.place_next_rock();
        assert_eq!(cave.current_height, 1);
        assert_eq!(
            cave.occupied_positions,
            HashSet::from([
                Position::new(2, 0),
                Position::new(3, 0),
                Position::new(4, 0),
                Position::new(5, 0),
            ])
        )
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 3068);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 3200);
    }
}
