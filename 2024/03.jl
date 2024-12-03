include("utils.jl")

using .AdventOfCodeUtils

function part1(input)
    sum_of_multiplications = 0
    for m in eachmatch(r"mul\((?<num1>\d{1,3}),(?<num2>\d{1,3})\)", input)
        sum_of_multiplications += parse(Int, m["num1"]) * parse(Int, m["num2"])
    end
    sum_of_multiplications
end

function part2(input)
    is_multiplication_enabled = true
    sum_of_multiplications = 0
    for m in eachmatch(r"do\(\)|don't\(\)|mul\((?<num1>\d{1,3}),(?<num2>\d{1,3})\)", input)
        if startswith(m.match, "don't(")
            is_multiplication_enabled = false
        elseif startswith(m.match, "do(")
            is_multiplication_enabled = true
        elseif startswith(m.match, "mul(")
            if is_multiplication_enabled
                sum_of_multiplications += parse(Int, m["num1"]) * parse(Int, m["num2"])
            end
        end
    end
    sum_of_multiplications
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = get_input(day=3, year=2024)
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end