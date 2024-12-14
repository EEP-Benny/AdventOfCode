include("14.jl")
using Test

example_input = """
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3"""


@testset "parse input" begin
    room = prepare_input(example_input)
    @test room.size == (11, 7)
    @test room.robots[1] == Robot((0, 4), (3, -3))
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 12
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=14, year=2024))
    @test part1(input) === 231852216
    @test part2(input) === nothing
end