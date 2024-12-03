include("03.jl")
using Test


@testset "Example Input" begin
    @test part1("xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))") === 161
    @test part2("xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))") === 48
end

@testset "Real input" begin
    input = get_input(day=3, year=2024)
    @test part1(input) === 187825547
    @test part2(input) === 85508223
end