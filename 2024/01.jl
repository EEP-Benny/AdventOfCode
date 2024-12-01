include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    input = split(input, "\n")
    input = split.(input, " ", keepempty=false)
    input = stack(input)
    input = parse.(Int, input)
    input
end

function part1(input)
    sorted_input = sort(input, dims=2)
    function get_difference((a, b))
        abs(a - b)
    end
    sum(map(get_difference, eachcol(sorted_input)))
end

function part2(input)
    (list1, list2) = eachrow(input)
    sum(map(a -> a * count(==(a), list2), list1))
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=1, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end