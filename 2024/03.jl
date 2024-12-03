include("utils.jl")

using .AdventOfCodeUtils

function part1(input)
    sum_of_multiplications = 0
    for m in eachmatch(r"mul\((\d{1,3}),(\d{1,3})\)", input)
        sum_of_multiplications += parse(Int, m.captures[1]) * parse(Int, m.captures[2])
    end
    sum_of_multiplications
end

function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = get_input(day=3, year=2024)
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end