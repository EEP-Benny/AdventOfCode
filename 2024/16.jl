include("utils.jl")

using .AdventOfCodeUtils

struct Maze
    pos_start::Tuple{Int,Int}
    pos_end::Tuple{Int,Int}
    walls::Set{Tuple{Int,Int}}
end

function prepare_input(input::AbstractString)
    pos_start = (0, 0)
    pos_end = (0, 0)
    walls = Set{Tuple{Int,Int}}()
    for (y, line) in enumerate(split(input, "\n"))
        for (x, char) in enumerate(line)
            if char == 'S'
                pos_start = (x, y)
            elseif char == 'E'
                pos_end = (x, y)
            elseif char == '#'
                push!(walls, (x, y))
            end
        end
    end
    Maze(pos_start, pos_end, walls)
end

rotate_left((x, y)::Tuple{Int,Int}) = (y, -x)
rotate_right((x, y)::Tuple{Int,Int}) = (-y, x)

function find_best_path(maze)
    start_state = (maze.pos_start, (1, 0))
    score_per_state = Dict(start_state => 0)
    tiles_leading_to_pos = Dict(maze.pos_start => [maze.pos_start])
    current_states = [start_state]
    while !isempty(current_states)
        next_states = []
        for (pos, dir) in current_states
            current_score = score_per_state[(pos, dir)]
            current_tiles = copy(tiles_leading_to_pos[pos])
            while true
                if pos .+ rotate_left(dir) ∉ maze.walls
                    new_state = (pos, rotate_left(dir))
                    if !haskey(score_per_state, new_state)
                        push!(next_states, new_state)
                        score_per_state[new_state] = current_score + 1000
                    end
                end
                if pos .+ rotate_right(dir) ∉ maze.walls
                    new_state = (pos, rotate_right(dir))
                    if !haskey(score_per_state, new_state)
                        push!(next_states, new_state)
                        score_per_state[new_state] = current_score + 1000
                    end
                end

                pos = pos .+ dir
                if pos ∈ maze.walls
                    break
                end
                current_score += 1
                push!(current_tiles, pos)

                if pos == maze.pos_end
                    return current_score, length(current_tiles)
                end
                if !haskey(score_per_state, (pos, dir))
                    score_per_state[(pos, dir)] = current_score
                    tiles_leading_to_pos[pos] = copy(current_tiles)
                elseif score_per_state[(pos, dir)] == current_score
                    union!(current_tiles, tiles_leading_to_pos[pos])
                    tiles_leading_to_pos[pos] = copy(current_tiles)
                end

            end
        end
        current_states = next_states
    end
end

function part1(input)
    find_best_path(input)[1]
end



function part2(input)
    find_best_path(input)[2]
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=16, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end