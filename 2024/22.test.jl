include("22.jl")
using Test

example_input_1 = """
1
10
100
2024"""

example_input_2 = """
1
2
3
2024"""

@testset "prepare_input" begin
    @test prepare_input(example_input_1) == [1, 10, 100, 2024]
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

@testset "get_2000_secrets" begin
    @test get_2000_secrets(1)[end] == 8685429
    @test get_2000_secrets(10)[end] == 4700978
    @test get_2000_secrets(100)[end] == 15273692
    @test get_2000_secrets(2024)[end] == 8667524
end

@testset "banana maths" begin
    secrets = get_2000_secrets(123)[1:10]
    @test get_bananas.(secrets) == [3, 0, 6, 5, 4, 4, 6, 4, 4, 2]
    @test diff(get_bananas.(secrets)) == [-3, 6, -1, -1, 0, 2, -2, 0, -2]
end

@testset "get_bananas_for_diff_sequence" begin
    @test get_bananas_for_diff_sequence(get_bananas.(get_2000_secrets(123)[1:10]), [-1, -1, 0, 2]) == 6
    @test get_bananas_for_diff_sequence(get_bananas.(get_2000_secrets(1)), [-2, 1, -1, 3]) == 7
    @test get_bananas_for_diff_sequence(get_bananas.(get_2000_secrets(2)), [-2, 1, -1, 3]) == 7
    @test get_bananas_for_diff_sequence(get_bananas.(get_2000_secrets(3)), [-2, 1, -1, 3]) == 0
    @test get_bananas_for_diff_sequence(get_bananas.(get_2000_secrets(2024)), [-2, 1, -1, 3]) == 9
end

@testset "Example Input" begin
    @test part1(prepare_input(example_input_1)) === 37327623
    @test part2(prepare_input(example_input_2)) === 23
end

@testset "Real input" begin
    input = prepare_input(get_input(day=22, year=2024))
    @test part1(input) === 13185239446
    @test part2(input) === 1501
end