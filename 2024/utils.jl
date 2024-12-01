module AdventOfCodeUtils
export get_input

function get_input(; day::Signed, year::Signed,)
    filename = joinpath(@__DIR__, "../$year/$(lpad(day,2,"0")).input.txt")
    rstrip(read(filename, String))
end

end # module