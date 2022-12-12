use std::{
    cmp::Ordering,
    collections::{BinaryHeap, HashMap},
    hash::Hash,
    ops::{Add, Index},
};

use crate::utils::get_input;

#[derive(Debug, PartialEq, Eq, Hash)]
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

const LEFT: Position = Position { x: 0, y: -1 };
const RIGHT: Position = Position { x: 0, y: 1 };
const UP: Position = Position { x: -1, y: 0 };
const DOWN: Position = Position { x: 1, y: 0 };

#[derive(Debug, PartialEq)]
struct HeightMap(Vec<Vec<u32>>);

impl Index<Position> for HeightMap {
    type Output = u32;

    fn index(&self, index: Position) -> &Self::Output {
        &self.0[index.x as usize][index.y as usize]
    }
}

impl HeightMap {
    fn get(&self, position: &Position) -> Option<&u32> {
        self.0
            .get(position.y as usize)
            .and_then(|row| row.get(position.x as usize))
    }
}

#[derive(Debug, PartialEq, Eq)]
struct State {
    position: Position,
    steps_so_far: u32,
    min_steps_to_target: u32,
}

// The priority queue depends on `Ord`.
// Explicitly implement the trait so the queue becomes a min-heap
// instead of a max-heap.
impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        // Notice that the we flip the ordering on costs.
        // In case of a tie we compare positions - this step is necessary
        // to make implementations of `PartialEq` and `Ord` consistent.
        (other.steps_so_far + other.min_steps_to_target)
            .cmp(&(&self.steps_so_far + &self.min_steps_to_target))
        // .then_with(|| self.position.cmp(&other.position))
    }
}

// `PartialOrd` needs to be implemented as well.
impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl State {
    fn new(
        position: Position,
        current_height: u32,
        end_position: &Position,
        steps_so_far: u32,
    ) -> Self {
        Self {
            min_steps_to_target: (26 - current_height)
                .max(position.manhattan_distance(&end_position)),
            steps_so_far,
            position,
        }
    }
}

#[derive(Debug)]
struct ExplorationState {
    height_map: HeightMap,
    end_position: Position,
    positions_to_explore_next: BinaryHeap<State>,
    shortest_distance_to_position: HashMap<Position, u32>,
}

impl ExplorationState {
    fn from_input_string(input: &str) -> Self {
        let mut start_position = Position::new(0, 0);
        let mut end_position = Position::new(0, 0);
        let height_map = HeightMap(
            input
                .lines()
                .enumerate()
                .map(|(y, line)| {
                    line.chars()
                        .enumerate()
                        .map(|(x, char)| match char {
                            letter @ 'a'..='z' => letter as u32 - 'a' as u32 + 1,
                            'S' => {
                                start_position = Position::new(x as i32, y as i32);
                                1
                            }
                            'E' => {
                                end_position = Position::new(x as i32, y as i32);
                                26
                            }
                            default => panic!("Unexpected height map entry: {default}"),
                        })
                        .collect()
                })
                .collect(),
        );
        let start_state = State::new(start_position, 1, &end_position, 0);
        Self {
            height_map,
            end_position,
            positions_to_explore_next: BinaryHeap::from([start_state]),
            shortest_distance_to_position: HashMap::new(),
        }
    }

    fn single_step(&mut self) {
        let state = self
            .positions_to_explore_next
            .pop()
            .expect("There should be something to explore until we reach the goal");

        if let Some(distance) = self.shortest_distance_to_position.get(&state.position) {
            if distance <= &state.steps_so_far {
                return;
            }
        }

        for direction in [UP, RIGHT, DOWN, LEFT] {
            let new_position = &state.position + &direction;
            match (
                self.height_map.get(&state.position),
                self.height_map.get(&new_position),
            ) {
                (Some(&old_height), Some(&new_height)) => {
                    if old_height + 1 >= new_height {
                        self.positions_to_explore_next.push(State::new(
                            new_position,
                            new_height,
                            &self.end_position,
                            state.steps_so_far + 1,
                        ))
                    }
                }
                _ => {}
            }
        }

        self.shortest_distance_to_position
            .insert(state.position, state.steps_so_far);
    }

    fn find_shortest_path_to_target(&mut self) -> u32 {
        loop {
            if let Some(&step_count) = self.shortest_distance_to_position.get(&self.end_position) {
                return step_count;
            }
            self.single_step();
        }
    }
}

fn part1(input: &str) -> u32 {
    ExplorationState::from_input_string(input).find_shortest_path_to_target()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 12))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
";

    #[test]
    fn test_parse_input_string() {
        let exploration_state = ExplorationState::from_input_string(EXAMPLE_INPUT.trim());
        assert_eq!(
            exploration_state.height_map,
            HeightMap(vec![
                vec![1, 1, 2, 17, 16, 15, 14, 13],
                vec![1, 2, 3, 18, 25, 24, 24, 12],
                vec![1, 3, 3, 19, 26, 26, 24, 11],
                vec![1, 3, 3, 20, 21, 22, 23, 10],
                vec![1, 2, 4, 5, 6, 7, 8, 9],
            ])
        );
        assert_eq!(exploration_state.end_position, Position::new(5, 2));
        assert_eq!(exploration_state.positions_to_explore_next.len(), 1);
        assert_eq!(
            exploration_state.positions_to_explore_next.peek(),
            Some(&State {
                min_steps_to_target: 25,
                position: Position::new(0, 0),
                steps_so_far: 0
            })
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 31);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 408);
    }
}
