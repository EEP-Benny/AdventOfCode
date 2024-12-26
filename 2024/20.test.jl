include("20.jl")
using Test

example_input = """
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############"""

@testset "prepare_input" begin
    @test prepare_input(example_input).start_pos == (2, 4)
    @test prepare_input(example_input).end_pos == (6, 8)
end

@testset "find_path" begin
    @test length(find_path(prepare_input(example_input))) - 1 == 84
end

@testset "find_cheats" begin
    cheats = find_cheats(find_path(prepare_input(example_input)))
    @test count(==(2), cheats) == 14
    @test count(==(4), cheats) == 14
    @test count(==(6), cheats) == 2
    @test count(==(8), cheats) == 4
    @test count(==(10), cheats) == 2
    @test count(==(12), cheats) == 3
    @test count(==(20), cheats) == 1
    @test count(==(36), cheats) == 1
    @test count(==(38), cheats) == 1
    @test count(==(40), cheats) == 1
    @test count(==(64), cheats) == 1
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 0
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=20, year=2024))
    @test part1(input) === 1530
    @test part2(input) === nothing
end