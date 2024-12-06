include("06.jl")
using Test

example_input = """
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#..."""

@testset "parse Lab" begin
    parsed_lab_with_guard = parse(
        LabWithGuard,
        """
        .#..
        ^...
        ..#."""
    )
    @test parsed_lab_with_guard.guard_position == (2, 1)
    @test parsed_lab_with_guard.guard_direction == (-1, 0)
    @test parsed_lab_with_guard.map == [
        [false true false false];
        [false false false false];
        [false false true false]
    ]
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 41
    @test part2(input) === 6
end

@testset "Real input" begin
    input = prepare_input(get_input(day=6, year=2024))
    @test part1(input) === 4826
    @test part2(input) === 1721
end