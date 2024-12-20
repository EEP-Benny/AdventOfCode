include("utils.jl")

using .AdventOfCodeUtils

function prepare_input(input::AbstractString)::Vector{Int}
    parse.(Int, split(input, ""))
end

function get_blocks(input::Vector{Int})
    blocks = Vector{Int}(undef, length(input) * 9)
    block_index = 1
    for (index, block_size) in enumerate(input)
        block_id, remainder = divrem(index, 2)
        block_id = remainder === 0 ? -1 : block_id
        for _ in 1:block_size
            blocks[block_index] = block_id
            block_index += 1
        end
    end
    resize!(blocks, block_index - 1)
    blocks
end

function compact_blocks(blocks::Vector{Int})
    blocks = copy(blocks)
    next_free = 1
    while blocks[next_free] > -1
        next_free += 1
    end
    last_block = length(blocks)
    while next_free < last_block
        blocks[next_free] = blocks[last_block]
        blocks[last_block] = -1
        last_block -= 1
        while blocks[next_free] > -1
            next_free += 1
        end
    end
    blocks
end

function compact_files(blocks::Vector{Int})
    blocks = copy(blocks)
    current_block_id = blocks[end]
    current_block_start_position = length(blocks)
    while current_block_id > 0
        while blocks[current_block_start_position] != current_block_id
            current_block_start_position -= 1
        end

        # find current block
        current_block_size = 0
        while blocks[current_block_start_position] == current_block_id
            current_block_start_position -= 1
            current_block_size += 1
        end

        # find space for current block
        free_block_end_position = 1
        free_block_size = 0
        while free_block_end_position <= current_block_start_position
            if blocks[free_block_end_position] == -1
                free_block_size += 1
                if free_block_size >= current_block_size
                    break
                end
            else
                free_block_size = 0
            end
            free_block_end_position += 1
        end

        # move current block to free space
        if free_block_size == current_block_size
            for i in 1:current_block_size
                blocks[current_block_start_position+i] = -1
                blocks[free_block_end_position-i+1] = current_block_id
            end
        end
        current_block_id -= 1
    end
    blocks
end

function get_checksum(blocks::Vector{Int})
    checksum = 0
    for (position, block_id) in enumerate(blocks)
        if block_id > -1
            checksum += (position - 1) * block_id
        end
    end
    checksum
end

function part1(input)
    get_checksum(compact_blocks(get_blocks(input)))
end

function part2(input)
    get_checksum(compact_files(get_blocks(input)))
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=9, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end