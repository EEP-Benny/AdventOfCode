include("09.jl")
using Test

example_input = "2333133121414131402"

@testset "prepare_input" begin
    @test prepare_input(example_input) == [2, 3, 3, 3, 1, 3, 3, 1, 2, 1, 4, 1, 4, 1, 3, 1, 4, 0, 2]
end

@testset "get_blocks" begin
    @test get_blocks(prepare_input(example_input)) == [0, 0, -1, -1, -1, 1, 1, 1, -1, -1, -1, 2, -1, -1, -1, 3, 3, 3, -1, 4, 4, -1, 5, 5, 5, 5, -1, 6, 6, 6, 6, -1, 7, 7, 7, -1, 8, 8, 8, 8, 9, 9]
end

@testset "compact_blocks" begin
    @test compact_blocks(get_blocks(prepare_input(example_input))) == [0, 0, 9, 9, 8, 1, 1, 1, 8, 8, 8, 2, 7, 7, 7, 3, 3, 3, 6, 4, 4, 6, 5, 5, 5, 5, 6, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
end

@testset "get_checksum" begin
    blocks = [0, 0, 9, 9, 8, 1, 1, 1, 8, 8, 8, 2, 7, 7, 7, 3, 3, 3, 6, 4, 4, 6, 5, 5, 5, 5, 6, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    @test get_checksum(blocks) == 1928
end

@testset "compact_files" begin
    @test compact_files(get_blocks(prepare_input(example_input))) == [0, 0, 9, 9, 2, 1, 1, 1, 7, 7, 7, -1, 4, 4, -1, 3, 3, 3, -1, -1, -1, -1, 5, 5, 5, 5, -1, 6, 6, 6, 6, -1, -1, -1, -1, -1, 8, 8, 8, 8, -1, -1]
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 1928
    @test part2(input) === 2858
end

@testset "Real input" begin
    input = prepare_input(get_input(day=9, year=2024))
    @test part1(input) === 6401092019345
    @test part2(input) === 6431472344710
end