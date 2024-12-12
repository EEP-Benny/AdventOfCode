include("12.jl")
using Test

example_input_small = """
AAAA
BBCD
BBCC
EEEC"""

example_input = """
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE"""

@testset "parse input" begin
    @test prepare_input(example_input_small) == [
        ['A', 'A', 'A', 'A'],
        ['B', 'B', 'C', 'D'],
        ['B', 'B', 'C', 'C'],
        ['E', 'E', 'E', 'C'],]
end

# @testset "get_regions" begin
#     @test get_regions(prepare_input(example_input_small)) == Set([
#         Region('A', 4, 10),
#         Region('B', 4, 8),
#         Region('C', 4, 10),
#         Region('D', 1, 4),
#         Region('E', 3, 8)
#     ])
# end


@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 1930
    @test part2(input) === 1206
end

@testset "Real input" begin
    input = prepare_input(get_input(day=12, year=2024))
    @test part1(input) === 1488414
    @test part2(input) === nothing
end