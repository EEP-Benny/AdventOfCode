use crate::utils::get_input;
use lazy_static::lazy_static;
use std::{
    collections::{HashMap, HashSet},
    hash::Hash,
    iter::{Cycle, Enumerate},
    ops::Add,
};

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
    jet_direction_iterator: Cycle<Enumerate<std::vec::IntoIter<JetDirection>>>,
    rock_iterator: Cycle<Enumerate<std::slice::Iter<'a, Rock>>>,
}

impl Cave<'_> {
    fn new(input: &str) -> Self {
        Self {
            occupied_positions: HashSet::new(),
            current_height: 0,
            jet_direction_iterator: parse_jet_directions(input).into_iter().enumerate().cycle(),
            rock_iterator: ROCKS.iter().enumerate().cycle(),
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

    fn get_row_as_string(&self, y: i32) -> String {
        (1..=7)
            .into_iter()
            .map(|x| {
                if self.occupied_positions.contains(&Position::new(x, y)) {
                    '#'
                } else {
                    '.'
                }
            })
            .collect()
    }

    fn place_next_rock(&mut self) -> (usize, usize, Position) {
        let (rock_cycle_index, rock) = self.rock_iterator.next().unwrap();
        let mut position = Position::new(2, self.current_height as i32 + 3);
        // println!("Rock {rock:?} starts at position {position:?}");
        loop {
            // apply jet
            let (jet_cycle_index, jet_direction) = self.jet_direction_iterator.next().unwrap();
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
                return (rock_cycle_index, jet_cycle_index, position);
            }
        }
    }

    fn get_height_after_x_rocks(&mut self, desired_rock_count: usize) -> u64 {
        let mut observed_landing_patterns = HashMap::new(); // maps (rock_index, jet_index, x, row_pattern) to (current_rock_count, y)

        for current_rock_count in 1..=desired_rock_count {
            let (rock_index, jet_index, landing_position) = self.place_next_rock();

            if landing_position.y > 50 {
                if let Some((previous_rock_index, previous_height)) = observed_landing_patterns
                    .insert(
                        (
                            rock_index,
                            jet_index,
                            landing_position.x,
                            self.get_row_as_string(landing_position.y - 50), // the current row might fill with later rocks, so look further down
                        ),
                        (current_rock_count, landing_position.y),
                    )
                {
                    // Cycle detected!
                    let rock_count_difference = current_rock_count - previous_rock_index;
                    let height_difference = landing_position.y - previous_height;
                    let remaining_cycles =
                        (desired_rock_count - current_rock_count) / rock_count_difference;
                    let remaining_rocks_after_cycles =
                        (desired_rock_count - current_rock_count) % rock_count_difference;
                    // println!("Cycle detected for rock {current_rock_count}: {rock_count_difference} rocks result in {height_difference} rows.");
                    // println!("Remaining: {remaining_cycles} cycles plus {remaining_rocks_after_cycles} single rocks");
                    // println!("|{}|", self.get_row_as_string(landing_position.y - 50));
                    // println!("|{}|", self.get_row_as_string(previous_height - 50));
                    for _ in 1..=remaining_rocks_after_cycles {
                        self.place_next_rock();
                    }
                    return self.current_height as u64
                        + remaining_cycles as u64 * height_difference as u64;
                }
            }
        }
        self.current_height as u64
    }
}

fn part1(input: &str) -> u64 {
    Cave::new(input).get_height_after_x_rocks(2022)
}

fn part2(input: &str) -> u64 {
    Cave::new(input).get_height_after_x_rocks(1000000000000)
}

pub fn solution1() -> u64 {
    part1(&get_input(2022, 17))
}

pub fn solution2() -> u64 {
    part2(&get_input(2022, 17))
}

#[cfg(test)]
mod tests {
    use std::time::Instant;

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
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 1514285714288);
    }

    #[test]
    fn test_solutions() {
        let start = Instant::now();
        assert_eq!(solution1(), 3200);
        let duration1 = start.elapsed();
        assert_eq!(solution2(), 1584927536247);
        let duration2 = start.elapsed() - duration1;
        println!(
            "Part 1 took {}ms, Part 2 took {}ms",
            duration1.as_millis(),
            duration2.as_millis(),
        );
    }
}
