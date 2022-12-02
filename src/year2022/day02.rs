use crate::utils::{get_input, Splittable};

#[derive(Debug, PartialEq)]
enum Shape {
    Rock,
    Paper,
    Scissors,
}
use Shape::*;

#[derive(Debug, PartialEq)]
enum Outcome {
    TheyWin,
    Draw,
    WeWin,
}
use Outcome::*;

type Moves = (Shape, Shape);

fn parse_as_shape(shape_string: &String) -> Shape {
    match (shape_string).as_str() {
        "A" | "X" => Rock,
        "B" | "Y" => Paper,
        "C" | "Z" => Scissors,
        default => panic!("Invalid shape: {}", default),
    }
}

fn parse_as_outcome(outcome_string: &String) -> Outcome {
    match (&outcome_string).as_str() {
        "X" => TheyWin,
        "Y" => Draw,
        "Z" => WeWin,
        default => panic!("Invalid outcome: {}", default),
    }
}

fn parse_as_two_moves(input: &String) -> Moves {
    let split_string = input.split_to_strings(" ");
    let their = parse_as_shape(&split_string[0]);
    let our = parse_as_shape(&split_string[1]);

    (their, our)
}

fn parse_as_move_and_outcome(input: &String) -> Moves {
    let split_string = input.split_to_strings(" ");
    let their_shape = parse_as_shape(&split_string[0]);
    let desired_outcome = parse_as_outcome(&split_string[1]);

    let our_shape = find_shape_for_outcome(&their_shape, &desired_outcome)
        .expect("There should be a move possible");

    (their_shape, our_shape)
}

fn evaluate_round(moves: (&Shape, &Shape)) -> Outcome {
    match moves {
        (Rock, Rock) | (Paper, Paper) | (Scissors, Scissors) => Draw,
        (Rock, Scissors) | (Paper, Rock) | (Scissors, Paper) => TheyWin,
        (Rock, Paper) | (Paper, Scissors) | (Scissors, Rock) => WeWin,
    }
}

fn score_for_round((their_shape, our_shape): &Moves) -> u32 {
    let shape_score = match our_shape {
        Rock => 1,
        Paper => 2,
        Scissors => 3,
    };
    let outcome_score = match evaluate_round((&their_shape, &our_shape)) {
        TheyWin => 0,
        Draw => 3,
        WeWin => 6,
    };

    shape_score + outcome_score
}

fn total_score(all_moves: &Vec<Moves>) -> u32 {
    all_moves.iter().map(|moves| score_for_round(moves)).sum()
}

fn find_shape_for_outcome(their_shape: &Shape, desired_outcome: &Outcome) -> Option<Shape> {
    for our_shape in [Rock, Paper, Scissors] {
        if evaluate_round((&their_shape, &our_shape)) == *desired_outcome {
            return Some(our_shape);
        }
    }

    None
}

fn part1(input: &str) -> u32 {
    total_score(&input.split_and_map("\n", parse_as_two_moves))
}

fn part2(input: &str) -> u32 {
    total_score(&input.split_and_map("\n", parse_as_move_and_outcome))
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 02))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 02))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_score_for_round() {
        assert_eq!(score_for_round(&(Rock, Paper)), 8);
        assert_eq!(score_for_round(&(Paper, Rock)), 1);
        assert_eq!(score_for_round(&(Scissors, Scissors)), 6);
    }

    #[test]
    fn test_total_score() {
        assert_eq!(
            total_score(&vec![(Rock, Paper), (Paper, Rock), (Scissors, Scissors)]),
            15
        );
    }

    #[test]
    fn test_find_shape_for_outcome() {
        assert_eq!(find_shape_for_outcome(&Rock, &Draw), Some(Rock));
        assert_eq!(find_shape_for_outcome(&Paper, &TheyWin), Some(Rock));
        assert_eq!(find_shape_for_outcome(&Scissors, &WeWin), Some(Rock));
    }

    #[test]
    fn test_parts() {
        let input = "A Y\nB X\nC Z";
        assert_eq!(part1(input), 15);
        assert_eq!(part2(input), 12);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 14069);
        assert_eq!(solution2(), 12411);
    }
}
