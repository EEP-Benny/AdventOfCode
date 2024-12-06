include("04.jl")
using Test

example_input = """
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX"""

@testset "parse Grid" begin
    @test parse(
        Grid, """
                123
                456
                789"""
    ) == [
        ['1' '2' '3'];
        ['4' '5' '6'];
        ['7' '8' '9']
    ]
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 18
    @test part2(input) === 9
end

@testset "Real input" begin
    input = prepare_input(get_input(day=4, year=2024))
    @test part1(input) === 2593
    @test part2(input) === nothing
end