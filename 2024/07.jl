include("utils.jl")

using .AdventOfCodeUtils
import Base.:(==)

struct CalibrationEquation
    test_value::Int64
    numbers::Vector{Int64}
end

function Base.parse(::Type{CalibrationEquation}, input)::CalibrationEquation
    parts = split(input, ": ")
    test_value = parse(Int64, parts[1])
    numbers = parse.(Int64, split(parts[2], " "))
    CalibrationEquation(test_value, numbers)
end

function ==(a::CalibrationEquation, b::CalibrationEquation)
    a.test_value == b.test_value && a.numbers == b.numbers
end

function prepare_input(input::AbstractString)::Vector{CalibrationEquation}
    parse.(CalibrationEquation, split(input, "\n"))
end

function could_possibly_true(equation::CalibrationEquation)::Bool
    numbers = equation.numbers
    number_count = length(numbers)
    function inner(current_result, current_index)
        if current_index > number_count
            return current_result === equation.test_value
        end
        a = current_result
        b = numbers[current_index]
        next_index = current_index + 1

        return inner(a + b, next_index) || inner(a * b, next_index)
    end
    inner(numbers[1], 2)
end

function get_concatenation_factor(value::Int64)
    factor = 10
    while value >= 10
        value ÷= 10
        factor *= 10
    end
    factor
end

function could_possibly_true_with_concatenation(equation::CalibrationEquation)::Bool
    numbers = equation.numbers
    number_count = length(numbers)
    function inner(current_result, current_index)
        if current_index > number_count
            return current_result === equation.test_value
        end
        a = current_result
        b = numbers[current_index]
        next_index = current_index + 1

        if inner(a + b, next_index) || inner(a * b, next_index)
            return true
        end
        return inner(a * get_concatenation_factor(b) + b, next_index)
    end
    inner(numbers[1], 2)
end

function part1(input)
    sum(map(eq -> eq.test_value, filter(could_possibly_true, input)))
end

function part2(input)
    sum(map(eq -> eq.test_value, filter(could_possibly_true_with_concatenation, input)))
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=7, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end