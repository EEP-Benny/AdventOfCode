include("utils.jl")

using .AdventOfCodeUtils

const Report = Vector{Int}

function Base.parse(::Type{Report}, input)::Report
    Report(parse.(Int, split(input)))
end

function is_safe(report::Report)::Bool
    differences = diff(report)
    all(map(difference -> -3 <= difference <= -1, differences)) || all(map(difference -> 1 <= difference <= 3, differences))
end

function is_safe_with_tolerance(report::Report)::Bool
    if is_safe(report)
        return true
    end
    for i in 1:length(report)
        report_without_level_i = vcat(report[begin:i-1], report[i+1:end])
        if is_safe(report_without_level_i)
            return true
        end
    end
    return false
end

function prepare_input(input::AbstractString)
    input = split(input, "\n")
    parse.(Report, input)
end

function part1(input)
    count(is_safe, input)
end

function part2(input)
    count(is_safe_with_tolerance, input)
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=2, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end