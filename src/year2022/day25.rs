use core::panic;

use crate::utils::get_input;

fn snafu_to_decimal(snafu: &str) -> i64 {
    let mut decimal = 0i64;
    for digit in snafu.chars() {
        decimal *= 5;
        decimal += match digit {
            '0' => 0,
            '1' => 1,
            '2' => 2,
            '-' => -1,
            '=' => -2,
            _ => panic!("Unrecognized digit {digit}"),
        }
    }
    decimal
}

fn decimal_to_snafu(decimal: i64) -> String {
    let mut snafu = String::new();
    let mut decimal = decimal;
    while decimal > 0 {
        let remainder = (decimal + 2) % 5 - 2;
        snafu.insert(
            0,
            match remainder {
                0 => '0',
                1 => '1',
                2 => '2',
                -1 => '-',
                -2 => '=',
                _ => panic!("unexpected remainder {remainder}"),
            },
        );
        decimal = (decimal + 2) / 5;
    }
    snafu
}

fn part1(input: &str) -> String {
    decimal_to_snafu(input.lines().map(snafu_to_decimal).sum::<i64>())
}

pub fn solution1() -> String {
    part1(&get_input(2022, 25))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
";

    #[test]
    fn test_snafu_to_decimal() {
        assert_eq!(snafu_to_decimal("1=-0-2"), 1747);
        assert_eq!(snafu_to_decimal("12111"), 906);
        assert_eq!(snafu_to_decimal("2=0="), 198);
        assert_eq!(snafu_to_decimal("21"), 11);
        assert_eq!(snafu_to_decimal("2=01"), 201);
        assert_eq!(snafu_to_decimal("111"), 31);
        assert_eq!(snafu_to_decimal("20012"), 1257);
        assert_eq!(snafu_to_decimal("112"), 32);
        assert_eq!(snafu_to_decimal("1=-1="), 353);
        assert_eq!(snafu_to_decimal("1-12"), 107);
        assert_eq!(snafu_to_decimal("12"), 7);
        assert_eq!(snafu_to_decimal("1="), 3);
        assert_eq!(snafu_to_decimal("122"), 37);
    }

    #[test]
    fn test_decimal_to_snafu() {
        assert_eq!(decimal_to_snafu(1), "1".to_string());
        assert_eq!(decimal_to_snafu(2), "2".to_string());
        assert_eq!(decimal_to_snafu(3), "1=".to_string());
        assert_eq!(decimal_to_snafu(4), "1-".to_string());
        assert_eq!(decimal_to_snafu(5), "10".to_string());
        assert_eq!(decimal_to_snafu(6), "11".to_string());
        assert_eq!(decimal_to_snafu(7), "12".to_string());
        assert_eq!(decimal_to_snafu(8), "2=".to_string());
        assert_eq!(decimal_to_snafu(9), "2-".to_string());
        assert_eq!(decimal_to_snafu(10), "20".to_string());
        assert_eq!(decimal_to_snafu(15), "1=0".to_string());
        assert_eq!(decimal_to_snafu(20), "1-0".to_string());
        assert_eq!(decimal_to_snafu(2022), "1=11-2".to_string());
        assert_eq!(decimal_to_snafu(12345), "1-0---0".to_string());
        assert_eq!(decimal_to_snafu(314159265), "1121-1110-1=0".to_string());
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), "2=-1=0".to_string());
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), "20=02=120-=-2110-0=1");
    }
}
