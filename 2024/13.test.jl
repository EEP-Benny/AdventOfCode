include("13.jl")
using Test

example_input = """
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279"""


@testset "parse input" begin
    @test prepare_input(example_input)[1] == ClawMachine((94, 34), (22, 67), (8400, 5400))
end

@testset "solve_claw_machine" begin
    machines = prepare_input(example_input)
    @test solve_claw_machine(machines[1]) == (80, 40)
    @test solve_claw_machine(machines[2]) === nothing
    @test solve_claw_machine(machines[3]) == (38, 86)
    @test solve_claw_machine(machines[4]) === nothing
end


@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 480
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=13, year=2024))
    @test part1(input) === 26299
    @test part2(input) === nothing
end