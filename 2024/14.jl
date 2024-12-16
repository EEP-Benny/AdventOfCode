include("utils.jl")

using .AdventOfCodeUtils
import Base.==

struct Robot
    p::Tuple{Int,Int}
    v::Tuple{Int,Int}
end

function ==(a::Robot, b::Robot)
    a.p == b.p && a.v == b.v
end

struct RoomOfRobots
    size::Tuple{Int,Int}
    robots::Vector{Robot}
end

function ==(a::RoomOfRobots, b::RoomOfRobots)
    a.size == b.size && a.robots == b.robots
end

function parse_robot(input::AbstractString)::Robot
    m = match(r"p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)", input)
    px, py, vx, vy = parse.(Int, m.captures)
    Robot((px, py), (vx, vy))
end

function prepare_input(input::AbstractString)
    robots = parse_robot.(split(input, "\n"))
    room_size = (maximum(r.p[1] for r in robots) + 1, maximum(r.p[2] for r in robots) + 1)
    RoomOfRobots(room_size, robots)
end

function simulate_steps(room::RoomOfRobots, step_count::Int)
    robots = [Robot(rem.(r.p .+ step_count .* r.v, room.size, RoundDown), r.v) for r in room.robots]
    RoomOfRobots(room.size, robots)
end

function get_safety_factor(room::RoomOfRobots)
    counts = [0, 0, 0, 0]
    for robot in room.robots
        if robot.p[1] < room.size[1] ÷ 2
            if robot.p[2] < room.size[2] ÷ 2
                counts[1] += 1
            elseif robot.p[2] > room.size[2] ÷ 2
                counts[2] += 1
            end
        elseif robot.p[1] > room.size[1] ÷ 2
            if robot.p[2] < room.size[2] ÷ 2
                counts[3] += 1
            elseif robot.p[2] > room.size[2] ÷ 2
                counts[4] += 1
            end
        end
    end
    prod(counts)
end

function part1(input)
    get_safety_factor(simulate_steps(input, 100))
end

function draw_robots(room)
    drawing = fill('.', room.size)
    for robot in room.robots
        drawing[robot.p[1]+1, robot.p[2]+1] = '#'
    end

    join(String.(eachcol(drawing)), "\n")
end

function part2(input)
    open("14.output.txt", "w") do file
        for i in 79:101:10000
            write(file, "After $i steps:\n")
            write(file, draw_robots(simulate_steps(input, i)))
            write(file, "\n\n")
        end
    end
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=14, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end