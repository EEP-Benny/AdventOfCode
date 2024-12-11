include("11.jl")
using Test

example_input = """125 17"""

@testset "parse input" begin
    @test prepare_input("0 1 10 99 999") == [0, 1, 10, 99, 999]
end

@testset "get_number_of_decimal_digits" begin
    @test get_number_of_decimal_digits(1) == 1
    @test get_number_of_decimal_digits(9) == 1
    @test get_number_of_decimal_digits(10) == 2
    @test get_number_of_decimal_digits(99) == 2
    @test get_number_of_decimal_digits(100) == 3
    @test get_number_of_decimal_digits(2024) == 4
    @test get_number_of_decimal_digits(2021976) == 7
end

@testset "blink once" begin
    @test blink([0, 1, 10, 99, 999]) == [1, 2024, 1, 0, 9, 9, 2021976]
    @test blink([125, 17]) == [253000, 1, 7]
    @test blink([253000, 1, 7]) == [253, 0, 2024, 14168]
    @test blink([253, 0, 2024, 14168]) == [512072, 1, 20, 24, 28676032]
    @test blink([512072, 1, 20, 24, 28676032]) == [512, 72, 2024, 2, 0, 2, 4, 2867, 6032]
    @test blink([512, 72, 2024, 2, 0, 2, 4, 2867, 6032]) == [1036288, 7, 2, 20, 24, 4048, 1, 4048, 8096, 28, 67, 60, 32]
    @test blink([1036288, 7, 2, 20, 24, 4048, 1, 4048, 8096, 28, 67, 60, 32]) == [2097446912, 14168, 4048, 2, 0, 2, 4, 40, 48, 2024, 40, 48, 80, 96, 2, 8, 6, 7, 6, 0, 3, 2]
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 55312
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=11, year=2024))
    @test part1(input) === 188902
    @test part2(input) === nothing
end