use std::ops::Index;

use crate::utils::{get_input, Splittable};

type Position = (i32, i32);

const LEFT: Position = (0, -1);
const RIGHT: Position = (0, 1);
const UP: Position = (-1, 0);
const DOWN: Position = (1, 0);

#[derive(Debug, PartialEq)]
struct GridOfTrees(Vec<Vec<u32>>);

impl Index<Position> for GridOfTrees {
    type Output = u32;

    fn index(&self, index: Position) -> &Self::Output {
        &self.0[index.1 as usize][index.0 as usize]
    }
}

impl GridOfTrees {
    fn get(&self, position: Position) -> Option<&u32> {
        self.0
            .get(position.1 as usize)
            .and_then(|row| row.get(position.0 as usize))
    }

    fn is_in_grid(&self, position: Position) -> bool {
        self.get(position).is_some()
    }

    fn iterate_over_all_positions(&self) -> GridPositionsIter<'_> {
        GridPositionsIter {
            next_position: (0, 0),
            grid: self,
        }
    }

    fn iterate_from_position_in_direction(
        &self,
        current_position: Position,
        direction: Position,
    ) -> GridDirectionalPositionsIter<'_> {
        GridDirectionalPositionsIter {
            grid: self,
            direction,
            current_position,
        }
    }

    fn from_input_string(input: &str) -> Self {
        Self(input.split_and_map("\n", |line| {
            line.chars()
                .map(|char| char.to_string().parse().expect("Should be a number"))
                .collect()
        }))
    }

    fn is_tree_visible_from_direction(&self, tree_position: Position, direction: Position) -> bool {
        let tree_size = self[tree_position];
        for position in self.iterate_from_position_in_direction(tree_position, direction) {
            if self[position] >= tree_size {
                return false; // hidden by this tree
            };
        }
        return true; // found the edge
    }

    fn is_tree_visible_from_outside(&self, tree_position: Position) -> bool {
        self.is_tree_visible_from_direction(tree_position, LEFT)
            || self.is_tree_visible_from_direction(tree_position, DOWN)
            || self.is_tree_visible_from_direction(tree_position, RIGHT)
            || self.is_tree_visible_from_direction(tree_position, UP)
    }

    fn count_visible_trees(&self) -> u32 {
        self.iterate_over_all_positions()
            .filter(|position| self.is_tree_visible_from_outside(*position))
            .count() as u32
    }

    fn get_viewing_distance_in_direction(
        &self,
        tree_position: Position,
        direction: Position,
    ) -> u32 {
        let tree_size = self[tree_position];
        let mut count_of_visible_trees = 0;
        for position in self.iterate_from_position_in_direction(tree_position, direction) {
            count_of_visible_trees += 1;
            if self[position] >= tree_size {
                break; // no further trees visible
            };
        }
        count_of_visible_trees
    }

    fn get_scenic_score(&self, tree_position: Position) -> u32 {
        self.get_viewing_distance_in_direction(tree_position, LEFT)
            * self.get_viewing_distance_in_direction(tree_position, DOWN)
            * self.get_viewing_distance_in_direction(tree_position, RIGHT)
            * self.get_viewing_distance_in_direction(tree_position, UP)
    }

    fn get_highest_scenic_score(&self) -> u32 {
        self.iterate_over_all_positions()
            .map(|position| self.get_scenic_score(position))
            .max()
            .expect("There should be a highest scenic score")
    }
}

struct GridPositionsIter<'a> {
    grid: &'a GridOfTrees,
    next_position: Position,
}

impl<'a> Iterator for GridPositionsIter<'a> {
    type Item = Position;

    fn next(&mut self) -> Option<Self::Item> {
        if !self.grid.is_in_grid(self.next_position) {
            self.next_position.0 = 0;
            self.next_position.1 += 1;
        }
        let current_position = self.next_position;
        self.next_position.0 += 1;
        if self.grid.is_in_grid(current_position) {
            Some(current_position)
        } else {
            None
        }
    }
}

struct GridDirectionalPositionsIter<'a> {
    grid: &'a GridOfTrees,
    direction: Position,
    current_position: Position,
}

impl<'a> Iterator for GridDirectionalPositionsIter<'a> {
    type Item = Position;

    fn next(&mut self) -> Option<Self::Item> {
        self.current_position.0 += self.direction.0;
        self.current_position.1 += self.direction.1;

        if self.grid.is_in_grid(self.current_position) {
            Some(self.current_position)
        } else {
            None
        }
    }
}

fn part1(input: &str) -> u32 {
    GridOfTrees::from_input_string(input).count_visible_trees()
}

fn part2(input: &str) -> u32 {
    GridOfTrees::from_input_string(input).get_highest_scenic_score()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 08))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 08))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
30373
25512
65332
33549
35390
";

    #[test]
    fn test_parse_input_string() {
        assert_eq!(
            GridOfTrees::from_input_string(EXAMPLE_INPUT.trim()),
            GridOfTrees(vec![
                vec![3, 0, 3, 7, 3],
                vec![2, 5, 5, 1, 2],
                vec![6, 5, 3, 3, 2],
                vec![3, 3, 5, 4, 9],
                vec![3, 5, 3, 9, 0],
            ])
        )
    }

    #[test]
    fn test_is_tree_visible_from_direction() {
        let grid_of_trees = GridOfTrees::from_input_string(EXAMPLE_INPUT.trim());

        // top left number should be visible from top and left
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((0, 0), UP),
            true
        );
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((0, 0), LEFT),
            true
        );
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((0, 0), DOWN),
            false
        );
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((0, 0), RIGHT),
            false
        );

        // the 5 at position (2,1) should be visible from top and right
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((2, 1), UP),
            false
        );
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((2, 1), LEFT),
            true
        );
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((2, 1), DOWN),
            true
        );
        assert_eq!(
            grid_of_trees.is_tree_visible_from_direction((2, 1), RIGHT),
            false
        );
    }

    #[test]
    fn test_is_tree_visible_from_outside() {
        let grid_of_trees = GridOfTrees::from_input_string(EXAMPLE_INPUT.trim());

        assert_eq!(grid_of_trees.is_tree_visible_from_outside((0, 0)), true);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((1, 1)), true);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((2, 1)), true);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((3, 1)), false);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((1, 2)), true);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((2, 2)), false);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((3, 2)), true);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((1, 3)), false);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((2, 3)), true);
        assert_eq!(grid_of_trees.is_tree_visible_from_outside((3, 3)), false);
    }

    #[test]
    fn test_get_viewing_distance_in_direction() {
        let grid_of_trees = GridOfTrees::from_input_string(EXAMPLE_INPUT.trim());

        // the top middle 5
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 1), LEFT),
            1
        );
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 1), UP),
            1
        );
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 1), DOWN),
            2
        );
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 1), RIGHT),
            2
        );

        // the bottom middle 5
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 3), LEFT),
            2
        );
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 3), UP),
            2
        );
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 3), RIGHT),
            1
        );
        assert_eq!(
            grid_of_trees.get_viewing_distance_in_direction((2, 3), DOWN),
            2
        );
    }

    #[test]
    fn test_get_scenic_score() {
        let grid_of_trees = GridOfTrees::from_input_string(EXAMPLE_INPUT.trim());

        assert_eq!(grid_of_trees.get_scenic_score((2, 1)), 4);
        assert_eq!(grid_of_trees.get_scenic_score((2, 3)), 8);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 21);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 8);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 1832);
        assert_eq!(solution2(), 157320);
    }
}
