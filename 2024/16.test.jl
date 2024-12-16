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


@testset "get_score_of_best_path" begin
    @test get_score_of_best_path(prepare_input(example_input_1)) == 7036
    @test get_score_of_best_path(prepare_input(example_input_2)) == 11048
end

@testset "Example Input" begin
    input = prepare_input(example_input_1)
    @test part1(input) === 7036
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=16, year=2024))
    @test part1(input) === 135512
    @test part2(input) === nothing
end