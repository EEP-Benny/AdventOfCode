include("utils.jl")

using .AdventOfCodeUtils

Position = @NamedTuple begin
    x::Int
    y::Int
end

struct ClawMachine
    buttonA::Position
    buttonB::Position
    prize::Position
end

import Base.==

function ==(a::ClawMachine, b::ClawMachine)
    a.buttonA == b.buttonA && a.buttonB == b.buttonB && a.prize == b.prize
end

function parse_claw_machine(input::AbstractString)::ClawMachine
    m = match(r"Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)", input)
    ax, ay, bx, by, px, py = parse.(Int, m.captures)
    ClawMachine((ax, ay), (bx, by), (px, py))
end

function prepare_input(input::AbstractString)
    parse_claw_machine.(split(input, "\n\n"))
end

function solve_claw_machine(machine::ClawMachine)
    (ax, ay) = machine.buttonA
    (bx, by) = machine.buttonB
    (px, py) = machine.prize
    b_presses = (ay * px - ax * py) // (ay * bx - ax * by)
    a_presses = (by * px - bx * py) // (by * ax - bx * ay)
    isinteger(a_presses) && isinteger(b_presses) ? (Int(a_presses), Int(b_presses)) : nothing
end

function part1(input)
    presses_for_prizes = [solution for solution in solve_claw_machine.(input) if solution !== nothing]
    sum(a_presses * 3 + b_presses for (a_presses, b_presses) in presses_for_prizes)
end

function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=13, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end