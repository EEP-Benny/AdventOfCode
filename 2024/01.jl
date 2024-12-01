include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    input = rstrip(input)
    input = split(input, "\n")
    input = split.(input)
    input = stack(input)
    input = parse.(Int, input)
    input
end

example_input = """
3   4
4   3
2   5
1   3
3   9
3   3
"""

input = prepare_input(get_input(day=1, year=2024))
# input = prepare_input(example_input)

function part1()
    sorted_input = sort(input, dims=2)
    sum_of_differences = 0
    for (a, b) in eachcol(sorted_input)
        sum_of_differences += abs(a - b)
    end
    sum_of_differences
end

@time @show part1()
@time part1()