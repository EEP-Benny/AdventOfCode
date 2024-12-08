include("utils.jl")

using .AdventOfCodeUtils
import Base.:(==)

struct Map
    map_size::Tuple{Int,Int}
    antenna_positions::Dict{Char,Vector{Tuple{Int,Int}}}
end

function ==(a::Map, b::Map)
    a.map_size == b.map_size && a.antenna_positions == b.antenna_positions
end

function prepare_input(input::AbstractString)::Map
    lines = split(input, "\n")
    map_size = (length(lines[1]), length(lines))
    antenna_positions = Dict{Char,Vector{Tuple{Int,Int}}}()
    for (y, line) in enumerate(lines)
        for m in eachmatch(r"[a-zA-Z0-9]", line)
            char = m.match[1]
            x = m.offset
            if !haskey(antenna_positions, char)
                antenna_positions[char] = Vector()
            end
            push!(antenna_positions[char], (x, y))
        end
    end
    Map(map_size, antenna_positions)
end

function find_antinode_positions(map::Map, multiples=[1])
    positions = Set{Tuple{Int,Int}}()
    for (_, antenna_positions) in map.antenna_positions
        for a1 in antenna_positions, a2 in antenna_positions
            if a1 === a2
                continue
            end
            difference = a1 .- a2
            for factor in multiples
                antinode_position = a1 .+ (factor .* difference)
                if all((1, 1) .<= antinode_position .<= map.map_size)
                    push!(positions, antinode_position)
                end
            end
        end
    end
    positions
end

function part1(input)
    length(find_antinode_positions(input))
end

function part2(input)
    length(find_antinode_positions(input, 0:maximum(input.map_size)))

end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=8, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end