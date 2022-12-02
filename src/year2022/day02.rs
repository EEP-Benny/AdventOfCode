use crate::utils::{get_input, Splittable};

#[derive(Debug, PartialEq)]
enum Shape {
    Rock,
    Paper,
    Scissors,
}

#[derive(Debug, PartialEq)]
enum Outcome {
    TheyWin,
    Draw,
    WeWin,
}

fn parse_input_as_moves(input: &str) -> Vec<Moves> {
    input
        .split_to_strings("\n")
        .iter()
        .map(|line| parse_single_input_as_moves(line))
        .collect()
}

fn parse_input_as_move_and_outcome(input: &str) -> Vec<Moves> {
    input
        .split_to_strings("\n")
        .iter()
        .map(|line| parse_single_input_as_move_and_outcome(line))
        .collect()
}

type Moves = (Shape, Shape);

fn parse_single_input_as_moves(input: &str) -> Moves {
    let split_string = input.split_to_strings(" ");
    let their = match (&split_string[0]).as_str() {
        "A" => Shape::Rock,
        "B" => Shape::Paper,
        "C" => Shape::Scissors,
        default => panic!("Invalid their character: {}", default),
    };
    let our = match (&split_string[1]).as_str() {
        "X" => Shape::Rock,
        "Y" => Shape::Paper,
        "Z" => Shape::Scissors,
        default => panic!("Invalid our character: {}", default),
    };

    (their, our)
}

fn parse_single_input_as_move_and_outcome(input: &str) -> Moves {
    let split_string = input.split_to_strings(" ");
    let their_shape = match (&split_string[0]).as_str() {
        "A" => Shape::Rock,
        "B" => Shape::Paper,
        "C" => Shape::Scissors,
        default => panic!("Invalid their character: {}", default),
    };
    let desired_outcome = match (&split_string[1]).as_str() {
        "X" => Outcome::TheyWin,
        "Y" => Outcome::Draw,
        "Z" => Outcome::WeWin,
        default => panic!("Invalid our character: {}", default),
    };
    let our_shape = find_shape_for_outcome(&their_shape, desired_outcome)
        .expect("There should be a move possible");

    (their_shape, our_shape)
}

fn evaluate_round(moves: (&Shape, &Shape)) -> Outcome {
    match moves {
        (Shape::Rock, Shape::Rock) => Outcome::Draw,
        (Shape::Rock, Shape::Paper) => Outcome::WeWin,
        (Shape::Rock, Shape::Scissors) => Outcome::TheyWin,
        (Shape::Paper, Shape::Rock) => Outcome::TheyWin,
        (Shape::Paper, Shape::Paper) => Outcome::Draw,
        (Shape::Paper, Shape::Scissors) => Outcome::WeWin,
        (Shape::Scissors, Shape::Rock) => Outcome::WeWin,
        (Shape::Scissors, Shape::Paper) => Outcome::TheyWin,
        (Shape::Scissors, Shape::Scissors) => Outcome::Draw,
    }
}

fn score_for_round(moves: &Moves) -> u32 {
    let shape_score = match moves.1 {
        Shape::Rock => 1,
        Shape::Paper => 2,
        Shape::Scissors => 3,
    };
    let outcome_score = match evaluate_round((&moves.0, &moves.1)) {
        Outcome::TheyWin => 0,
        Outcome::Draw => 3,
        Outcome::WeWin => 6,
    };

    shape_score + outcome_score
}

fn total_score(all_moves: Vec<Moves>) -> u32 {
    all_moves.iter().map(|moves| score_for_round(moves)).sum()
}

fn find_shape_for_outcome(their_shape: &Shape, desired_outcome: Outcome) -> Option<Shape> {
    if evaluate_round((&their_shape, &Shape::Rock)) == desired_outcome {
        return Some(Shape::Rock);
    }
    if evaluate_round((&their_shape, &Shape::Paper)) == desired_outcome {
        return Some(Shape::Paper);
    }
    if evaluate_round((&their_shape, &Shape::Scissors)) == desired_outcome {
        return Some(Shape::Scissors);
    }

    None
}

fn part1(input: &str) -> u32 {
    let all_moves = parse_input_as_moves(input);
    total_score(all_moves)
}

fn part2(input: &str) -> u32 {
    let all_moves = parse_input_as_move_and_outcome(input);
    total_score(all_moves)
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 02))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 02))
}
