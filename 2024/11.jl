include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    parse.(Int, split(input, " "))
end

function get_number_of_decimal_digits(value::Int)
    floor(Int, log10(value)) + 1
end

function transform_stone(stone::Int)::Vector{Int}
    if stone == 0
        return [1]
    end
    number_of_digits = get_number_of_decimal_digits(stone)
    if number_of_digits % 2 == 0
        split_factor = exp10(number_of_digits ÷ 2)
        stone1, stone2 = divrem(stone, split_factor)
        return [stone1, stone2]
    end
    return [stone * 2024]
end

function blink(input::Vector{Int})::Vector{Int}
    output = Vector{Int}()
    sizehint!(output, length(input) * 2)
    for stone in input
        append!(output, transform_stone(stone))
    end
    output
end

function part1(input)
    for _ in 1:25
        input = blink(input)
    end
    length(input)
end

function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=11, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end