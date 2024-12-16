include("16.jl")
using Test

example_input_1 = """
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############"""

example_input_2 = """
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################"""


@testset "find_best_path" begin
    @test find_best_path(prepare_input(example_input_1)) == (7036, 45)
    @test find_best_path(prepare_input(example_input_2)) == (11048, 64)
end

@testset "Example Input" begin
    input = prepare_input(example_input_1)
    @test part1(input) === 7036
    @test part2(input) === 45
end

@testset "Real input" begin
    input = prepare_input(get_input(day=16, year=2024))
    @test part1(input) === 135512
    @test part2(input) === 541
end