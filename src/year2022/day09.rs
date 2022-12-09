use std::{cmp::max, collections::HashSet, iter::repeat};

use crate::utils::get_input;

type Position = (i32, i32);

const LEFT: Position = (-1, 0);
const RIGHT: Position = (1, 0);
const UP: Position = (0, 1);
const DOWN: Position = (0, -1);

#[derive(Debug, PartialEq)]
struct Rope {
    knot_positions: Vec<Position>,
    positions_visited_by_tail: HashSet<Position>,
}

impl Rope {
    fn with_length(length: usize) -> Self {
        Self {
            knot_positions: [(0, 0)].repeat(length),
            positions_visited_by_tail: HashSet::new(),
        }
    }
    fn simulate_step(&mut self, direction: Position) {
        let rope_length = self.knot_positions.len();
        self.knot_positions[0].0 += direction.0;
        self.knot_positions[0].1 += direction.1;
        for i in 1..rope_length {
            let previous = self.knot_positions[i - 1];
            let current = self.knot_positions[i];
            let diff_x = previous.0 - current.0;
            let diff_y = previous.1 - current.1;

            // knot only needs to move if it is *more* than 1 away in either direction
            if max(diff_x.abs(), diff_y.abs()) > 1 {
                self.knot_positions[i].0 += diff_x.signum(); // sign of the x difference (-1, 0 or +1)
                self.knot_positions[i].1 += diff_y.signum(); // sign of the y difference (-1, 0 or +1)
            }
        }
        self.positions_visited_by_tail
            .insert(self.knot_positions[rope_length - 1]);
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
    let mut rope = Rope::with_length(2);
    rope.simulate_steps(parse_input(input));
    rope.positions_visited_by_tail.len() as u32
}

fn part2(input: &str) -> u32 {
    let mut rope = Rope::with_length(10);
    rope.simulate_steps(parse_input(input));
    rope.positions_visited_by_tail.len() as u32
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 09))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 09))
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
    const EXAMPLE_INPUT_2: &str = "
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
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
        let mut rope = Rope::with_length(2);
        rope.simulate_step(RIGHT);
        assert_eq!(rope.knot_positions, [(1, 0), (0, 0)]);
        rope.simulate_step(RIGHT);
        assert_eq!(rope.knot_positions, [(2, 0), (1, 0)]);
        rope.simulate_step(UP);
        assert_eq!(rope.knot_positions, [(2, 1), (1, 0)]);
        rope.simulate_step(UP);
        assert_eq!(rope.knot_positions, [(2, 2), (2, 1)]);
        rope.simulate_step(LEFT);
        assert_eq!(rope.knot_positions, [(1, 2), (2, 1)]);
        rope.simulate_step(LEFT);
        assert_eq!(rope.knot_positions, [(0, 2), (1, 2)]);
        rope.simulate_step(DOWN);
        assert_eq!(rope.knot_positions, [(0, 1), (1, 2)]);
        rope.simulate_step(RIGHT);
        assert_eq!(rope.knot_positions, [(1, 1), (1, 2)]);
        rope.simulate_step(RIGHT);
        assert_eq!(rope.knot_positions, [(2, 1), (1, 2)]);
        rope.simulate_step(RIGHT);
        assert_eq!(rope.knot_positions, [(3, 1), (2, 1)]);
    }

    #[test]
    fn test_simulate_steps() {
        let mut rope = Rope::with_length(2);
        rope.simulate_steps(parse_input(EXAMPLE_INPUT.trim()));
        assert_eq!(
            rope,
            Rope {
                knot_positions: vec![(2, 2), (1, 2)],
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
    fn test_simulate_steps_10() {
        let mut rope = Rope::with_length(10);
        rope.simulate_steps(parse_input(EXAMPLE_INPUT.trim()));
        assert_eq!(
            rope,
            Rope {
                knot_positions: vec![
                    (2, 2),
                    (1, 2),
                    (2, 2),
                    (3, 2),
                    (2, 2),
                    (1, 1),
                    (0, 0),
                    (0, 0),
                    (0, 0),
                    (0, 0)
                ],
                positions_visited_by_tail: HashSet::from([(0, 0)])
            }
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 13);
        assert_eq!(part2(EXAMPLE_INPUT_2.trim()), 36);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 6271);
        assert_eq!(solution2(), 2458);
    }
}
