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
    visited_positions = Set{Tuple{Int,Int}}([input.guard_position])
    guard_position = input.guard_position
    guard_direction = input.guard_direction
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

function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=6, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end