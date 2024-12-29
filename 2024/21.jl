include("utils.jl")

using .AdventOfCodeUtils

Pos = Tuple{Int,Int}

function prepare_input(input::AbstractString)
    split(input, "\n")
end

key_positions = Dict{Char,Pos}(
    'A' => (-0, -0),
    '0' => (-1, -0),
    '1' => (-2, -1),
    '2' => (-1, -1),
    '3' => (-0, -1),
    '4' => (-2, -2),
    '5' => (-1, -2),
    '6' => (-0, -2),
    '7' => (-2, -3),
    '8' => (-1, -3),
    '9' => (-0, -3),
    '^' => (-1, 0),
    '<' => (-2, 1),
    'v' => (-1, 1),
    '>' => (-0, 1),
)

function multiply_keys(count::Int, positive_key::Char, negative_key::Char)
    join(fill(count > 0 ? positive_key : negative_key, abs(count)), "")
end

function get_candidates_for_sequence(sequence::AbstractString)::Vector{Set{String}}
    current_pos = (0, 0)
    keys_to_press::Vector{Set{String}} = []
    for key in sequence
        new_pos = key_positions[key]
        (diff_x, diff_y) = new_pos .- current_pos
        possibilities = Set{String}()
        x_keys = multiply_keys(diff_x, '>', '<')
        y_keys = multiply_keys(diff_y, 'v', '^')
        if current_pos .+ (diff_x, 0) != (-2, 0)
            push!(possibilities, x_keys * y_keys * 'A')
        end
        if current_pos .+ (0, diff_y) != (-2, 0)
            push!(possibilities, y_keys * x_keys * 'A')
        end
        push!(keys_to_press, possibilities)
        current_pos = new_pos
    end
    keys_to_press
end

function get_min_number_of_keys_for_sequence(sequence::AbstractString, number_of_robots::Int)
    memo = Dict{Tuple{AbstractString,Int},Int}()
    function get_min_number_of_keys_inner(sequence::AbstractString, level::Int)
        if level >= number_of_robots
            return length(sequence)
        end
        memo_key = (sequence, level)
        if haskey(memo, memo_key)
            return memo[memo_key]
        end
        candidates_sequence = get_candidates_for_sequence(sequence)
        min_keys = 0
        for candidates in candidates_sequence
            min_keys_for_this = minimum(get_min_number_of_keys_inner(candidate, level + 1) for candidate in candidates)
            min_keys += min_keys_for_this
        end
        memo[memo_key] = min_keys
        min_keys
    end
    get_min_number_of_keys_inner(sequence, 0)
end

function get_numeric_part(s::AbstractString)
    parse(Int, s[1:3])
end

function part1(input)
    sum(get_min_number_of_keys_for_sequence(sequence, 3) * get_numeric_part(sequence) for sequence in input)
end


function part2(input)
    sum(get_min_number_of_keys_for_sequence(sequence, 26) * get_numeric_part(sequence) for sequence in input)
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=21, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end