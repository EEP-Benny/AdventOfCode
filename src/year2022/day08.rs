use crate::utils::{get_input, Splittable};

type GridOfTrees = Vec<Vec<u32>>;
type Position = (i32, i32);

fn parse_input_string(input: &str) -> GridOfTrees {
    input.split_and_map("\n", |line| {
        line.chars()
            .map(|char| char.to_string().parse().expect("Should be a number"))
            .collect()
    })
}

fn is_tree_visible_from_direction(
    grid: &GridOfTrees,
    tree_position: Position,
    direction: Position,
) -> bool {
    let tree_size = grid[tree_position.1 as usize][tree_position.0 as usize];
    let mut position = tree_position;
    loop {
        position.0 += direction.0;
        position.1 += direction.1;
        match grid
            .get(position.1 as usize)
            .and_then(|row| row.get(position.0 as usize))
        {
            Some(size) => {
                if size >= &tree_size {
                    return false; // hidden by this tree
                };
            }
            None => {
                return true; // found the edge
            }
        };
    }
}

fn is_tree_visible_from_outside(grid: &GridOfTrees, tree_position: Position) -> bool {
    is_tree_visible_from_direction(grid, tree_position, (0, -1))
        || is_tree_visible_from_direction(grid, tree_position, (1, 0))
        || is_tree_visible_from_direction(grid, tree_position, (0, 1))
        || is_tree_visible_from_direction(grid, tree_position, (-1, 0))
}

fn count_visible_trees(grid: &GridOfTrees) -> u32 {
    let mut count = 0;
    for y in 0..grid.len() {
        for x in 0..grid[y].len() {
            if is_tree_visible_from_outside(grid, (x as i32, y as i32)) {
                count += 1;
            }
        }
    }
    count
}

fn get_viewing_distance_in_direction(
    grid: &GridOfTrees,
    tree_position: Position,
    direction: Position,
) -> u32 {
    let tree_size = grid[tree_position.1 as usize][tree_position.0 as usize];
    let mut position = tree_position;
    let mut count_of_visible_trees = 0;
    loop {
        position.0 += direction.0;
        position.1 += direction.1;
        match grid
            .get(position.1 as usize)
            .and_then(|row| row.get(position.0 as usize))
        {
            Some(size) => {
                count_of_visible_trees += 1;
                if size >= &tree_size {
                    return count_of_visible_trees; // no further trees visible
                };
            }
            None => {
                return count_of_visible_trees; // found the edge
            }
        };
    }
}

fn get_scenic_score(grid: &GridOfTrees, tree_position: Position) -> u32 {
    get_viewing_distance_in_direction(grid, tree_position, (0, -1))
        * get_viewing_distance_in_direction(grid, tree_position, (1, 0))
        * get_viewing_distance_in_direction(grid, tree_position, (0, 1))
        * get_viewing_distance_in_direction(grid, tree_position, (-1, 0))
}

fn get_highest_scenic_score(grid: &GridOfTrees) -> u32 {
    let mut highest_scenic_score = 0;
    for y in 0..grid.len() {
        for x in 0..grid[y].len() {
            let scenic_score = get_scenic_score(grid, (x as i32, y as i32));
            if scenic_score > highest_scenic_score {
                highest_scenic_score = scenic_score;
            }
        }
    }
    highest_scenic_score
}

fn part1(input: &str) -> u32 {
    count_visible_trees(&parse_input_string(input))
}

fn part2(input: &str) -> u32 {
    get_highest_scenic_score(&parse_input_string(input))
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
            parse_input_string(EXAMPLE_INPUT.trim()),
            vec![
                vec![3, 0, 3, 7, 3],
                vec![2, 5, 5, 1, 2],
                vec![6, 5, 3, 3, 2],
                vec![3, 3, 5, 4, 9],
                vec![3, 5, 3, 9, 0],
            ]
        )
    }

    #[test]
    fn test_is_tree_visible_from_direction() {
        let grid_of_trees = parse_input_string(EXAMPLE_INPUT.trim());

        // top left number should be visible from top and left
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (0, 0), (-1, 0)),
            true
        );
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (0, 0), (0, -1)),
            true
        );
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (0, 0), (1, 0)),
            false
        );
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (0, 0), (0, 1)),
            false
        );

        // the 5 at position (2,1) should be visible from top and right
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (2, 1), (-1, 0)),
            false
        );
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (2, 1), (0, -1)),
            true
        );
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (2, 1), (1, 0)),
            true
        );
        assert_eq!(
            is_tree_visible_from_direction(&grid_of_trees, (2, 1), (0, 1)),
            false
        );
    }

    #[test]
    fn test_is_tree_visible_from_outside() {
        let grid_of_trees = parse_input_string(EXAMPLE_INPUT.trim());

        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (0, 0)), true);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (1, 1)), true);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (2, 1)), true);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (3, 1)), false);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (1, 2)), true);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (2, 2)), false);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (3, 2)), true);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (1, 3)), false);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (2, 3)), true);
        assert_eq!(is_tree_visible_from_outside(&grid_of_trees, (3, 3)), false);
    }

    #[test]
    fn test_get_viewing_distance_in_direction() {
        let grid_of_trees = parse_input_string(EXAMPLE_INPUT.trim());

        // the top middle 5
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 1), (0, -1)),
            1
        );
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 1), (-1, 0)),
            1
        );
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 1), (1, 0)),
            2
        );
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 1), (0, 1)),
            2
        );

        // the bottom middle 5
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 3), (0, -1)),
            2
        );
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 3), (-1, 0)),
            2
        );
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 3), (0, 1)),
            1
        );
        assert_eq!(
            get_viewing_distance_in_direction(&grid_of_trees, (2, 3), (1, 0)),
            2
        );
    }

    #[test]
    fn test_get_scenic_score() {
        let grid_of_trees = parse_input_string(EXAMPLE_INPUT.trim());

        assert_eq!(get_scenic_score(&grid_of_trees, (2, 1)), 4);
        assert_eq!(get_scenic_score(&grid_of_trees, (2, 3)), 8);
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
