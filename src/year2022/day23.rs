use std::collections::{HashMap, HashSet};

use crate::utils::get_input;

#[derive(Debug, PartialEq)]
enum Direction {
    North,
    NorthEast,
    East,
    SouthEast,
    South,
    SouthWest,
    West,
    NorthWest,
}
use Direction::*;

const DIRECTIONS_TO_CONSIDER: [Direction; 4] = [North, South, West, East];
const ALL_DIRECTIONS: [Direction; 8] = [
    North, NorthEast, East, SouthEast, South, SouthWest, West, NorthWest,
];

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
            North => Self::new(self.x, self.y - 1),
            NorthEast => Self::new(self.x + 1, self.y - 1),
            East => Self::new(self.x + 1, self.y),
            SouthEast => Self::new(self.x + 1, self.y + 1),
            South => Self::new(self.x, self.y + 1),
            SouthWest => Self::new(self.x - 1, self.y + 1),
            West => Self::new(self.x - 1, self.y),
            NorthWest => Self::new(self.x - 1, self.y - 1),
        }
    }
}

struct BoundingBox {
    min_x: i32,
    max_x: i32,
    min_y: i32,
    max_y: i32,
}

impl BoundingBox {
    fn new(min_x: i32, max_x: i32, min_y: i32, max_y: i32) -> Self {
        Self {
            min_x,
            max_x,
            min_y,
            max_y,
        }
    }
}

#[derive(Debug, PartialEq)]
struct Simulation {
    elf_positions_as_vec: Vec<Position>,
    elf_positions_as_set: HashSet<Position>,
    current_round: u32,
}

impl Simulation {
    fn from_input(input: &str) -> Self {
        let mut elf_positions_as_vec = Vec::new();
        let mut elf_positions_as_set = HashSet::new();
        for (line, y) in input.lines().zip(0..) {
            for (char, x) in line.chars().zip(0..) {
                if char == '#' {
                    let position = Position::new(x, y);
                    elf_positions_as_vec.push(position);
                    elf_positions_as_set.insert(position);
                }
            }
        }

        Self {
            elf_positions_as_vec,
            elf_positions_as_set,
            current_round: 0,
        }
    }

    fn simulate_step(&mut self) -> bool {
        // first half: all elves consider where to move
        let considered_elf_positions_as_vec: Vec<_> = self
            .elf_positions_as_vec
            .iter()
            .map(|pos| {
                if !self.has_any_elves_in_direction(pos, &ALL_DIRECTIONS) {
                    return None;
                };
                for i in self.current_round..self.current_round + 4 {
                    let direction_to_consider = &DIRECTIONS_TO_CONSIDER[i as usize % 4];
                    match direction_to_consider {
                        North => {
                            if !self.has_any_elves_in_direction(pos, &[North, NorthEast, NorthWest])
                            {
                                return Some(pos.neighbor(&North));
                            }
                        }
                        South => {
                            if !self.has_any_elves_in_direction(pos, &[South, SouthEast, SouthWest])
                            {
                                return Some(pos.neighbor(&South));
                            }
                        }
                        West => {
                            if !self.has_any_elves_in_direction(pos, &[West, NorthWest, SouthWest])
                            {
                                return Some(pos.neighbor(&West));
                            }
                        }
                        East => {
                            if !self.has_any_elves_in_direction(pos, &[East, NorthEast, SouthEast])
                            {
                                return Some(pos.neighbor(&East));
                            }
                        }
                        _ => {
                            panic!("Shouldn't have to look at direction {direction_to_consider:?}")
                        }
                    }
                }
                None
            })
            .collect();

        let mut consideration_counter_per_position: HashMap<Position, u32> = HashMap::new();
        for &maybe_considered_position in &considered_elf_positions_as_vec {
            if let Some(pos) = maybe_considered_position {
                consideration_counter_per_position
                    .entry(pos)
                    .and_modify(|c| *c += 1)
                    .or_insert(1);
            }
        }

        // second half: elves do move if there is no conflict
        let mut new_elf_positions_as_vec = Vec::with_capacity(self.elf_positions_as_vec.len());
        let mut new_elf_positions_as_set = HashSet::with_capacity(self.elf_positions_as_set.len());
        let mut some_elf_has_moved = false;

        for (&old_pos, maybe_considered_pos) in self
            .elf_positions_as_vec
            .iter()
            .zip(considered_elf_positions_as_vec.iter())
        {
            let mut new_pos = old_pos;
            if let Some(considered_pos) = maybe_considered_pos {
                if consideration_counter_per_position.get(considered_pos) == Some(&1) {
                    new_pos = *considered_pos;
                    some_elf_has_moved = true;
                }
            }
            new_elf_positions_as_vec.push(new_pos);
            new_elf_positions_as_set.insert(new_pos);
        }

        self.elf_positions_as_vec = new_elf_positions_as_vec;
        self.elf_positions_as_set = new_elf_positions_as_set;
        self.current_round += 1;

        some_elf_has_moved
    }

