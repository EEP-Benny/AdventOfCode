include("07.jl")
using Test

example_input = """
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20"""

@testset "parse Equation" begin
    @test parse(CalibrationEquation, "190: 10 19") == CalibrationEquation(190, [10, 19])
    @test parse(CalibrationEquation, "3267: 81 40 27") == CalibrationEquation(3267, [81, 40, 27])
    @test parse(CalibrationEquation, "161011: 16 10 13") == CalibrationEquation(161011, [16, 10, 13])
end

@testset "could_possibly_true" begin
    @test could_possibly_true(parse(CalibrationEquation, "190: 10 19")) == true
    @test could_possibly_true(parse(CalibrationEquation, "3267: 81 40 27")) == true
    @test could_possibly_true(parse(CalibrationEquation, "292: 11 6 16 20")) == true
    @test could_possibly_true(parse(CalibrationEquation, "161011: 16 10 13")) == false
end

@testset "could_possibly_true_with_concatenation" begin
    @test could_possibly_true_with_concatenation(parse(CalibrationEquation, "190: 10 19")) == true
    @test could_possibly_true_with_concatenation(parse(CalibrationEquation, "3267: 81 40 27")) == true
    @test could_possibly_true_with_concatenation(parse(CalibrationEquation, "292: 11 6 16 20")) == true
    @test could_possibly_true_with_concatenation(parse(CalibrationEquation, "156: 15 6")) == true
    @test could_possibly_true_with_concatenation(parse(CalibrationEquation, "7290: 6 8 6 15")) == true
    @test could_possibly_true_with_concatenation(parse(CalibrationEquation, "192: 17 8 14")) == true
    @test could_possibly_true_with_concatenation(parse(CalibrationEquation, "161011: 16 10 13")) == false
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 3749
    @test part2(input) === 11387
end

@testset "Real input" begin
    input = prepare_input(get_input(day=7, year=2024))
    @test part1(input) === 5702958180383
    @test part2(input) === 92612386119138
end