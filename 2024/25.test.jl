include("25.jl")
using Test

example_input = """
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####"""

@testset "prepare_input" begin
    @test prepare_input(example_input) == (
        [[5, 0, 2, 1, 3], [4, 3, 4, 0, 2], [3, 0, 2, 0, 1]],
        [[0, 5, 3, 4, 3], [1, 2, 0, 5, 3]],
    )
end

@testset "does_fit" begin
    @test does_fit([0, 5, 3, 4, 3], [5, 0, 2, 1, 3]) == false
    @test does_fit([0, 5, 3, 4, 3], [4, 3, 4, 0, 2]) == false
    @test does_fit([0, 5, 3, 4, 3], [3, 0, 2, 0, 1]) == true
    @test does_fit([1, 2, 0, 5, 3], [5, 0, 2, 1, 3]) == false
    @test does_fit([1, 2, 0, 5, 3], [4, 3, 4, 0, 2]) == true
    @test does_fit([1, 2, 0, 5, 3], [3, 0, 2, 0, 1]) == true

end

@testset "Example Input" begin
    @test part1(prepare_input(example_input)) === 3
end

@testset "Real input" begin
    input = prepare_input(get_input(day=25, year=2024))
    @test part1(input) === 3360
end