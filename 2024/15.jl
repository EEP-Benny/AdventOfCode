include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    warehouse_string, movements_string = split(input, "\n\n")

    robot = (0, 0)
    boxes = Set{Tuple{Int,Int}}()
    walls = Set{Tuple{Int,Int}}()
    for (y, line) in enumerate(split(warehouse_string, "\n")), (x, char) in enumerate(line)
        pos = (x, y)
        if char == '@'
            robot = pos
        elseif char == '#'
            push!(walls, pos)
        elseif char == 'O'
            push!(boxes, pos)
        end
    end

    movement_mapping = Dict('v' => (0, 1), '>' => (1, 0), '<' => (-1, 0), '^' => (0, -1))
    movements = [movement_mapping[char] for char in replace(movements_string, "\n" => "")]

    (robot, boxes, walls, movements)
end

function do_the_moves((robot, boxes, walls, movements))
    boxes = copy(boxes)
    for movement in movements
        number_of_boxes = 0
        while (robot .+ (number_of_boxes + 1) .* movement) ∈ boxes
            number_of_boxes += 1
        end
        if (robot .+ (number_of_boxes + 1) .* movement) ∈ walls
            continue
        end
        robot = robot .+ movement
        if robot ∈ boxes
            delete!(boxes, robot)
            push!(boxes, robot .+ number_of_boxes .* movement)
        end
    end
    robot, boxes
end
function get_gps_coordinates(boxes)
    sum((box[1] - 1) + 100 * (box[2] - 1) for box in boxes)
end

function part1(input)
    _, boxes = do_the_moves(input)
    get_gps_coordinates(boxes)
end


function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=15, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end