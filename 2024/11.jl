include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    parse.(Int, split(input, " "))
end

function get_number_of_decimal_digits(value::Int)
    floor(Int, log10(value)) + 1
end

function to_stone_dict(input::Vector{Int})
    Dict{Int,Int}(stone => count(==(stone), input) for stone in unique(input))
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


function blink(stones::Dict{Int,Int})::Dict{Int,Int}
    new_stones = Dict{Int,Int}()
    sizehint!(new_stones, length(stones) * 2)
    for (stone, count) in stones
        for new_stone in transform_stone(stone)
            if !haskey(new_stones, new_stone)
                new_stones[new_stone] = count
            else
                new_stones[new_stone] += count
            end
        end
    end
    new_stones
end

function part1(input)
    stones = to_stone_dict(input)
    for _ in 1:25
        stones = blink(stones)
    end
    sum(values(stones))
end

function part2(input)
    stones = to_stone_dict(input)
    for _ in 1:75
        stones = blink(stones)
    end
    sum(values(stones))
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=11, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end