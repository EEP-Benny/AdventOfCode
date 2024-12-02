include("02.jl")
using Test

example_input = """
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9"""

@testset "parse Report" begin
    @test parse(Report, "7 6 4 2 1") == [7, 6, 4, 2, 1]
end

@testset "is Report safe" begin
    @test is_safe([7, 6, 4, 2, 1]) == true
    @test is_safe([1, 2, 7, 8, 9]) == false
    @test is_safe([9, 7, 6, 2, 1]) == false
    @test is_safe([1, 3, 2, 4, 5]) == false
    @test is_safe([8, 6, 4, 4, 1]) == false
    @test is_safe([1, 3, 6, 7, 9]) == true
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 2
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=2, year=2024))
    @test part1(input) === 407
    @test part2(input) === nothing
end