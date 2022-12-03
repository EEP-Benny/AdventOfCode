use crate::utils::{get_input, Splittable};
use std::collections::HashSet;

fn split_to_sets(line: &str) -> [HashSet<char>; 2] {
    let mid = line.len() / 2;
    [
        HashSet::from_iter(line[..mid].chars()),
        HashSet::from_iter(line[mid..].chars()),
    ]
}

fn find_common_item([set1, set2]: &[HashSet<char>; 2]) -> &char {
    set1.intersection(set2).collect::<Vec<&char>>()[0]
}

fn priority(c: &char) -> u32 {
    if c <= &'Z' {
        return (c.clone() as u32) - ('A' as u32) + 27;
    } else {
        return (c.clone() as u32) - ('a' as u32) + 1;
    }
}

fn part1(input: &str) -> u32 {
    input
        .split_and_map("\n", |line| {
            priority(find_common_item(&split_to_sets(line)))
        })
        .iter()
        .sum()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 03))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
";

    #[test]
    fn test_split_to_sets() {
        assert_eq!(
            split_to_sets("vJrwpWtwJgWrhcsFMMfFFhFp"),
            [
                HashSet::from_iter("vJrwpWtwJgWr".chars()),
                HashSet::from_iter("hcsFMMfFFhFp".chars())
            ]
        )
    }

    #[test]
    fn test_find_common_item() {
        assert_eq!(
            find_common_item(&[
                HashSet::from_iter("vJrwpWtwJgWr".chars()),
                HashSet::from_iter("hcsFMMfFFhFp".chars())
            ]),
            &'p'
        )
    }

    #[test]
    fn test_priority() {
        assert_eq!(priority(&'a'), 1);
        assert_eq!(priority(&'z'), 26);
        assert_eq!(priority(&'A'), 27);
        assert_eq!(priority(&'Z'), 52);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 157);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 7863);
    }
}
