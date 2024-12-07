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
    function inner(first, second=nothing, rest...)
        if second === nothing
            return first === equation.test_value
        end
        return inner(first + second, rest...) || inner(first * second, rest...)
    end
    inner(equation.numbers...)
end

function could_possibly_true_with_concatenation(equation::CalibrationEquation)::Bool
    function inner(first, second=nothing, rest...)
        if second === nothing
            return first === equation.test_value
        end
        return inner(first + second, rest...) || inner(first * second, rest...) || inner(parse(Int64, string(first) * string(second)), rest...)
    end
    inner(equation.numbers...)
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