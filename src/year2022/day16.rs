use std::{
    cmp::Ordering,
    collections::{BinaryHeap, HashMap, HashSet},
};

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

type ValveMap = HashMap<ValveName, Valve>;

#[derive(Debug, PartialEq, Eq)]
struct State {
    /// the valve we were coming from
    last_valve: ValveName,
    current_valve: ValveName,
    minutes_remaining: u32,
    /// valves that are still closed and have flow rate > 0
    remaining_valves: HashSet<ValveName>,
    // sum of the flow rate of all remaining valves
    remaining_pressure_per_minute_potential: u32,
    // pressure relieved by all opened valves until the time runs out (this only changes if a new valve is opened)
    pressure_relieve_by_opened_valves: u32,
}

// The priority queue depends on `Ord`.
impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        self.get_best_case_pressure_relieve()
            .cmp(&other.get_best_case_pressure_relieve())
    }
}

// `PartialOrd` needs to be implemented as well.
impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl State {
    fn get_best_case_pressure_relieve(&self) -> u32 {
        self.pressure_relieve_by_opened_valves
            + self.minutes_remaining * self.remaining_pressure_per_minute_potential
    }

    fn open_valve(&self, valve: &Valve) -> Self {
        let flow_rate = valve.flow_rate;

        let minutes_remaining = self.minutes_remaining - 1;

        let mut remaining_valves = self.remaining_valves.clone();
        remaining_valves.remove(&self.current_valve);

        let remaining_pressure_per_minute_potential =
            self.remaining_pressure_per_minute_potential - flow_rate;

        let pressure_relieve_by_opened_valves =
            self.pressure_relieve_by_opened_valves + flow_rate * minutes_remaining;

        Self {
            last_valve: self.current_valve.clone(),
            current_valve: self.current_valve.clone(),
            minutes_remaining,
            remaining_valves,
            remaining_pressure_per_minute_potential,
            pressure_relieve_by_opened_valves,
        }
    }

    fn go_to_valve(&self, valve_name: &ValveName) -> Self {
        Self {
            last_valve: self.current_valve.clone(),
            current_valve: valve_name.clone(),
            minutes_remaining: self.minutes_remaining - 1,
            remaining_valves: self.remaining_valves.clone(),
            remaining_pressure_per_minute_potential: self.remaining_pressure_per_minute_potential,
            pressure_relieve_by_opened_valves: self.pressure_relieve_by_opened_valves,
        }
    }
}

#[derive(Debug)]
struct ExplorationState {
    valve_map: ValveMap,
    states_to_explore_next: BinaryHeap<State>,
}

impl ExplorationState {
    fn new(valve_map: ValveMap) -> Self {
        let start_state = State {
            minutes_remaining: 30,
            last_valve: "".to_string(),
            current_valve: "AA".to_string(),
            pressure_relieve_by_opened_valves: 0,
            remaining_pressure_per_minute_potential: valve_map
                .iter()
                .map(|(_, valve)| valve.flow_rate)
                .sum(),
            remaining_valves: valve_map
                .iter()
                .filter(|(_, valve)| valve.flow_rate > 0)
                .map(|(valve_name, _)| valve_name.clone())
                .collect(),
        };
        Self {
            valve_map,
            states_to_explore_next: BinaryHeap::from([start_state]),
        }
    }

    fn single_step(&mut self) {
        let state = self
            .states_to_explore_next
            .pop()
            .expect("There should be something to explore until the time runs out");
        let valve = &self.valve_map.get(&state.current_valve).unwrap();
        if state.remaining_valves.contains(&state.current_valve) {
            self.states_to_explore_next.push(state.open_valve(valve));
        }
        for valve_name in &valve.next_valves {
            if valve_name != &state.last_valve {
                self.states_to_explore_next
                    .push(state.go_to_valve(valve_name))
            }
        }
    }

    fn find_maximum_pressure_relief(&mut self) -> Option<u32> {
        let mut loop_count = 1;
        loop {
            let next_state = self.states_to_explore_next.peek()?;
            if next_state.minutes_remaining <= 0 {
                println!("Final state: {:?}", next_state);
                return Some(next_state.pressure_relieve_by_opened_valves);
            }
            loop_count += 1;
            if loop_count % 10000 == 0 {
                println!(
                    "After step {}: {} states to consider. Next state: {:?}",
                    loop_count,
                    self.states_to_explore_next.len(),
                    next_state
                )
            }
            self.single_step();
        }
    }
}

fn parse_input(input: &str) -> ValveMap {
    ValveMap::from_iter(
        input
            .lines()
            .map(|line| Valve::from_string(line).expect("Input lines should be parsable")),
    )
}

fn part1(input: &str) -> u32 {
    ExplorationState::new(parse_input(input))
        .find_maximum_pressure_relief()
        .expect("There should be a solution")
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

    fn str_to_hash_set(string: &str) -> HashSet<String> {
        string
            .split_to_strings(",")
            .iter()
            .map(String::clone)
            .collect()
    }

    #[test]
    fn test_exploration_state() {
        let valve_map = parse_input(EXAMPLE_INPUT.trim());
        let mut exploration_state = ExplorationState::new(valve_map);
        assert_eq!(exploration_state.states_to_explore_next.len(), 1);
        assert_eq!(
            exploration_state.states_to_explore_next.peek(),
            Some(&State {
                last_valve: "".to_string(),
                current_valve: "AA".to_string(),
                minutes_remaining: 30,
                remaining_valves: str_to_hash_set("BB,CC,DD,EE,HH,JJ"),
                remaining_pressure_per_minute_potential: 81,
                pressure_relieve_by_opened_valves: 0
            })
        );

        exploration_state.single_step();

        assert_eq!(exploration_state.states_to_explore_next.len(), 3);
        assert_eq!(
            exploration_state.states_to_explore_next.peek(),
            Some(&State {
                last_valve: "AA".to_string(),
                current_valve: "DD".to_string(),
                minutes_remaining: 29,
                remaining_valves: str_to_hash_set("BB,CC,DD,EE,HH,JJ"),
                remaining_pressure_per_minute_potential: 81,
                pressure_relieve_by_opened_valves: 0
            })
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 1651);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 0);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 0);
        assert_eq!(solution2(), 0);
    }
}
