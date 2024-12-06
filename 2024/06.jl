include("utils.jl")

using .AdventOfCodeUtils

struct LabWithGuard
    guard_position::Tuple{Int,Int}
    guard_direction::Tuple{Int,Int}
    map::Matrix{Bool}
end

function Base.parse(::Type{LabWithGuard}, input)::LabWithGuard
    lines = split(input, "\n")
    size = (length(lines), length(lines[1]))
    map = Matrix{Bool}(undef, size)
    guard_position = (0, 0)
    guard_direction = (-1, 0)
    for (y, line) in enumerate(lines)
        for (x, char) in enumerate(line)
            if char == '^'
                guard_position = (y, x)
            end
            map[y, x] = char === '#'
        end
    end
    LabWithGuard(guard_position, guard_direction, map)
end


function prepare_input(input::AbstractString)::LabWithGuard
    parse(LabWithGuard, input)
end

function turn_right((y, x)::Tuple{Int,Int})::Tuple{Int,Int}
    (x, -y)
end


function part1(input::LabWithGuard)
    guard_position = input.guard_position
    guard_direction = input.guard_direction
    visited_positions = Set{Tuple{Int,Int}}([guard_position])
    while checkbounds(Bool, input.map, CartesianIndex(guard_position .+ guard_direction))
        if input.map[CartesianIndex(guard_position .+ guard_direction)]
            guard_direction = turn_right(guard_direction)
        else
            guard_position = guard_position .+ guard_direction
            push!(visited_positions, guard_position)
        end
    end
    length(visited_positions)
end

function results_in_loop(guard_position, guard_direction, map, extra_obstruction_position)::Bool
    visited_positions_and_directions = Set{Tuple{Int,Int,Int,Int}}([(guard_position..., guard_direction...)])
    while true
        if ((guard_position .+ guard_direction)..., guard_direction...) in visited_positions_and_directions
            return true
        end
        if !checkbounds(Bool, map, CartesianIndex(guard_position .+ guard_direction))
            return false
        end
        if map[CartesianIndex(guard_position .+ guard_direction)] || guard_position .+ guard_direction == extra_obstruction_position
            guard_direction = turn_right(guard_direction)
        else
            guard_position = guard_position .+ guard_direction
            push!(visited_positions_and_directions, (guard_position..., guard_direction...))
        end
    end
end

function part2(input)
    guard_position = input.guard_position
    guard_direction = input.guard_direction
    visited_positions_and_directions = Set{Tuple{Int,Int,Int,Int}}([(guard_position..., guard_direction...)])
    possible_obstruction_positions = Set{Tuple{Int,Int}}()
    while checkbounds(Bool, input.map, CartesianIndex(guard_position .+ guard_direction))
        if input.map[CartesianIndex(guard_position .+ guard_direction)]
            guard_direction = turn_right(guard_direction)
        else
            extra_obstruction_position = guard_position .+ guard_direction
            if results_in_loop(input.guard_position, input.guard_direction, input.map, extra_obstruction_position)
                push!(possible_obstruction_positions, extra_obstruction_position)
            end
            guard_position = guard_position .+ guard_direction
            push!(visited_positions_and_directions, (guard_position..., guard_direction...))
        end
    end
    length(possible_obstruction_positions)
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=6, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end