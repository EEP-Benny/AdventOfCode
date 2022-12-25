use crate::utils::get_input;

#[derive(Debug, PartialEq)]
struct Node {
    value: i64,
    left_index: usize,
    right_index: usize,
}

impl Node {
    fn new(value: i64, left_index: usize, right_index: usize) -> Self {
        Self {
            value,
            left_index,
            right_index,
        }
    }
}

#[derive(Debug, PartialEq)]
struct List {
    nodes: Vec<Node>,
    len: usize,
}

impl List {
    fn from_input(input: &str, decryption_key: i64) -> Self {
        let numbers: Vec<i64> = input
            .lines()
            .map(|line| line.parse::<i64>().unwrap() * decryption_key)
            .collect();
        let len = numbers.len();
        let nodes = numbers
            .iter()
            .enumerate()
            .map(|(i, number)| Node {
                value: *number,
                left_index: if i == 0 { len - 1 } else { i - 1 },
                right_index: (i + 1) % len,
            })
            .collect();
        Self { nodes, len }
    }

    fn value_at(&self, index: usize) -> i64 {
        self.nodes[index].value
    }

    fn to_vec(&self) -> Vec<i64> {
        let mut vec = Vec::with_capacity(self.len);
        let mut current_index = 0;
        for _ in 0..self.len {
            vec.push(self.nodes[current_index].value);
            current_index = self.nodes[current_index].right_index;
        }
        vec
    }

    fn step(&self, index: usize, step: i64) -> usize {
        let mut current_index = index;
        let len = self.len as i64;
        if step > 0 {
            for _ in 0..(step % len) {
                current_index = self.nodes[current_index].right_index;
            }
        } else if step < 0 {
            for _ in (step % len)..0 {
                current_index = self.nodes[current_index].left_index;
            }
        }
        current_index
    }

    fn move_index(&mut self, index: usize) {
        let Node {
            value,
            left_index,
            right_index,
        } = self.nodes[index];

        if value == 0 {
            return; // nothing to do
        }

        // find new position
        let step = value % (self.len as i64 - 1); // don't count our own position
        let insert_between_indices = if value > 0 {
            (self.step(index, step), self.step(index, step + 1))
        } else {
            (self.step(index, step - 1), self.step(index, step))
        };

        // remove from list
        self.nodes[left_index].right_index = right_index;
        self.nodes[right_index].left_index = left_index;

        // insert at new position
        self.nodes[index].left_index = insert_between_indices.0;
        self.nodes[index].right_index = insert_between_indices.1;
        self.nodes[insert_between_indices.0].right_index = index;
        self.nodes[insert_between_indices.1].left_index = index;
    }

    fn mix(&mut self) {
        for i in 0..self.len {
            // if i % 100 == 0 {
            //     println!("Moving index {i}...");
            // }
            self.move_index(i);
        }
    }

    fn get_grove_coordinates(&self) -> i64 {
        let zero_index = self.nodes.iter().position(|node| node.value == 0).unwrap();
        let index1000 = self.step(zero_index, 1000);
        let index2000 = self.step(zero_index, 2000);
        let index3000 = self.step(zero_index, 3000);

        self.nodes[index1000].value + self.nodes[index2000].value + self.nodes[index3000].value
    }
}

fn part1(input: &str) -> i64 {
    let mut list = List::from_input(input, 1);
    list.mix();
    list.get_grove_coordinates()
}

fn part2(input: &str) -> i64 {
    let mut list = List::from_input(input, 811589153);
    for _ in 0..10 {
        list.mix();
    }
    list.get_grove_coordinates()
}

pub fn solution1() -> i64 {
    part1(&get_input(2022, 20))
}

pub fn solution2() -> i64 {
    part2(&get_input(2022, 20))
}

#[cfg(test)]
mod tests {

    use std::time::Instant;

    use super::*;

    const EXAMPLE_INPUT: &str = "1\n2\n-3\n3\n-2\n0\n4";

    #[test]
    fn test_parse_input() {
        assert_eq!(
            List::from_input(EXAMPLE_INPUT, 1),
            List {
                nodes: vec![
                    Node::new(1, 6, 1),
                    Node::new(2, 0, 2),
                    Node::new(-3, 1, 3),
                    Node::new(3, 2, 4),
                    Node::new(-2, 3, 5),
                    Node::new(0, 4, 6),
                    Node::new(4, 5, 0),
                ],
                len: 7
            }
        )
    }

    #[test]
    fn test_move_index() {
        let mut list = List::from_input(EXAMPLE_INPUT, 1);
        assert_eq!(list.to_vec(), vec![1, 2, -3, 3, -2, 0, 4]);
        list.move_index(0);
        assert_eq!(list.to_vec(), vec![1, -3, 3, -2, 0, 4, 2]);
        list.move_index(1);
        assert_eq!(list.to_vec(), vec![1, -3, 2, 3, -2, 0, 4]);
        list.move_index(2);
        assert_eq!(list.to_vec(), vec![1, 2, 3, -2, -3, 0, 4]);
        list.move_index(3);
        assert_eq!(list.to_vec(), vec![1, 2, -2, -3, 0, 3, 4]);
        list.move_index(4);
        assert_eq!(list.to_vec(), vec![1, 2, -3, 0, 3, 4, -2]);
        list.move_index(5);
        assert_eq!(list.to_vec(), vec![1, 2, -3, 0, 3, 4, -2]);
        list.move_index(6);
        assert_eq!(list.to_vec(), vec![1, 2, -3, 4, 0, 3, -2]);
    }

    #[test]
    fn test_mix_with_decryption_key() {
        let mut list = List::from_input(EXAMPLE_INPUT, 811589153);
        assert_eq!(
            list.to_vec(),
            // initial arrangement
            vec![
                811589153,
                1623178306,
                -2434767459,
                2434767459,
                -1623178306,
                0,
                3246356612
            ]
        );

        list.mix();
        assert_eq!(
            list.to_vec(),
            // after 1 round of mixing
            vec![
                811589153,
                0,
                -2434767459,
                3246356612,
                -1623178306,
                2434767459,
                1623178306,
            ]
        );

        list.mix();
        assert_eq!(
            list.to_vec(),
            // after 2 rounds of mixing
            vec![
                811589153,
                0,
                2434767459,
                1623178306,
                3246356612,
                -2434767459,
                -1623178306,
            ]
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 3);
        assert_eq!(part2(EXAMPLE_INPUT.trim()), 1623178306);
    }

    #[test]
    fn test_solutions() {
        let start = Instant::now();
        assert_eq!(solution1(), 8372);
        let duration1 = start.elapsed();
        assert_eq!(solution2(), 7865110481723);
        let duration2 = start.elapsed() - duration1;
        println!(
            "Part 1 took {}ms, Part 2 took {}ms",
            duration1.as_millis(),
            duration2.as_millis(),
        );
    }
}
