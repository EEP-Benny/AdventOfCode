use std::collections::{BTreeSet, HashMap, HashSet};

use lazy_static::lazy_static;
use regex::Regex;

use crate::utils::{get_input, Splittable};

type ValveName = String;

#[derive(Debug, PartialEq, Eq, Hash)]
struct Valve {
    flow_rate: u32,
    next_valves: Vec<ValveName>,
}

impl Valve {
    fn new(flow_rate: u32, next_valves: Vec<ValveName>) -> Self {
        Self {
            flow_rate,
            next_valves,
        }
    }

    fn from_string(input: &str) -> Option<(ValveName, Self)> {
        lazy_static! {
            static ref RE: Regex = Regex::new(
                r"^Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z, ]+)$"
            )
            .unwrap();
        }
        let captures = RE.captures(input)?;
        let valve_name = captures[1].to_string();
        let flow_rate = captures[2].parse().ok()?;
        let next_valves = captures[3].split_to_strings(", ");
        Some((
            valve_name,
            Self {
                flow_rate,
                next_valves,
            },
        ))
    }
}

#[derive(Debug, PartialEq)]
struct DistanceMap {
    distances: HashMap<(ValveName, ValveName), u32>,
    flow_rates_of_relevant_valves: HashMap<ValveName, u32>,
}

impl DistanceMap {
    fn from_input(input: &str) -> Self {
        let valve_map = parse_input(input);
        let flow_rates_of_relevant_valves: HashMap<ValveName, u32> = valve_map
            .iter()
            .filter(|(_, valve)| valve.flow_rate > 0)
            .map(|(valve_name, valve)| (valve_name.clone(), valve.flow_rate))
            .collect();
        let mut distances: HashMap<(ValveName, ValveName), u32> = HashMap::new();

        for start_valve in flow_rates_of_relevant_valves
            .keys()
            .chain([&"AA".to_string()])
        {
            let mut valves_for_next_round = vec![start_valve];
            let mut round_number = 0;
            while !valves_for_next_round.is_empty() {
                let valves_for_this_round = valves_for_next_round;
                valves_for_next_round = vec![];
                for current_valve in valves_for_this_round {
                    let key = (start_valve.clone(), current_valve.clone());
                    if !distances.contains_key(&key) {
                        distances.insert(key, round_number);
                        for next_valve in &valve_map.get(current_valve).unwrap().next_valves {
                            valves_for_next_round.push(next_valve);
                        }
                    }
                }
                round_number += 1;
            }
        }

        // remove all irrelevant distances
        distances.retain(|(valve_name1, valve_name2), _| {
            valve_name1 != valve_name2
                && (flow_rates_of_relevant_valves.contains_key(valve_name1) || valve_name1 == "AA")
                && flow_rates_of_relevant_valves.contains_key(valve_name2)
        });

        Self {
            distances,
            flow_rates_of_relevant_valves,
        }
    }

    fn get_relevant_valves(&self) -> Vec<ValveName> {
        self.flow_rates_of_relevant_valves
            .keys()
            .map(String::clone)
            .into_iter()
            .collect()
    }

    fn get_flow_rate_of(&self, valve: &ValveName) -> u32 {
        *self.flow_rates_of_relevant_valves.get(valve).unwrap()
    }

    fn get_distance_between(&self, valve1: &ValveName, valve2: &ValveName) -> u32 {
        *self
            .distances
            .get(&(valve1.to_string(), valve2.to_string()))
            .unwrap()
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone)]
struct State {
    current_position: ValveName,
    /// valves that are still closed and have flow rate > 0
    remaining_valves: BTreeSet<ValveName>,
}

#[derive(Debug, PartialEq)]
struct StateValue {
    minutes_remaining: u32,
    /// pressure relieved by all opened valves until the time runs out (this only changes if a new valve is opened)
    pressure_relieve_by_opened_valves: u32,
}

