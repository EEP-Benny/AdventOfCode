include("utils.jl")

using .AdventOfCodeUtils

Pos = Tuple{Int,Int}

struct Racetrack
    walls::Set{Pos}
    start_pos::Pos
    end_pos::Pos
end

function prepare_input(input::AbstractString)
    walls = Set{Pos}()
    start_pos::Pos = (0, 0)
    end_pos::Pos = (0, 0)
    for (y, line) in enumerate(split(input, "\n")), (x, char) in enumerate(line)
        pos = (x, y)
        if char === 'S'
            start_pos = pos
        elseif char === 'E'
            end_pos = pos
        elseif char === '#'
            push!(walls, pos)
        end
    end
    Racetrack(walls, start_pos, end_pos)
end

directions = [(0, 1), (1, 0), (-1, 0), (0, -1)]

function find_path(track::Racetrack)
    current_pos = track.start_pos
    last_pos = current_pos
    path::Vector{Pos} = [current_pos]
    while current_pos != track.end_pos
        for dir in directions
            next_pos = current_pos .+ dir
            if next_pos ∉ track.walls && next_pos != last_pos
                push!(path, next_pos)
                last_pos = current_pos
                current_pos = next_pos
                break
            end
        end
    end
    path
end

function find_cheats(path::Vector{Pos}, max_cheat_length=2)
    saved_times::Vector{Int} = []
    pos_to_time = Dict(pos => i for (i, pos) in enumerate(path))
    for cheat_start_pos in path
        for dx in -max_cheat_length:max_cheat_length, dy in -max_cheat_length:max_cheat_length
            cheat_length = abs(dx) + abs(dy)
            cheat_end_pos = cheat_start_pos .+ (dx, dy)
            if cheat_length <= max_cheat_length && haskey(pos_to_time, cheat_end_pos)
                saved_time = pos_to_time[cheat_end_pos] - pos_to_time[cheat_start_pos] - cheat_length
                if saved_time > 0
                    push!(saved_times, saved_time)
                end
            end
        end
    end
    saved_times
end

function part1(input)
    cheats = find_cheats(find_path(input))
    count(>=(100), cheats)
end


function part2(input)
    cheats20 = find_cheats(find_path(input), 20)
    count(>=(100), cheats20)
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=20, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end