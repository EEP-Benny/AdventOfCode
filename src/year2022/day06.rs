use std::collections::HashSet;

use crate::utils::get_input;

fn is_start_of_packet_marker(substr: &str) -> bool {
    let substr_as_vec: Vec<char> = substr.chars().collect();
    let set: HashSet<&char> = HashSet::from_iter(substr_as_vec.iter());
    return set.len() == substr_as_vec.len(); // all characters different
}

fn find_position_of_first_start_of_packet_marker(input: &str) -> u32 {
    for i in 4..input.len() {
        let substr = &input[i - 4..i];
        if is_start_of_packet_marker(&substr) {
            return i as u32;
        };
    }
    panic!("Didn't find a start-of-packet-marker");
}

fn find_position_of_first_start_of_message_marker(input: &str) -> u32 {
    for i in 14..input.len() {
        let substr = &input[i - 14..i];
        if is_start_of_packet_marker(&substr) {
            return i as u32;
        };
    }
    panic!("Didn't find a start-of-message-marker");
}

pub fn solution1() -> u32 {
    find_position_of_first_start_of_packet_marker(&get_input(2022, 06))
}

pub fn solution2() -> u32 {
    find_position_of_first_start_of_message_marker(&get_input(2022, 06))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_start_of_packet_marker() {
        assert_eq!(is_start_of_packet_marker("mjqj"), false);
        assert_eq!(is_start_of_packet_marker("jpqm"), true);
    }

    #[test]
    fn test_find_position_of_first_start_of_packet_marker() {
        assert_eq!(
            find_position_of_first_start_of_packet_marker("mjqjpqmgbljsphdztnvjfqwrcgsmlb"),
            7
        );
        assert_eq!(
            find_position_of_first_start_of_packet_marker("bvwbjplbgvbhsrlpgdmjqwftvncz"),
            5
        );
        assert_eq!(
            find_position_of_first_start_of_packet_marker("nppdvjthqldpwncqszvftbrmjlhg"),
            6
        );
        assert_eq!(
            find_position_of_first_start_of_packet_marker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"),
            10
        );
        assert_eq!(
            find_position_of_first_start_of_packet_marker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"),
            11
        );
    }
    #[test]
    fn test_find_position_of_first_start_of_message_marker() {
        assert_eq!(
            find_position_of_first_start_of_message_marker("mjqjpqmgbljsphdztnvjfqwrcgsmlb"),
            19
        );
        assert_eq!(
            find_position_of_first_start_of_message_marker("bvwbjplbgvbhsrlpgdmjqwftvncz"),
            23
        );
        assert_eq!(
            find_position_of_first_start_of_message_marker("nppdvjthqldpwncqszvftbrmjlhg"),
            23
        );
        assert_eq!(
            find_position_of_first_start_of_message_marker("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"),
            29
        );
        assert_eq!(
            find_position_of_first_start_of_message_marker("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"),
            26
        );
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 1356);
        assert_eq!(solution2(), 2564);
    }
}
