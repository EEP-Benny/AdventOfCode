use std::cmp::Ordering;

use json::JsonValue;

use crate::utils::{get_input, Splittable};

#[derive(Debug, PartialEq, Eq)]
enum PacketValue {
    Number(u32),
    List(Vec<PacketValue>),
}
use PacketValue::{List, Number};

impl PartialOrd for PacketValue {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for PacketValue {
    fn cmp(&self, other: &Self) -> Ordering {
        match (self, other) {
            (Number(left), Number(right)) => left.cmp(right),
            (Number(left), right @ List(_)) => List(vec![Number(*left)]).cmp(right),
            (left @ List(_), Number(right)) => left.cmp(&List(vec![Number(*right)])),
            (List(left_list), List(right_list)) => {
                let (mut left_iter, mut right_iter) = (left_list.iter(), right_list.iter());
                loop {
                    match (left_iter.next(), right_iter.next()) {
                        (None, None) => break Ordering::Equal,
                        (None, Some(_)) => break Ordering::Less,
                        (Some(_), None) => break Ordering::Greater,
                        (Some(left), Some(right)) => match left.cmp(right) {
                            Ordering::Equal => continue,
                            default => break default,
                        },
                    };
                }
            }
        }
    }
}

impl PacketValue {
    fn from_string(string: &str) -> Option<Self> {
        Self::from_json_value(&json::parse(string).ok()?)
    }
    fn from_json_value(value: &JsonValue) -> Option<Self> {
        match value {
            JsonValue::Number(value) => value
                .as_fixed_point_u64(0)
                .and_then(|x| Some(Self::Number(x as u32))),
            JsonValue::Array(value) => Some(Self::List(
                value
                    .iter()
                    .filter_map(|entry| Self::from_json_value(entry))
                    .collect(),
            )),
            _ => None,
        }
    }
}

#[derive(Debug, PartialEq)]
struct Pair {
    left: PacketValue,
    right: PacketValue,
}

impl Pair {
    fn from_string(pair_as_string: &String) -> Self {
        let (left_string, right_string) = pair_as_string.split_once("\n").unwrap();
        match (
            PacketValue::from_string(left_string),
            PacketValue::from_string(right_string),
        ) {
            (Some(left @ List(_)), Some(right @ List(_))) => Pair { left, right },
            _ => panic!("Invalid input"),
        }
    }

    fn is_in_right_order(&self) -> bool {
        self.left <= self.right
    }
}

fn parse_input(input: &str) -> Vec<Pair> {
    input.split_and_map("\n\n", Pair::from_string)
}

fn part1(input: &str) -> u32 {
    parse_input(input)
        .iter()
        .zip(1..)
        .filter_map(|(pair, index)| {
            if pair.is_in_right_order() {
                Some(index)
            } else {
                None
            }
        })
        .sum()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 13))
}

#[cfg(test)]
mod tests {

    use super::PacketValue::{List, Number};
    use super::*;

    const EXAMPLE_INPUT: &str = "
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
";

    #[test]
    fn test_parse_input() {
        let pairs = parse_input(EXAMPLE_INPUT.trim());
        assert_eq!(pairs.len(), 8);
        assert_eq!(
            pairs[0],
            Pair {
                left: List(vec![Number(1), Number(1), Number(3), Number(1), Number(1)]),
                right: List(vec![Number(1), Number(1), Number(5), Number(1), Number(1)])
            }
        );
        assert_eq!(
            pairs[1],
            Pair {
                left: List(vec![
                    List(vec![Number(1)]),
                    List(vec![Number(2), Number(3), Number(4),])
                ]),
                right: List(vec![List(vec![Number(1)]), Number(4),]),
            }
        );
    }

    fn packet(string: &str) -> PacketValue {
        PacketValue::from_string(string).expect("Should be parsable as packet value")
    }

    #[test]
    fn test_cmp() {
        assert_eq!(Number(1).cmp(&Number(1)), Ordering::Equal);
        assert_eq!(Number(3).cmp(&Number(5)), Ordering::Less);
        assert_eq!(Number(9).cmp(&Number(8)), Ordering::Greater);

        assert_eq!(packet("[1]").cmp(&packet("[1]")), Ordering::Equal);
        println!("1");
        assert_eq!(packet("[2,3,4]").cmp(&packet("[4]")), Ordering::Less);
        println!("2 {:?}", packet("4"));
        assert_eq!(packet("[2,3,4]").cmp(&packet("4")), Ordering::Less);
        println!("3");
        assert_eq!(packet("[9]").cmp(&packet("[[8,7,6]]")), Ordering::Greater);
        println!("4");
        assert_eq!(packet("[4,4]").cmp(&packet("[4,4]")), Ordering::Equal);
        assert_eq!(packet("[4,4]").cmp(&packet("[4,4,4]")), Ordering::Less);
    }

    #[test]
    fn test_is_in_right_order() {
        let pairs = parse_input(EXAMPLE_INPUT.trim());

        assert_eq!(pairs[0].is_in_right_order(), true);
        assert_eq!(pairs[1].is_in_right_order(), true);
        assert_eq!(pairs[2].is_in_right_order(), false);
        assert_eq!(pairs[3].is_in_right_order(), true);
        assert_eq!(pairs[4].is_in_right_order(), false);
        assert_eq!(pairs[5].is_in_right_order(), true);
        assert_eq!(pairs[6].is_in_right_order(), false);
        assert_eq!(pairs[7].is_in_right_order(), false);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 13);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 5882);
    }
}
