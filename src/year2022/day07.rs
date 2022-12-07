use std::{collections::HashMap, vec};

use crate::utils::{get_input, Splittable};

#[derive(Debug, PartialEq)]
enum Entry {
    File { size: u32 },
    Directory { content: Vec<String> },
}

impl Entry {
    fn file(size: u32) -> Entry {
        Entry::File { size }
    }

    fn dir() -> Entry {
        Entry::Directory { content: vec![] }
    }
}

#[derive(Debug, PartialEq)]
struct FileSystem {
    all_entries: HashMap<String, Entry>,
    cwd_stack: Vec<String>,
}

impl FileSystem {
    fn from_input_string(input_string: &str) -> Self {
        let mut file_system = Self {
            all_entries: HashMap::from([("".to_string(), Entry::dir())]),
            cwd_stack: vec!["/".to_string()],
        };
        for command_and_parameters in input_string.split_to_strings("$ ") {
            match command_and_parameters.trim().split_once([' ', '\n']) {
                Some(("cd", new_directory)) => file_system.change_directory(new_directory),
                Some(("ls", output)) => file_system.add_directory_contents(output),
                _ => continue,
            }
        }

        file_system
    }

    fn cwd(self: &Self) -> String {
        self.cwd_stack
            .last()
            .expect("cwd_stack should not be empty")
            .to_string()
    }

    fn size_of(self: &Self, name: &str) -> u32 {
        match self.all_entries.get(name) {
            Some(Entry::Directory { content }) => content
                .iter()
                .map(|child_name| self.size_of(child_name))
                .sum(),
            Some(Entry::File { size }) => *size,
            None => {
                let all_keys = self.all_entries.keys();
                panic!("Couldn't find entry {} in {:?}", name, all_keys);
            }
        }
    }

    fn add_directory_contents(self: &mut Self, output: &str) {
        for string_entry in output.lines() {
            let (name, entry) = match string_entry.split_once(" ") {
                Some(("dir", name)) => (name, Entry::dir()),
                Some((size, name)) => {
                    (name, Entry::file(size.parse().expect("Should be a number")))
                }
                _ => continue,
            };
            let cwd = self.cwd();
            let key = format!("{cwd}/{name}");
            assert!(
                !self.all_entries.contains_key(&key),
                "entry {} already exist",
                key
            );
            self.all_entries.insert(key.to_string(), entry);
            if let Some(Entry::Directory { content }) = self.all_entries.get_mut(&cwd) {
                content.push(key);
            }
        }
    }

    fn change_directory(self: &mut Self, new_directory: &str) {
        match new_directory {
            "/" => {
                self.cwd_stack = vec!["".to_string()];
            }
            ".." => {
                self.cwd_stack.pop();
            }
            _ => {
                let cwd = self.cwd();
                self.cwd_stack.push(format!("{cwd}/{new_directory}"));
            }
        }
    }
}

fn part1(input: &str) -> u32 {
    let file_system = FileSystem::from_input_string(input);
    let directory_sizes: Vec<u32> = file_system
        .all_entries
        .iter()
        .filter_map(|(name, entry)| match entry {
            Entry::Directory { .. } => Some(file_system.size_of(name)),
            _ => None,
        })
        .collect();
    directory_sizes.iter().filter(|size| size <= &&100000).sum()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 07))
}

#[cfg(test)]
mod tests {
    use super::*;

    const EXAMPLE_INPUT: &str = "
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
";

    #[test]
    fn test_size_of() {
        let file_system = FileSystem::from_input_string(EXAMPLE_INPUT);
        assert_eq!(file_system.size_of("/b.txt"), 14848514);
        assert_eq!(file_system.size_of("/a/e"), 584);
        assert_eq!(file_system.size_of("/a"), 94853);
        assert_eq!(file_system.size_of("/d"), 24933642);
        assert_eq!(file_system.size_of(""), 48381165); // root is represented as an empty string here
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT.trim()), 95437);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 1908462);
    }
}
