include("24.jl")
using Test

example_input_small = """
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02"""

example_input = """
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj"""

@testset "prepare_input" begin
    @test prepare_input(example_input_small) == (
        Dict("x00" => true, "x01" => true, "x02" => true, "y00" => false, "y01" => true, "y02" => false),
        [Gate("x00", "y00", &, "z00"), Gate("x01", "y01", xor, "z01"), Gate("x02", "y02", |, "z02")]
    )
end

@testset "simulate_gates" begin
    wires = simulate_gates(prepare_input(example_input_small))
    @test wires["z00"] == false
    @test wires["z01"] == false
    @test wires["z02"] == true
end

@testset "get_number_from_wires" begin
    @test get_number_from_wires(Dict("z00" => false, "z01" => false, "z02" => true)) == 4
    @test get_number_from_wires(Dict(
        "z00" => false,
        "z01" => false,
        "z02" => false,
        "z03" => true,
        "z04" => false,
        "z05" => true,
        "z06" => true,
        "z07" => true,
        "z08" => true,
        "z09" => true,
        "z10" => true,
        "z11" => false,
        "z12" => false,
    )) == 2024
end


@testset "Example Input" begin
    @test part1(prepare_input(example_input)) == 2024
    @test part2(prepare_input(example_input)) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=24, year=2024))
    @test part1(input) == 51837135476040
    @test part2(input) === nothing
end