use crate::utils::{get_input, Splittable};

#[derive(Debug, PartialEq)]
struct Range {
    start: u32,
    end: u32,
}

impl Range {
    fn new(str: &str) -> Self {
        let split = str.split_to_numbers("-");
        Range {
            start: split[0],
            end: split[1],
        }
    }

    fn fully_contains(&self, other: &Range) -> bool {
        self.start <= other.start && self.end >= other.end
    }
}

#[derive(Debug, PartialEq)]
struct PairOfRanges {
    range1: Range,
    range2: Range,
}

impl PairOfRanges {
    fn new(str: &str) -> Self {
        let split = str.split_to_strings(",");
        PairOfRanges {
            range1: Range::new(&split[0]),
            range2: Range::new(&split[1]),
        }
    }

    fn has_total_overlap(self: &Self) -> bool {
        self.range1.fully_contains(&self.range2) || self.range2.fully_contains(&self.range1)
    }
}

fn part1(input: &str) -> u32 {
    input
        .split_and_map("\n", |line| PairOfRanges::new(line))
        .iter()
        .filter(|por| por.has_total_overlap())
        .count() as u32
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 04))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
";

    #[test]
    fn test_range_from_string() {
        assert_eq!(Range::new("2-8"), Range { start: 2, end: 8 });
    }

    #[test]
    fn test_fully_contains() {
        assert_eq!(Range::new("2-8").fully_contains(&Range::new("3-7")), true);
        assert_eq!(Range::new("4-6").fully_contains(&Range::new("6-6")), true);
        assert_eq!(Range::new("6-6").fully_contains(&Range::new("4-6")), false);
    }

    #[test]
    fn test_pair_of_ranges_from_string() {
        assert_eq!(
            PairOfRanges::new("2-4,6-8"),
            PairOfRanges {
                range1: Range { start: 2, end: 4 },
                range2: Range { start: 6, end: 8 }
            }
        );
    }

    #[test]
    fn test_has_total_overlap() {
        assert_eq!(PairOfRanges::new("2-4,6-8").has_total_overlap(), false);
        assert_eq!(PairOfRanges::new("2-8,3-7").has_total_overlap(), false);
        assert_eq!(PairOfRanges::new("6-6,4-6").has_total_overlap(), false);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 2);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 576);
    }
}
