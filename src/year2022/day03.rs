use crate::utils::{get_input, Splittable};
use std::collections::HashSet;

fn split_line_into_two_sets(line: &str) -> [HashSet<char>; 2] {
    let mid = line.len() / 2;
    [
        HashSet::from_iter(line[..mid].chars()),
        HashSet::from_iter(line[mid..].chars()),
    ]
}

fn split_lines_into_three_sets(lines: &Vec<String>) -> Vec<[HashSet<char>; 3]> {
    let mut lines_iter = lines.iter();
    let mut result = Vec::new();
    while let Some(line1) = lines_iter.next() {
        let line2 = lines_iter
            .next()
            .expect("Line count should be multiple of 3");
        let line3 = lines_iter
            .next()
            .expect("Line count should be multiple of 3");
        result.push([
            HashSet::from_iter(line1.chars()),
            HashSet::from_iter(line2.chars()),
            HashSet::from_iter(line3.chars()),
        ]);
    }
    result
}

fn find_common_item_of_two([set1, set2]: &[HashSet<char>; 2]) -> &char {
    set1.intersection(set2).collect::<Vec<&char>>()[0]
}
fn find_common_item_of_three([set1, set2, set3]: &[HashSet<char>; 3]) -> &char {
    set1.iter()
        .filter(|c| set2.contains(c))
        .filter(|c| set3.contains(c))
        .collect::<Vec<&char>>()[0]
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
            priority(find_common_item_of_two(&split_line_into_two_sets(line)))
        })
        .iter()
        .sum()
}

fn part2(input: &str) -> u32 {
    split_lines_into_three_sets(&input.split_to_strings("\n"))
        .iter()
        .map(|sets| priority(find_common_item_of_three(sets)))
        .sum()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 03))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 03))
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
    fn test_split_line_into_two_sets() {
        assert_eq!(
            split_line_into_two_sets("vJrwpWtwJgWrhcsFMMfFFhFp"),
            [
                HashSet::from_iter("vJrwpWtwJgWr".chars()),
                HashSet::from_iter("hcsFMMfFFhFp".chars())
            ]
        )
    }

    #[test]
    fn test_split_lines_into_three_sets() {
        assert_eq!(
            split_lines_into_three_sets(&EXAMPLE_INPUT.trim().split_to_strings("\n")),
            vec![
                [
                    HashSet::from_iter("vJrwpWtwJgWrhcsFMMfFFhFp".chars()),
                    HashSet::from_iter("jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL".chars()),
                    HashSet::from_iter("PmmdzqPrVvPwwTWBwg".chars()),
                ],
                [
                    HashSet::from_iter("wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn".chars()),
                    HashSet::from_iter("ttgJtRGJQctTZtZT".chars()),
                    HashSet::from_iter("CrZsJsPPZsGzwwsLwLmpwMDw".chars())
                ],
            ]
        )
    }

    #[test]
    fn test_find_common_item() {
        assert_eq!(
            find_common_item_of_two(&[
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
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 70);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 7863);
        assert_eq!(solution2(), 2488);
    }
}