    fn simulate_until_round(&mut self, round_number: u32) {
        while self.current_round < round_number {
            self.simulate_step();
        }
    }

    fn has_any_elves_in_direction(&self, pos: &Position, directions: &[Direction]) -> bool {
        directions
            .iter()
            .any(|dir| self.elf_positions_as_set.contains(&pos.neighbor(dir)))
    }

    fn get_bounding_box(&self) -> BoundingBox {
        let positions = &self.elf_positions_as_vec;
        BoundingBox {
            min_x: positions.iter().map(|pos| pos.x).min().unwrap(),
            max_x: positions.iter().map(|pos| pos.x).max().unwrap(),
            min_y: positions.iter().map(|pos| pos.y).min().unwrap(),
            max_y: positions.iter().map(|pos| pos.y).max().unwrap(),
        }
    }

    fn count_empty_ground_tiles(&self, bb: &BoundingBox) -> u32 {
        let mut count = 0;
        for y in bb.min_y..=bb.max_y {
            for x in bb.min_x..=bb.max_x {
                if !self.elf_positions_as_set.contains(&Position::new(x, y)) {
                    count += 1;
                }
            }
        }
        count
    }

    fn to_string(&self, bb: &BoundingBox) -> String {
        (bb.min_y..=bb.max_y)
            .map(|y| {
                (bb.min_x..=bb.max_x)
                    .map(|x| {
                        if self.elf_positions_as_set.contains(&Position { x, y }) {
                            "#"
                        } else {
                            "."
                        }
                    })
                    .collect()
            })
            .collect::<Vec<String>>()
            .join("\n")
    }
}

fn part1(input: &str) -> u32 {
    let mut simulation = Simulation::from_input(input);
    simulation.simulate_until_round(10);
    simulation.count_empty_ground_tiles(&simulation.get_bounding_box())
}

fn part2(input: &str) -> u32 {
    0
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 23))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 23))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
";

    #[test]
    fn test_parse_input() {
        let simulation = Simulation::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(simulation.elf_positions_as_vec.len(), 22);
        assert_eq!(simulation.elf_positions_as_set.len(), 22);
    }

    #[test]
    fn test_single_step() {
        let bounding_box = BoundingBox::new(-3, 10, -2, 9);
        let mut simulation = Simulation::from_input(EXAMPLE_INPUT.trim());

        assert_eq!(
            // initial state
            simulation.to_string(&bounding_box),
            "
..............
..............
.......#......
.....###.#....
...#...#.#....
....#...##....
...#.###......
...##.#.##....
....#..#......
..............
..............
..............
"
            .trim()
        );

        simulation.simulate_step();
        assert_eq!(
            // after round 1
            simulation.to_string(&bounding_box),
            "
..............
.......#......
.....#...#....
...#..#.#.....
.......#..#...
....#.#.##....
..#..#.#......
..#.#.#.##....
..............
....#..#......
..............
..............
"
            .trim()
        );

        simulation.simulate_until_round(10);
        assert_eq!(
            // after round 10
            simulation.to_string(&bounding_box),
            "
.......#......
...........#..
..#.#..#......
......#.......
...#.....#..#.
.#......##....
.....##.......
..#........#..
....#.#..#....
..............
....#..#..#...
..............
"
            .trim()
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 110);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 0);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 3987);
        assert_eq!(solution2(), 0);
    }
}
