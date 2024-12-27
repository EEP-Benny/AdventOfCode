include("utils.jl")

using .AdventOfCodeUtils

Wire = String
struct Gate
    input1::Wire
    input2::Wire
    operator
    output::Wire
end

function prepare_input(input::AbstractString)
    wires_string, gates_string = split(input, "\n\n")
    wires = Dict{Wire,Bool}()
    for line in split(wires_string, "\n")
        wire, value_string = split(line, ": ")
        wires[wire] = parse(Bool, value_string)
    end
    gates = Vector{Gate}()
    for line in split(gates_string, "\n")
        m = match(r"([a-z0-9]{3}) (AND|OR|XOR) ([a-z0-9]{3}) -> ([a-z0-9]{3})", line)
        input1, operator_string, input2, output = m.captures
        operator = Dict("AND" => &, "OR" => |, "XOR" => xor)[operator_string]
        push!(gates, Gate(input1, input2, operator, output))
    end
    wires, gates
end

function simulate_gates((wires, gates)::Tuple{Dict{Wire,Bool},Vector{Gate}})
    wires = copy(wires)
    was_updated = true
    while was_updated
        was_updated = false
        for gate in gates
            if haskey(wires, gate.output) || !haskey(wires, gate.input1) || !haskey(wires, gate.input2)
                continue
            end
            wires[gate.output] = gate.operator(wires[gate.input1], wires[gate.input2])
            was_updated = true
        end
    end
    wires
end

function get_number_from_wires(wires::Dict{Wire,Bool})
    number::Int64 = 0
    for i in 1:60
        wire_name = "z$(lpad(string(i),2,"0"))"
        if !haskey(wires, wire_name)
            break
        end
        wire_value = wires[wire_name]
        number += wire_value << i
    end
    number
end

function part1(input)
    get_number_from_wires(simulate_gates(input))
end

function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=24, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end