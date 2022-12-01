use std::fs;

pub fn get_input(year: u32, day: u32) -> String {
    let filename = format!("src/year{year:04}/day{day:02}.input.txt");
    fs::read_to_string(&filename)
        .expect(&format!("Input file {filename} should be present"))
        .trim()
        .to_string()
}

pub trait Splittable {
    fn split_to_strings(&self, separator: &str) -> Vec<String>;
    fn split_to_numbers(&self, separator: &str) -> Vec<u32>;
}

impl Splittable for str {
    fn split_to_strings(&self, separator: &str) -> Vec<String> {
        self.split(separator).map(String::from).collect()
    }

    fn split_to_numbers(&self, separator: &str) -> Vec<u32> {
        self.split(separator)
            .map(|split| {
                split
                    .to_string()
                    .parse()
                    .expect("Input should consist of numbers")
            })
            .collect()
    }
}
