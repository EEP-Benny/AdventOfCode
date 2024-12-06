include("utils.jl")

using .AdventOfCodeUtils

const Grid = Matrix{Char}

function Base.parse(::Type{Grid}, input)::Grid
    Grid(reduce(vcat, permutedims(collect(line)) for line in split(input, '\n')))
end

function prepare_input(input::AbstractString)
    parse(Grid, input)
end

function count_xmas(input::Grid)
    count = 0
    for y in axes(input, 2), x in axes(input, 1)
        if input[x, y] != 'X'
            continue
        end
        for (dx, dy) in Base.product(-1:1, -1:1)
            if (checkbounds(Bool, input, x + 3dx, y + 3dy) &&
                input[x+1dx, y+1dy] == 'M' &&
                input[x+2dx, y+2dy] == 'A' &&
                input[x+3dx, y+3dy] == 'S'
            )
                count += 1
            end
        end
    end
    count
end

function part1(input)
    count_xmas(input)
end

function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=4, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end