fn find_maximum_pressure_relief(distance_map: &DistanceMap) -> u32 {
    let mut state_values: HashMap<State, StateValue> = HashMap::from([(
        State {
            current_position: "AA".to_string(),
            remaining_valves: BTreeSet::from_iter(distance_map.get_relevant_valves()),
        },
        StateValue {
            minutes_remaining: 30,
            pressure_relieve_by_opened_valves: 0,
        },
    )]);
    let mut states_for_next_round = HashSet::from([State {
        current_position: "AA".to_string(),
        remaining_valves: BTreeSet::from_iter(distance_map.get_relevant_valves()),
    }]);
    while !states_for_next_round.is_empty() {
        let states_for_this_round = states_for_next_round;
        states_for_next_round = HashSet::new();

        // println!(
        //     "{} states for this round, {} rounds to go",
        //     states_for_this_round.len(),
        //     states_for_this_round
        //         .iter()
        //         .next()
        //         .unwrap()
        //         .remaining_valves
        //         .len()
        // );

        for current_state in states_for_this_round {
            let StateValue {
                minutes_remaining,
                pressure_relieve_by_opened_valves,
            } = *state_values.get(&current_state).unwrap();
            for next_valve in current_state.remaining_valves.iter() {
                let distance =
                    distance_map.get_distance_between(&current_state.current_position, &next_valve);
                let new_minutes_remaining = minutes_remaining.saturating_sub(distance + 1);
                if new_minutes_remaining == 0 {
                    continue;
                }
                let flow_rate_of_next_valve = distance_map.get_flow_rate_of(next_valve);
                let new_pressure_relieve_by_opened_valves = pressure_relieve_by_opened_valves
                    + new_minutes_remaining * flow_rate_of_next_valve;

                let mut remaining_valves = current_state.remaining_valves.clone();
                remaining_valves.remove(next_valve);
                let next_state = State {
                    current_position: next_valve.clone(),
                    remaining_valves,
                };
                if let Some(already_present_state_value) = state_values.get(&next_state) {
                    if already_present_state_value.pressure_relieve_by_opened_valves
                        > new_pressure_relieve_by_opened_valves
                    {
                        if already_present_state_value.minutes_remaining < new_minutes_remaining {
                            // println!(
                            //     "Not sure what is better... {:?} vs. {:?}",
                            //     already_present_state_value,
                            //     StateValue {
                            //         minutes_remaining: new_minutes_remaining,
                            //         pressure_relieve_by_opened_valves:
                            //             new_pressure_relieve_by_opened_valves,
                            //     }
                            // );
                        }
                        continue;
                    }
                }
                state_values.insert(
                    next_state.clone(),
                    StateValue {
                        minutes_remaining: new_minutes_remaining,
                        pressure_relieve_by_opened_valves: new_pressure_relieve_by_opened_valves,
                    },
                );
                states_for_next_round.insert(next_state);
            }
        }
    }

    state_values
        .values()
        .map(|state_value| state_value.pressure_relieve_by_opened_valves)
        .max()
        .unwrap()
}

fn parse_input(input: &str) -> HashMap<ValveName, Valve> {
    HashMap::from_iter(
        input
            .lines()
            .map(|line| Valve::from_string(line).expect("Input lines should be parsable")),
    )
}

fn part1(input: &str) -> u32 {
    find_maximum_pressure_relief(&DistanceMap::from_input(input))
}

fn part2(input: &str) -> u32 {
    0
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 16))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 16))
}

#[cfg(test)]
mod tests {
    use std::vec;

    use super::*;

    const EXAMPLE_INPUT: &str = "
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
";

    #[test]
    fn test_parse_input() {
        let valve_map = parse_input(EXAMPLE_INPUT.trim());
        assert_eq!(valve_map.len(), 10);
        assert_eq!(
            valve_map.get(&"AA".to_string()),
            Some(&Valve::new(
                0,
                vec!["DD".to_string(), "II".to_string(), "BB".to_string()]
            ))
        );
        assert_eq!(
            valve_map.get(&"HH".to_string()),
            Some(&Valve::new(22, vec!["GG".to_string(),]))
        );
    }

    #[test]
    fn test_distance_map() {
        dbg!(DistanceMap::from_input(EXAMPLE_INPUT.trim()));
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 1651);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 0);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 1871);
        assert_eq!(solution2(), 0);
    }
}
