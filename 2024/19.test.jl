include("19.jl")
using Test

example_input = """
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb"""

@testset "prepare_input" begin
    @test prepare_input(example_input) == (
        ["r", "wr", "b", "g", "bwu", "rb", "gb", "br"],
        ["brwrr", "bggr", "gbbr", "rrbgbr", "ubwu", "bwurrg", "brgr", "bbrgwb"]
    )
end

@testset "is_possible" begin
    towels, designs = prepare_input(example_input)
    is_possible = make_tester(towels)
    @test is_possible("brwrr") == true
    @test is_possible("bggr") == true
    @test is_possible("gbbr") == true
    @test is_possible("rrbgbr") == true
    @test is_possible("ubwu") == false
    @test is_possible("bwurrg") == true
    @test is_possible("brgr") == true
    @test is_possible("bbrgwb") == false
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 6
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=19, year=2024))
    @test part1(input) === 350
    @test part2(input) === nothing
end