use std::{collections::HashSet, iter::repeat};

use crate::utils::get_input;

type Position = (i32, i32);

const LEFT: Position = (-1, 0);
const RIGHT: Position = (1, 0);
const UP: Position = (0, 1);
const DOWN: Position = (0, -1);

#[derive(Debug, PartialEq)]
struct Rope {
    head: Position,
    tail: Position,
    positions_visited_by_tail: HashSet<Position>,
}

impl Rope {
    fn new() -> Self {
        Self {
            head: (0, 0),
            tail: (0, 0),
            positions_visited_by_tail: HashSet::new(),
        }
    }
    fn simulate_step(&mut self, direction: Position) {
        self.head.0 += direction.0;
        self.head.1 += direction.1;
        if self.tail.0 < self.head.0 - 1 {
            self.tail = (self.head.0 - 1, self.head.1)
        } else if self.tail.0 > self.head.0 + 1 {
            self.tail = (self.head.0 + 1, self.head.1)
        } else if self.tail.1 < self.head.1 - 1 {
            self.tail = (self.head.0, self.head.1 - 1)
        } else if self.tail.1 > self.head.1 + 1 {
            self.tail = (self.head.0, self.head.1 + 1)
        }
        self.positions_visited_by_tail.insert(self.tail);
    }

    fn simulate_steps(&mut self, directions: Vec<Position>) {
        for direction in directions {
            self.simulate_step(direction)
        }
    }
}

fn parse_input(input: &str) -> Vec<Position> {
    input
        .lines()
        .flat_map(|line| {
            let (dir_string, num_string) = line.split_at(2);
            let direction = match dir_string {
                "L " => LEFT,
                "R " => RIGHT,
                "U " => UP,
                "D " => DOWN,
                dir => panic!("unknown direction {dir}"),
            };
            let number = num_string.parse().expect("Should be a number");
            repeat(direction).take(number)
        })
        .collect()
}

fn part1(input: &str) -> u32 {
    let mut rope = Rope::new();
    rope.simulate_steps(parse_input(input));
    rope.positions_visited_by_tail.len() as u32
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 09))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
";

    #[test]
    fn test_parse_input() {
        assert_eq!(
            parse_input(EXAMPLE_INPUT.trim()),
            vec![
                RIGHT, RIGHT, RIGHT, RIGHT, //  R 4
                UP, UP, UP, UP, //              U 4
                LEFT, LEFT, LEFT, //            L 3
                DOWN, //                        D 1
                RIGHT, RIGHT, RIGHT, RIGHT, //  R 4
                DOWN,  //                       D 1
                LEFT, LEFT, LEFT, LEFT, LEFT, //L 5
                RIGHT, RIGHT //                 R 2
            ]
        )
    }

    #[test]
    fn test_simulate_step() {
        let mut rope = Rope::new();
        rope.simulate_step(RIGHT);
        assert_eq!([rope.head, rope.tail], [(1, 0), (0, 0)]);
        rope.simulate_step(RIGHT);
        assert_eq!([rope.head, rope.tail], [(2, 0), (1, 0)]);
        rope.simulate_step(UP);
        assert_eq!([rope.head, rope.tail], [(2, 1), (1, 0)]);
        rope.simulate_step(UP);
        assert_eq!([rope.head, rope.tail], [(2, 2), (2, 1)]);
        rope.simulate_step(LEFT);
        assert_eq!([rope.head, rope.tail], [(1, 2), (2, 1)]);
        rope.simulate_step(LEFT);
        assert_eq!([rope.head, rope.tail], [(0, 2), (1, 2)]);
        rope.simulate_step(DOWN);
        assert_eq!([rope.head, rope.tail], [(0, 1), (1, 2)]);
        rope.simulate_step(RIGHT);
        assert_eq!([rope.head, rope.tail], [(1, 1), (1, 2)]);
        rope.simulate_step(RIGHT);
        assert_eq!([rope.head, rope.tail], [(2, 1), (1, 2)]);
        rope.simulate_step(RIGHT);
        assert_eq!([rope.head, rope.tail], [(3, 1), (2, 1)]);
    }

    #[test]
    fn test_simulate_steps() {
        let mut rope = Rope::new();
        rope.simulate_steps(parse_input(EXAMPLE_INPUT.trim()));
        assert_eq!(
            rope,
            Rope {
                head: (2, 2),
                tail: (1, 2),
                positions_visited_by_tail: HashSet::from([
                    (0, 0),
                    (1, 0),
                    (2, 0),
                    (3, 0),
                    (4, 1),
                    (4, 2),
                    (4, 3),
                    (3, 4),
                    (2, 4),
                    (3, 3),
                    (3, 2),
                    (2, 2),
                    (1, 2)
                ])
            }
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 13);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 6271);
    }
}
