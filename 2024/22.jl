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

function evolve_2000(secret_number::Int)
    for _ in 1:2000
        secret_number = evolve_secret_number(secret_number)
    end
    secret_number
end


function part1(input)
    sum(evolve_2000, input)
end


function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=22, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end