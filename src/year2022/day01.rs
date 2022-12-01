use crate::utils::{get_input, Splittable};

fn get_list_of_calories_per_elf(input: &str) -> Vec<u32> {
    input
        .split_to_strings("\n\n")
        .iter()
        .map(|elf_string| elf_string.split_to_numbers("\n").iter().sum())
        .collect()
}

fn part1(input: &str) -> u32 {
    let calories = get_list_of_calories_per_elf(input);
    *calories.iter().max().expect("Input should not be empty")
}

fn part2(input: &str) -> u32 {
    let mut calories = get_list_of_calories_per_elf(input);
    calories.sort();
    calories.reverse();
    let top_three = &calories[..3];
    top_three.iter().sum()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 01))
}

pub fn solution2() -> u32 {
    let input = &get_input(2022, 01);
    part2(input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 71934);
        assert_eq!(solution2(), 211447);
    }
}
