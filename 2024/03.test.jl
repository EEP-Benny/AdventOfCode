include("03.jl")
using Test

example_input = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"

@testset "Example Input" begin
    input = example_input
    @test part1(input) === 161
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = get_input(day=3, year=2024)
    @test part1(input) === 187825547
    @test part2(input) === nothing
end