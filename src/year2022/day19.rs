use std::{
    cmp::Ordering,
    collections::{BinaryHeap, HashSet},
    hash::Hash,
};

use lazy_static::lazy_static;
use regex::Regex;

use crate::utils::get_input;

enum RobotType {
    OreRobot,
    ClayRobot,
    ObsidianRobot,
    GeodeRobot,
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct State {
    amount_of_ore: u32,
    amount_of_clay: u32,
    amount_of_obsidian: u32,
    amount_of_geode: u32,
    number_of_ore_robots: u32,
    number_of_clay_robots: u32,
    number_of_obsidian_robots: u32,
    number_of_geode_robots: u32,
    minutes_remaining: u32,
}

impl State {
    fn get_score(&self) -> u32 {
        // geode we already have
        self.amount_of_geode 
            // geode we can mine with the robots we have
            + self.minutes_remaining * self.number_of_geode_robots 
            // geode we could mine with robots we could build if we have enough materials
            + (self.minutes_remaining * self.minutes_remaining - self.minutes_remaining) / 2
    }
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        self.get_score().cmp(&other.get_score())
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}


#[derive(Debug, PartialEq)]
struct Blueprint {
    blueprint_number: u32,
    ore_per_ore_robot: u32,
    ore_per_clay_robot: u32,
    ore_per_obsidian_robot: u32,
    clay_per_obsidian_robot: u32,
    ore_per_geode_robot: u32,
    obsidian_per_geode_robot: u32,
}

impl Blueprint {
    fn from_string(input: &str) -> Option<Self> {
        lazy_static! {
            static ref RE: Regex = Regex::new(
                r"^Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\.$"
            )
            .unwrap();
        }
        let captures: Vec<u32> = RE
            .captures(input)?
            .iter()
            .skip(1) // first capture is the full match
            .filter_map(|capture| capture?.as_str().parse().ok())
            .collect();
        Some(Self {
            blueprint_number: captures[0],
            ore_per_ore_robot: captures[1],
            ore_per_clay_robot: captures[2],
            ore_per_obsidian_robot: captures[3],
            clay_per_obsidian_robot: captures[4],
            ore_per_geode_robot: captures[5],
            obsidian_per_geode_robot: captures[6],
        })
    }

    fn find_maximum_number_of_geodes(&self) -> u32 {
        println!(
            "Finding maximum number of geodes for blueprint {}...",
            self.blueprint_number
        );
        let mut already_explored_states = HashSet::<State>::new();
        let mut states_to_explore_next = BinaryHeap::from([State {
            amount_of_ore: 0,
            amount_of_clay: 0,
            amount_of_obsidian: 0,
            amount_of_geode: 0,
            number_of_ore_robots: 1,
            number_of_clay_robots: 0,
            number_of_obsidian_robots: 0,
            number_of_geode_robots: 0,
            minutes_remaining: 24,
        }]);
        while let Some(state) = states_to_explore_next.pop() {
            if state.minutes_remaining <= 0 {
                return state.amount_of_geode;
            }
            if already_explored_states.contains(&state) {
                continue;
            }
            for robot_type in [
                RobotType::OreRobot,
                RobotType::ClayRobot,
                RobotType::ObsidianRobot,
                RobotType::GeodeRobot,
            ] {
                let mut next_state = state.clone();
                match robot_type {
                    RobotType::OreRobot => {
                        if state.amount_of_ore >= self.ore_per_ore_robot {
                            next_state.amount_of_ore -= self.ore_per_ore_robot;
                            next_state.number_of_ore_robots += 1;
                        }
                    }
                    RobotType::ClayRobot => {
                        if state.amount_of_ore >= self.ore_per_clay_robot {
                            next_state.amount_of_ore -= self.ore_per_clay_robot;
                            next_state.number_of_clay_robots += 1;
                        }
                    }
                    RobotType::ObsidianRobot => {
                        if state.amount_of_ore >= self.ore_per_obsidian_robot
                            && state.amount_of_clay >= self.clay_per_obsidian_robot
                        {
                            next_state.amount_of_ore -= self.ore_per_obsidian_robot;
                            next_state.amount_of_clay -= self.clay_per_obsidian_robot;
                            next_state.number_of_obsidian_robots += 1;
                        }
                    }
                    RobotType::GeodeRobot => {
                        if state.amount_of_ore >= self.ore_per_geode_robot
                            && state.amount_of_obsidian >= self.obsidian_per_geode_robot
                        {
                            next_state.amount_of_ore -= self.ore_per_geode_robot;
                            next_state.amount_of_obsidian -= self.obsidian_per_geode_robot;
                            next_state.number_of_geode_robots += 1;
                        }
                    }
                }
                next_state.amount_of_ore += state.number_of_ore_robots;
                next_state.amount_of_clay += state.number_of_clay_robots;
                next_state.amount_of_obsidian += state.number_of_obsidian_robots;
                next_state.amount_of_geode += state.number_of_geode_robots;
                next_state.minutes_remaining -= 1;

                states_to_explore_next.push(next_state);
            }
            already_explored_states.insert(state);
        }
        panic!("Emptied the heap before reaching 0 minutes");
    }

    fn get_quality_level(&self) -> u32 {
        self.blueprint_number * self.find_maximum_number_of_geodes()
    }
}

fn part1(input: &str) -> u32 {
    input
        .lines()
        .filter_map(Blueprint::from_string)
        .map(|blueprint| blueprint.get_quality_level())
        .sum()
}

fn part2(input: &str) -> u32 {
    0
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 19))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 19))
}

#[cfg(test)]
mod tests {

    use super::*;

    const EXAMPLE_INPUT: &str = "
Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
";

    #[test]
    fn test_find_maximum_number_of_geodes() {
        let blueprint = Blueprint::from_string("Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.").unwrap();
        assert_eq!(blueprint.find_maximum_number_of_geodes(), 9);
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 33);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 0);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 1382);
        assert_eq!(solution2(), 0);
    }
}
