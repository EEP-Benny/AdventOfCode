include("utils.jl")

using .AdventOfCodeUtils
import Base.==, Base.hash

Wire = String
struct Gate
    input1::Wire
    input2::Wire
    operator
    output::Wire
end

function ==(a::Gate, b::Gate)
    a.input1 == b.input1 && a.input2 == b.input2 && a.operator == b.operator && a.output == b.output
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
        input1, operator, input2, output = m.captures
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
            operator = Dict("AND" => &, "OR" => |, "XOR" => xor)[gate.operator]
            wires[gate.output] = operator(wires[gate.input1], wires[gate.input2])
            was_updated = true
        end
    end
    wires
end

function get_wire_name(letter::String, i::Int)
    "$letter$(lpad(string(i),2,"0"))"
end

function get_number_from_wires(wires::Dict{Wire,Bool})
    number::Int64 = 0
    for i in 0:60
        wire_name = get_wire_name("z", i)
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

struct Operation
    operands::Set{Wire}
    operator
end
function ==(a::Operation, b::Operation)
    a.operands == b.operands && a.operator == b.operator
end
function hash(x::Operation, h::UInt)::UInt
    hash(x.operands, hash(x.operator, h))
end


function find_wrong_gates(gates::Vector{Gate})
    operation_by_output = Dict(gate.output => Operation(Set([gate.input1, gate.input2]), gate.operator) for gate in gates)
    output_by_operation = Dict(k[2] => k[1] for k in operation_by_output)
    messages = []
    misplaced_operations = []
    swaps = []
    function get_input_operation(i::Int)
        Operation(Set([get_wire_name("x", i), get_wire_name("y", i)]), "XOR")
    end
    function get_input_carry_operation(i::Int)
        Operation(Set([get_wire_name("x", i), get_wire_name("y", i)]), "AND")
    end
    for i in 1:60
        wire_name = get_wire_name("z", i)
        if !haskey(operation_by_output, wire_name)
            break
        end
        operation = operation_by_output[wire_name]
        if any(startswith(operand, ['x', 'y']) for operand in operation.operands)
            push!(messages, "$wire_name directly connects to inputs: $operation -> $(output_by_operation[operation])")
            push!(misplaced_operations, operation)
            continue
        end
        if operation.operator != "XOR"
            push!(messages, "$wire_name uses the wrong operator (should be XOR): $operation -> $(output_by_operation[operation])")
            push!(misplaced_operations, operation)
            continue
        end
        connected_operations = Set(operation_by_output[operand] for operand in operation.operands)
        carry_operation = [operation for operation in connected_operations if operation.operator == "OR"]
        expected_input_operation = get_input_operation(i)
        if expected_input_operation ∉ connected_operations
            swap1 = output_by_operation[expected_input_operation]
            swap2 = output_by_operation[only(operation for operation in connected_operations if operation.operator != "OR")]
            push!(messages, "$wire_name doesn't connect to input gate ($connected_operations), but $swap1 does")
            push!(swaps, Set([swap1, swap2]))
        end
        if length(carry_operation) < 1
            wrong_operation = only(operation for operation in connected_operations if operation != expected_input_operation)
            push!(messages, "$wire_name doesn't connect to a carry operation (OR) ($connected_operations), $wrong_operation -> $(output_by_operation[wrong_operation]) seems to be wrong")
            push!(misplaced_operations, wrong_operation)
        else
            carry_operation = only(carry_operation)
            connected_carry_operations = Set(operation_by_output[operand] for operand in carry_operation.operands)
            expected_input_carry_operation = get_input_carry_operation(i - 1)
            if expected_input_carry_operation ∉ connected_carry_operations
                push!(messages, "$wire_name doesn't connect to input carry ($connected_carry_operations)")
            end

        end
    end
    @show swaps
    for message in messages
        println(message)
    end
    @show swaps
    @show misplaced_operations
    @show [output_by_operation[op] for op in misplaced_operations]
    misplaced_operations
end

function part2(input)
    # solved using find_wrong_gates and manual inspection
    "hjf,kdh,kpp,sgj,vss,z14,z31,z35"
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=24, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end