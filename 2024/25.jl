include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    keys::Vector{Vector{Int}} = []
    locks::Vector{Vector{Int}} = []

    for part in split(input, "\n\n")
        first_char = part[1]
        lines = split(part, "\n")
        heights = zeros(length(lines[1]))
        for (i, line) in enumerate(lines)
            for (pos, char) in enumerate(line)
                if char === first_char
                    heights[pos] = i
                end
            end
        end
        if first_char === '#'
            push!(locks, heights .- 1)
        else
            push!(keys, 6 .- heights)
        end
    end
    keys, locks
end

function does_fit(key, lock)
    all(<=(5), key .+ lock)
end

function part1(input)
    keys, locks = input
    counter = 0
    for key in keys, lock in locks
        if does_fit(key, lock)
            counter += 1
        end
    end
    counter
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=25, year=2024))
    @show part1(input)
    @showtime part1(input)
end