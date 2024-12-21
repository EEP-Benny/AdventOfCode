include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    towel_pattern_string, designs_string = split(input, "\n\n")
    (split(towel_pattern_string, ", "), split(designs_string, "\n"))
end

function make_tester(towels)
    proven_to_be_impossible = Set()
    function is_possible(design::AbstractString)
        if design == ""
            return true
        end
        if design ∈ proven_to_be_impossible
            return false
        end
        for towel in towels
            if startswith(design, towel) && is_possible(design[length(towel)+1:end],)
                return true
            end
        end
        push!(proven_to_be_impossible, design)
        return false
    end
end

function part1(input)
    towels, designs = input
    is_possible = make_tester(towels)
    count(is_possible, designs)
end


function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=19, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end