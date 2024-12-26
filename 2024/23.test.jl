include("23.jl")
using Test

example_input = """
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn"""

@testset "prepare_input" begin
    @test Set(["yn", "td"]) in prepare_input(example_input)
end

@testset "find_interconnected_clusters" begin
    connections = prepare_input(example_input)
    @test find_interconnected_clusters(connections) == Set([
        Set(["aq", "cg", "yn"]),
        Set(["aq", "vc", "wq"]),
        Set(["co", "de", "ka"]),
        Set(["co", "de", "ta"]),
        Set(["co", "ka", "ta"]),
        Set(["de", "ka", "ta"]),
        Set(["kh", "qp", "ub"]),
        Set(["qp", "td", "wh"]),
        Set(["tb", "vc", "wq"]),
        Set(["tc", "td", "wh"]),
        Set(["td", "wh", "yn"]),
        Set(["ub", "vc", "wq"]),
    ])
end

@testset "Example Input" begin
    @test part1(prepare_input(example_input)) === 7
    @test part2(prepare_input(example_input)) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=23, year=2024))
    @test part1(input) === 1344
    @test part2(input) === nothing
end