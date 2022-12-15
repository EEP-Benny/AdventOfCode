use crate::utils::get_input;
use lazy_static::lazy_static;
use regex::Regex;
use std::{
    collections::HashSet,
    hash::Hash,
    ops::{Add, RangeInclusive},
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

    fn manhattan_distance(&self, other: &Self) -> u32 {
        self.x.abs_diff(other.x) + self.y.abs_diff(other.y)
    }
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

#[derive(Debug, PartialEq)]
struct Sensor {
    position: Position,
    position_of_nearest_beacon: Position,
}

impl Sensor {
    fn from_string(input: &str) -> Option<Self> {
        lazy_static! {
            static ref RE: Regex = Regex::new(
                r"^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$"
            )
            .unwrap();
        }
        let captures: Vec<i32> = RE
            .captures(input)?
            .iter()
            .skip(1) // first capture is the full match
            .filter_map(|capture| capture?.as_str().parse().ok())
            .collect();
        Some(Self {
            position: Position::new(captures[0], captures[1]),
            position_of_nearest_beacon: Position::new(captures[2], captures[3]),
        })
    }
    fn covered_positions_at_line(&self, y: i32) -> RangeInclusive<i32> {
        let distance_to_beacon =
            self.position
                .manhattan_distance(&self.position_of_nearest_beacon) as i32;
        let y_diff = self.position.y.abs_diff(y) as i32;
        let x = self.position.x;
        let remaining_width = distance_to_beacon - y_diff;

        (x - remaining_width)..=(x + remaining_width)
    }
}

struct CaveSystem(Vec<Sensor>);

impl CaveSystem {
    fn from_input(input: &str) -> Self {
        CaveSystem(input.lines().filter_map(Sensor::from_string).collect())
    }

    fn count_covered_positions_at_line(&self, y: i32) -> u32 {
        let mut covered_positions = HashSet::<i32>::new();
        for sensor in &self.0 {
            for pos_x in sensor.covered_positions_at_line(y) {
                covered_positions.insert(pos_x);
            }
        }
        for sensor in &self.0 {
            if sensor.position_of_nearest_beacon.y == y {
                covered_positions.remove(&sensor.position_of_nearest_beacon.x);
            }
        }

        covered_positions.len() as u32
    }

    fn find_distress_beacon(&self, min: i32, max: i32) -> Option<Position> {
        for y in min..=max {
            let mut x = min;
            'iterations: loop {
                if x > max {
                    break;
                }
                for sensor in &self.0 {
                    let covered_positions = sensor.covered_positions_at_line(y);
                    if covered_positions.contains(&x) {
                        x = *covered_positions.end() + 1;
                        continue 'iterations;
                    }
                }
                // we found a place that wasn't covered
                return Some(Position::new(x, y));
            }
        }
        None
    }

    fn find_tuning_frequency(&self, range: RangeInclusive<i32>) -> u64 {
        let beacon_position = self
            .find_distress_beacon(*range.start(), *range.end())
            .expect("There should be a distress beacon");

        beacon_position.x as u64 * 4000000 + beacon_position.y as u64
    }
}

fn part1(input: &str) -> u32 {
    CaveSystem::from_input(input).count_covered_positions_at_line(2000000)
}

fn part2(input: &str) -> u64 {
    CaveSystem::from_input(input).find_tuning_frequency(0..=4000000)
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 15))
}

pub fn solution2() -> u64 {
    part2(&get_input(2022, 15))
}

#[cfg(test)]
mod tests {
    use std::time::Instant;

    use super::*;

    const EXAMPLE_INPUT: &str = "
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
";

    #[test]
    fn test_sensor_from_string() {
        assert_eq!(
            Sensor::from_string("Sensor at x=2, y=18: closest beacon is at x=-2, y=15"),
            Some(Sensor {
                position: Position::new(2, 18),
                position_of_nearest_beacon: Position::new(-2, 15)
            })
        );
        assert_eq!(
            Sensor::from_string(
                "Sensor at x=98246, y=1908027: closest beacon is at x=1076513, y=2000000"
            ),
            Some(Sensor {
                position: Position::new(98246, 1908027),
                position_of_nearest_beacon: Position::new(1076513, 2000000)
            })
        );
    }

    #[test]
    fn test_covered_in_line() {
        let sensor =
            Sensor::from_string("Sensor at x=8, y=7: closest beacon is at x=2, y=10").unwrap();
        assert_eq!(sensor.covered_positions_at_line(1), 5..=11);
        assert_eq!(sensor.covered_positions_at_line(7), -1..=17);
        assert_eq!(sensor.covered_positions_at_line(16), 8..=8);
        assert_eq!(sensor.covered_positions_at_line(17), 9..=7);
    }

    #[test]
    fn test_cave_system_from_input() {
        let cave_system = CaveSystem::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(cave_system.0.len(), 14);
    }

    #[test]
    fn test_count_covered_positions_at_line() {
        let cave_system = CaveSystem::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(cave_system.count_covered_positions_at_line(10), 26);
    }

    #[test]
    fn test_find_distress_beacon() {
        let cave_system = CaveSystem::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(
            cave_system.find_distress_beacon(0, 20),
            Some(Position::new(14, 11))
        );
    }

    #[test]
    fn test_find_tuning_frequency() {
        let cave_system = CaveSystem::from_input(EXAMPLE_INPUT.trim());
        assert_eq!(cave_system.find_tuning_frequency(0..=20), 56000011);
    }

    #[test]
    fn test_solutions() {
        let start = Instant::now();
        assert_eq!(solution1(), 5125700);
        let duration1 = start.elapsed();
        assert_eq!(solution2(), 11379394658764);
        let duration2 = start.elapsed() - duration1;
        println!(
            "Part 1 took {}ms, Part 2 took {}ms",
            duration1.as_millis(),
            duration2.as_millis(),
        );
    }
}
