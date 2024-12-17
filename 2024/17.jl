include("utils.jl")

using .AdventOfCodeUtils
using Printf

A = 1
B = 2
C = 3

mutable struct Computer
    registers::Vector{Int}
    program::Vector{Int}
    instruction_pointer::Int
    outputs::Vector{Int}
end

function perform_instruction!(c::Computer)
    opcode, literal_operand = c.program[c.instruction_pointer+1:c.instruction_pointer+2]
    get_combo_operand() = literal_operand <= 3 ? literal_operand : c.registers[literal_operand-3]
    if opcode == 0 # adv
        c.registers[A] = c.registers[A] ÷ 2^get_combo_operand()
    elseif opcode == 1 # bxl
        c.registers[B] = c.registers[B] ⊻ literal_operand
    elseif opcode == 2 # bst
        c.registers[B] = get_combo_operand() % 8
    elseif opcode == 3 # jnz
        if c.registers[A] != 0
            c.instruction_pointer = literal_operand - 2
        end
    elseif opcode == 4 # bxc
        c.registers[B] = c.registers[B] ⊻ c.registers[C]
    elseif opcode == 5 # out
        push!(c.outputs, get_combo_operand() % 8)
    elseif opcode == 6 # bdv
        c.registers[B] = c.registers[A] ÷ 2^get_combo_operand()
    elseif opcode == 7 # cdv
        c.registers[C] = c.registers[A] ÷ 2^get_combo_operand()
    end
    c.instruction_pointer += 2
end

function perform_all_instructions!(c::Computer)
    while c.instruction_pointer < length(c.program)
        perform_instruction!(c)
    end
    c
end

function prepare_input(input::AbstractString)::Computer
    m = match(r"Register A: (\d+)\nRegister B: (\d+)\nRegister C: (\d+)\n\nProgram: ([\d,]+)", input)
    registers = parse.(Int, m.captures[1:3])
    program = parse.(Int, split(m.captures[4], ","))
    Computer(registers, program, 0, [])
end

function part1(input::Computer)
    c = deepcopy(input)
    perform_all_instructions!(c)
    join(c.outputs, ",")
end

function get_output(number, computer)
    c = deepcopy(computer)
    c.registers[A] = number
    perform_all_instructions!(c)
    c.outputs
end

function try_digits(number, digit, computer)
    for i in 0:7
        output = get_output(number, computer)
        # octal_number = @sprintf "%o" number
        # @show i, digit, number, octal_number, output
        if number > 0 && output[digit] == computer.program[digit]
            if digit == 1
                return number
            else
                try
                    return try_digits(number, digit - 1, computer)
                catch
                end
            end
        end
        number += 8^(digit - 1)
    end
    error("Didn't find anything")
end


function part2(input)
    try_digits(0, length(input.program), input)
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=17, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end