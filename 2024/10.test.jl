include("10.jl")
using Test

example_input = """
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732"""

@testset "parse Grid" begin
    @test parse(
        Grid, """
                0123
                1234
                8765
                9876"""
    ) == [
        [0 1 2 3];
        [1 2 3 4];
        [8 7 6 5];
        [9 8 7 6]
    ]
end

@testset "get_trailhead_score" begin
    map = parse(Grid, example_input)
    @test get_trailhead_score((1, 3), map) == 5
    @test get_trailhead_score((1, 5), map) == 6
    @test get_trailhead_score((3, 5), map) == 5
    @test get_trailhead_score((5, 7), map) == 3
    @test get_trailhead_score((6, 3), map) == 1
    @test get_trailhead_score((6, 6), map) == 3
    @test get_trailhead_score((7, 1), map) == 5
    @test get_trailhead_score((7, 7), map) == 3
    @test get_trailhead_score((8, 2), map) == 5
end

@testset "get_trailhead_rating" begin
    map = parse(Grid, example_input)
    @test get_trailhead_rating((1, 3), map) == 20
    @test get_trailhead_rating((1, 5), map) == 24
    @test get_trailhead_rating((3, 5), map) == 10
    @test get_trailhead_rating((5, 7), map) == 4
    @test get_trailhead_rating((6, 3), map) == 1
    @test get_trailhead_rating((6, 6), map) == 4
    @test get_trailhead_rating((7, 1), map) == 5
    @test get_trailhead_rating((7, 7), map) == 8
    @test get_trailhead_rating((8, 2), map) == 5
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 36
    @test part2(input) === 81
end

@testset "Real input" begin
    input = prepare_input(get_input(day=10, year=2024))
    @test part1(input) === 841
    @test part2(input) === 1875
end