include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)
    collect.(split(input, "\n"))
end

mutable struct Region
    label::Char
    area::Int
    perimeter::Int
    sides::Int
end

# import Base.==

# function ==(a::Region, b::Region)
#     a.label == b.label && a.area == b.area && a.perimeter == b.perimeter
# end

function get_regions(input::Vector{Vector{Char}})::Set{Region}
    position_to_region = Dict{Tuple{Int,Int},Region}()
    regions = Set{Region}()
    for (y, line) in enumerate(input), (x, label) in enumerate(line)
        position = (x, y)
        if haskey(position_to_region, position)
            continue
        end
        function has_same_label((x, y)::Tuple{Int,Int})::Bool
            checkbounds(Bool, input, y) && checkbounds(Bool, input[y], x) && input[y][x] == label
        end
        region = Region(label, 0, 0, 0)
        position_to_region[position] = region
        positions_to_explore = Set([position])
        while !isempty(positions_to_explore)
            new_positions_to_explore = Set{Tuple{Int,Int}}()
            for position in positions_to_explore
                position_to_region[position] = region
                region.area += 1
                for direction in [(0, 1), (1, 0), (-1, 0), (0, -1)]
                    next_position = position .+ direction
                    if has_same_label(next_position)
                        if !haskey(position_to_region, next_position)
                            push!(new_positions_to_explore, next_position)
                        end
                    else
                        region.perimeter += 1
                        direction_to_left = (-direction[2], direction[1])
                        if !has_same_label(position .+ direction_to_left) || has_same_label(next_position .+ direction_to_left)
                            region.sides += 1
                        end
                    end
                end
            end
            positions_to_explore = new_positions_to_explore
        end
        push!(regions, region)
    end
    regions
end


function part1(input)
    sum(region.area * region.perimeter for region in get_regions(input))
end

function part2(input)
    sum(region.area * region.sides for region in get_regions(input))
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=12, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end