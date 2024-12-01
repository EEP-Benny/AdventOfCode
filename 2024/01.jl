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

input = prepare_input(example_input)
input = prepare_input(get_input(day=1, year=2024))

function part1()
    sorted_input = sort(input, dims=2)
    function get_difference((a, b))
        abs(a - b)
    end
    sum(map(get_difference, eachcol(sorted_input)))
end

function part2()
    (list1, list2) = eachrow(input)
    sum(map(a -> a * count(==(a), list2), list1))
end

@show part1()
@show part2()
@time part1()
@time part2()