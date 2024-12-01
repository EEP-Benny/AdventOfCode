include("01.jl")
using Test

example_input = """
3   4
4   3
2   5
1   3
3   9
3   3"""

@testset "prepare_input" begin
    @test prepare_input(example_input) == [3 4 2 1 3 3; 4 3 5 3 9 3]
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) == 11
    @test part2(input) == 31
end

@testset "Real input" begin
    input = prepare_input(get_input(day=1, year=2024))
    @test part1(input) == 2742123
    @test part2(input) == 21328497
end