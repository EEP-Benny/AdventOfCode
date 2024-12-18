include("18.jl")
using Test

example_input = """
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0"""

@testset "prepare_input" begin
    @test prepare_input(example_input) == [
        (5, 4),
        (4, 2),
        (4, 5),
        (3, 0),
        (2, 1),
        (6, 3),
        (2, 4),
        (1, 5),
        (0, 6),
        (3, 3),
        (2, 6),
        (5, 1),
        (1, 2),
        (5, 5),
        (2, 5),
        (6, 5),
        (1, 4),
        (0, 4),
        (6, 4),
        (1, 1),
        (6, 1),
        (1, 0),
        (0, 5),
        (1, 6),
        (2, 0),
    ]
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 22
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=18, year=2024))
    @test part1(input) === 260
    @test part2(input) === nothing
end