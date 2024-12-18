include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    [Tuple(parse.(Int, split(line, ","))) for line in split(input, "\n")]
end

function find_shortest_static_path(corrupted_coordinates::Set{Tuple{Int,Int}})
    max_coordinate = maximum(maximum, corrupted_coordinates)
    frontier = [(0, 0)]
    shortest_path_to_coordinate = Dict{Tuple{Int,Int},Int}((0, 0) => 0)
    while !isempty(frontier)
        coordinate = popfirst!(frontier)
        shortest_path_to_here = shortest_path_to_coordinate[coordinate]
        for dir in [(-1, 0), (0, -1), (1, 0), (0, 1)]
            next_coordinate = coordinate .+ dir
            if next_coordinate == (max_coordinate, max_coordinate)
                return shortest_path_to_here + 1
            end
            if next_coordinate ∉ corrupted_coordinates &&
               !haskey(shortest_path_to_coordinate, next_coordinate) &&
               0 <= next_coordinate[1] <= max_coordinate && 0 <= next_coordinate[2] <= max_coordinate
                shortest_path_to_coordinate[next_coordinate] = shortest_path_to_here + 1
                push!(frontier, next_coordinate)
            end
        end
    end
end

function part1(input)
    byte_amount = length(input) < 1000 ? 12 : 1024
    corrupted_coordinates = Set(input[1:byte_amount])
    find_shortest_static_path(corrupted_coordinates)
end



function part2(input)
    byte_amount = length(input) < 1000 ? 12 : 1024
    corrupted_coordinates = Set(input[1:byte_amount])
    while find_shortest_static_path(corrupted_coordinates) !== nothing
        byte_amount += 1
        push!(corrupted_coordinates, input[byte_amount])
    end
    join(input[byte_amount], ",")
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=18, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end