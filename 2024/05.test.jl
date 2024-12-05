include("05.jl")
using Test

example_input = """
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47"""

@testset "parse PageOrderingRule" begin
    @test parse(PageOrderingRule, "47|53") == PageOrderingRule((47, 53))
    @test parse(PageOrderingRule, "97|13") == PageOrderingRule((97, 13))
end

@testset "parse Update" begin
    @test parse(Update, "75,47,61,53,29") == Update([75, 47, 61, 53, 29])
    @test parse(Update, "97,61,53,29,13") == Update([97, 61, 53, 29, 13])
end

@testset "is_in_right_order" begin
    rules = prepare_input(example_input)[1]
    @test is_in_right_order(parse(Update, "75,47,61,53,29"), rules) == true
    @test is_in_right_order(parse(Update, "97,61,53,29,13"), rules) == true
    @test is_in_right_order(parse(Update, "75,29,13"), rules) == true
    @test is_in_right_order(parse(Update, "75,97,47,61,53"), rules) == false
    @test is_in_right_order(parse(Update, "61,13,29"), rules) == false
    @test is_in_right_order(parse(Update, "97,13,75,29,47"), rules) == false
end

@testset "middle_page_number" begin
    @test middle_page_number(parse(Update, "75,47,61,53,29")) == 61
    @test middle_page_number(parse(Update, "97,61,53,29,13")) == 53
    @test middle_page_number(parse(Update, "75,29,13")) == 29
end

@testset "Example Input" begin
    input = prepare_input(example_input)
    @test part1(input) === 143
    @test part2(input) === nothing
end

@testset "Real input" begin
    input = prepare_input(get_input(day=5, year=2024))
    @test part1(input) === 7198
    @test part2(input) === nothing
end