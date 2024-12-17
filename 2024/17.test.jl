include("17.jl")
using Test

example_input = """
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0"""

@testset "parse input" begin
    computer = prepare_input(example_input)
    @test computer.registers == [729, 0, 0]
    @test computer.program == [0, 1, 5, 4, 3, 0]
end

@testset "perform_all_instructions!" begin
    c1 = perform_all_instructions!(Computer([0, 0, 9], [2, 6], 0, []))
    @test c1.registers[B] == 1

    c2 = perform_all_instructions!(Computer([10, 0, 0], [5, 0, 5, 1, 5, 4], 0, []))
    @test c2.outputs == [0, 1, 2]

    c3 = perform_all_instructions!(Computer([2024, 0, 0], [0, 1, 5, 4, 3, 0], 0, []))
    @test c3.outputs == [4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0]
    @test c3.registers[A] == 0

    c4 = perform_all_instructions!(Computer([0, 29, 0], [1, 7], 0, []))
    @test c4.registers[B] == 26

    c5 = perform_all_instructions!(Computer([0, 2024, 43690], [4, 0], 0, []))
    @test c5.registers[B] == 44354
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === "4,6,3,5,6,3,5,2,1,0"
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=17, year=2024))
    @test part1(input) === "3,6,3,7,0,7,0,3,0"
    @test part2(input) === nothing
end