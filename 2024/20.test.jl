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

    cheats20 = find_cheats(find_path(prepare_input(example_input)), 20)
    @test count(==(50), cheats20) == 32
    @test count(==(52), cheats20) == 31
    @test count(==(54), cheats20) == 29
    @test count(==(56), cheats20) == 39
    @test count(==(58), cheats20) == 25
    @test count(==(60), cheats20) == 23
    @test count(==(62), cheats20) == 20
    @test count(==(64), cheats20) == 19
    @test count(==(66), cheats20) == 12
    @test count(==(68), cheats20) == 14
    @test count(==(70), cheats20) == 12
    @test count(==(72), cheats20) == 22
    @test count(==(74), cheats20) == 4
    @test count(==(76), cheats20) == 3
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 0
    @test part2(input) === 0
end

@testset "Real input" begin
    input = prepare_input(get_input(day=20, year=2024))
    @test part1(input) === 1530
    @test part2(input) === 1033983
end