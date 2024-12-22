include("22.jl")
using Test

example_input = """
1
10
100
2024"""

@testset "prepare_input" begin
    @test prepare_input(example_input) == [1, 10, 100, 2024]
end

@testset "evolve_secret_number" begin
    @test 42 ⊻ 15 == 37
    @test 15 ⊻ 42 == 37
    @test 100000000 % 16777216 == 16113920
    @test evolve_secret_number(123) == 15887950
    @test evolve_secret_number(15887950) == 16495136
    @test evolve_secret_number(16495136) == 527345
    @test evolve_secret_number(527345) == 704524
    @test evolve_secret_number(704524) == 1553684
end

@testset "evolve_2000" begin
    @test evolve_2000(1) == 8685429
    @test evolve_2000(10) == 4700978
    @test evolve_2000(100) == 15273692
    @test evolve_2000(2024) == 8667524
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 37327623
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=22, year=2024))
    @test part1(input) === 13185239446
    @test part2(input) === nothing
end