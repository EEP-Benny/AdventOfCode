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

    fn get_neighbors(&self) -> [Position3D; 6] {
        [
            Position3D::new(self.x - 1, self.y, self.z),
            Position3D::new(self.x + 1, self.y, self.z),
            Position3D::new(self.x, self.y - 1, self.z),
            Position3D::new(self.x, self.y + 1, self.z),
            Position3D::new(self.x, self.y, self.z - 1),
            Position3D::new(self.x, self.y, self.z + 1),
        ]
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
            for neighbor in voxel.get_neighbors() {
                if !self.voxels.contains(&neighbor) {
                    surface_count += 1;
                }
            }
        }
        surface_count
    }

    fn get_outer_surface_area(&self) -> u32 {
        let min_x = self.voxels.iter().map(|pos| pos.x).min().unwrap() - 1;
        let max_x = self.voxels.iter().map(|pos| pos.x).max().unwrap() + 1;
        let min_y = self.voxels.iter().map(|pos| pos.y).min().unwrap() - 1;
        let max_y = self.voxels.iter().map(|pos| pos.y).max().unwrap() + 1;
        let min_z = self.voxels.iter().map(|pos| pos.z).min().unwrap() - 1;
        let max_z = self.voxels.iter().map(|pos| pos.z).max().unwrap() + 1;

        let mut surface_count = 0;

        let mut steam_voxels = HashSet::<Position3D>::new();
        let mut positions_to_expand = vec![Position3D::new(min_x, min_y, min_z)];

        while let Some(position) = positions_to_expand.pop() {
            for neighbor in position.get_neighbors() {
                if steam_voxels.contains(&neighbor)
                    || (neighbor.x < min_x || neighbor.x > max_x)
                    || (neighbor.y < min_y || neighbor.y > max_y)
                    || (neighbor.z < min_z || neighbor.z > max_z)
                {
                    continue;
                }
                if self.voxels.contains(&neighbor) {
                    surface_count += 1;
                    continue;
                }
                steam_voxels.insert(neighbor);
                positions_to_expand.push(neighbor);
            }
        }

        surface_count
    }
}

fn part1(input: &str) -> u32 {
    Droplet::from_input(input).get_surface_area()
}

fn part2(input: &str) -> u32 {
    Droplet::from_input(input).get_outer_surface_area()
}

pub fn solution1() -> u32 {
    part1(&get_input(2022, 18))
}

pub fn solution2() -> u32 {
    part2(&get_input(2022, 18))
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
        assert_eq!(part2(EXAMPLE_INPUT_LARGER.trim()), 58);
    }

    #[test]
    fn test_solutions() {
        assert_eq!(solution1(), 3466);
        assert_eq!(solution2(), 2012);
    }
}
