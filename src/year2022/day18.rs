use crate::utils::{get_input, Splittable};
use std::{collections::HashSet, hash::Hash, ops::Add};

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
struct Position3D {
    x: i32,
    y: i32,
    z: i32,
}

impl Position3D {
    fn new(x: i32, y: i32, z: i32) -> Self {
        Self { x, y, z }
    }
}

impl Add<Position3D> for Position3D {
    fn add(self, rhs: Position3D) -> Self::Output {
        Position3D {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
        }
    }

    type Output = Position3D;
}

impl Add<&Position3D> for &Position3D {
    fn add(self, rhs: &Position3D) -> Self::Output {
        Position3D {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
        }
    }

    type Output = Position3D;
}

#[derive(Debug, PartialEq)]
struct Droplet {
    voxels: HashSet<Position3D>,
}

impl Droplet {
    fn from_input(input: &str) -> Self {
        let voxels = input
            .lines()
            .map(|position_string| {
                let num_vec = position_string.split_to_numbers(",");
                Position3D::new(num_vec[0] as i32, num_vec[1] as i32, num_vec[2] as i32)
            })
            .collect();
        Self { voxels }
    }

    fn get_surface_area(&self) -> u32 {
        let mut surface_count = 0;
        for voxel in &self.voxels {
            for direction in [
                Position3D::new(-1, 0, 0),
                Position3D::new(1, 0, 0),
                Position3D::new(0, -1, 0),
                Position3D::new(0, 1, 0),
                Position3D::new(0, 0, -1),
                Position3D::new(0, 0, 1),
            ] {
                if !self.voxels.contains(&(voxel + &direction)) {
                    surface_count += 1;
                }
            }
        }
        surface_count
    }
}

fn part1(input: &str) -> u32 {
    Droplet::from_input(input).get_surface_area()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 18))
}

#[cfg(test)]
mod tests {

    use super::*;

    const EXAMPLE_INPUT_SMALL: &str = "1,1,1\n2,1,1";
    const EXAMPLE_INPUT_LARGER: &str = "
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5";

    #[test]
    fn test_droplet_from_string() {
        assert_eq!(
            Droplet::from_input(EXAMPLE_INPUT_SMALL),
            Droplet {
                voxels: HashSet::from([Position3D::new(1, 1, 1), Position3D::new(2, 1, 1)])
            }
        );
    }

    #[test]
    fn test_surface_area() {
        assert_eq!(
            Droplet::from_input(EXAMPLE_INPUT_SMALL).get_surface_area(),
            10
        );
        assert_eq!(
            Droplet::from_input(EXAMPLE_INPUT_LARGER.trim()).get_surface_area(),
            64
        );
    }

    #[test]
    fn test_parts() {
        assert_eq!(part1(EXAMPLE_INPUT_LARGER.trim()), 64);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 3466);
    }
}
