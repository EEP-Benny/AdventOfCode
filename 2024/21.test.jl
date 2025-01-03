include("21.jl")
using Test

example_input = """
029A
980A
179A
456A
379A"""

@testset "prepare_input" begin
    @test prepare_input(example_input) == [
        "029A",
        "980A",
        "179A",
        "456A",
        "379A",
    ]
end

@testset "multiply_keys" begin
    @test multiply_keys(2, '>', '<') == ">>"
    @test multiply_keys(1, '>', '<') == ">"
    @test multiply_keys(-2, '>', '<') == "<<"
    @test multiply_keys(0, '>', '<') == ""
end

@testset "get_candidates_for_sequence" begin
    @test get_candidates_for_sequence("029A") == [Set(["<A"]), Set(["^A"]), Set([">^^A", "^^>A"]), Set(["vvvA"])]
    @test get_candidates_for_sequence(">^^A") == [Set(["vA"]), Set(["^<A", "<^A"]), Set(["A"]), Set([">A"])]
    @test get_candidates_for_sequence("vvvA") == [Set(["v<A", "<vA"]), Set(["A"]), Set(["A"]), Set([">^A", "^>A"])]
    @test get_candidates_for_sequence("1A") == [Set(["^<<A"]), Set([">>vA"])] # avoid the gap
end

@testset "get_min_number_of_keys_for_sequence" begin
    @test get_min_number_of_keys_for_sequence("029A", 3) == 68
    @test get_min_number_of_keys_for_sequence("980A", 3) == 60
    @test get_min_number_of_keys_for_sequence("179A", 3) == 68
    @test get_min_number_of_keys_for_sequence("456A", 3) == 64
    @test get_min_number_of_keys_for_sequence("379A", 3) == 64
end

@testset "get_numeric_part" begin
    @test get_numeric_part("029A") == 29
    @test get_numeric_part("980A") == 980
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) == 126384
    # @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=21, year=2024))
    @test part1(input) === 157892
    @test part2(input) === 197015606336332
end