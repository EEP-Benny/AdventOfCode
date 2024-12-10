include("utils.jl")

using .AdventOfCodeUtils

const Grid = Matrix{Int}

function Base.parse(::Type{Grid}, input)::Grid
    Grid(reduce(vcat, permutedims(parse.(Int, split(line, ""))) for line in split(input, '\n')))
end

function prepare_input(input::AbstractString)
    parse(Grid, input)
end

function get_trailhead_score(trailhead_position::Tuple{Int,Int}, map::Grid)
    current_candidates = Set([trailhead_position])
    for current_height in 1:9
        next_candidates = Set{Tuple{Int,Int}}()
        for candidate in current_candidates
            for direction in [(0, 1), (1, 0), (-1, 0), (0, -1)]
                new_position = candidate .+ direction
                if checkbounds(Bool, map, new_position...) && map[new_position...] == current_height
                    push!(next_candidates, new_position)
                end
            end
        end
        current_candidates = next_candidates
    end
    length(current_candidates)
end

function get_trailhead_rating(trailhead_position::Tuple{Int,Int}, map::Grid)
    current_candidates = Dict(trailhead_position => 1)
    for current_height in 1:9
        next_candidates = Dict{Tuple{Int,Int},Int}()
        for (candidate, count) in current_candidates
            for direction in [(0, 1), (1, 0), (-1, 0), (0, -1)]
                new_position = candidate .+ direction
                if checkbounds(Bool, map, new_position...) && map[new_position...] == current_height
                    if !haskey(next_candidates, new_position)
                        next_candidates[new_position] = count
                    else
                        next_candidates[new_position] += count
                    end
                end
            end
        end
        current_candidates = next_candidates
    end
    sum(values(current_candidates))
end

function part1(input)
    score_sum = 0
    for y in axes(input, 2), x in axes(input, 1)
        height = input[y, x]
        if height == 0
            score_sum += get_trailhead_score((y, x), input)
        end
    end
    score_sum
end

function part2(input)
    sum(get_trailhead_rating((y, x), input) for y in axes(input, 2), x in axes(input, 1) if input[y, x] == 0)
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=10, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end