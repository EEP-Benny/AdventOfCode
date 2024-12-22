include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    parse.(Int, split(input, "\n"))
end

function evolve_secret_number(secret_number::Int)
    secret_number = ((secret_number * 64) ⊻ secret_number) % 16777216
    secret_number = ((secret_number ÷ 32) ⊻ secret_number) % 16777216
    secret_number = ((secret_number * 2048) ⊻ secret_number) % 16777216
end

function get_2000_secrets(secret_number::Int)
    secrets = Vector{Int}(undef, 2001)
    for i in 1:2001
        secrets[i] = secret_number
        secret_number = evolve_secret_number(secret_number)
    end
    secrets
end

function get_bananas(secret_number::Int)
    secret_number % 10
end

function part1(input)
    sum(secret_number -> get_2000_secrets(secret_number)[end], input)
end

function get_bananas_for_diff_sequence(bananas::Vector{Int}, diff_sequence::Vector{Int})
    differences = diff(bananas)
    for banana_index in eachindex(differences)
        is_valid_sequence = true
        for sequence_index in eachindex(diff_sequence)
            test_index = banana_index + sequence_index - 1
            if test_index > length(differences) || differences[test_index] != diff_sequence[sequence_index]
                is_valid_sequence = false
                break
            end
        end
        if is_valid_sequence
            return bananas[banana_index+length(diff_sequence)]
        end
    end
    return 0
end

function get_all_sequences()
    sequences = []
    for a in -9:9
        for b in -9:9
            for c in -9:9
                for d in -9:9
                    push!(sequences, [a, b, c, d])
                end
            end
        end
    end
    sequences
end


function part2(input)
    bananas = [get_bananas.(get_2000_secrets(initial_secret)) for initial_secret in input]
    max_bananas = 0
    for (i, sequence) in enumerate(get_all_sequences())
        if (all(x -> x == 0, sequence[3:end]))
            @show i, sequence
        end
        bananas_for_this_sequence = sum(get_bananas_for_diff_sequence(b, sequence) for b in bananas)
        max_bananas = max(max_bananas, bananas_for_this_sequence)
    end
    max_bananas
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=22, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end