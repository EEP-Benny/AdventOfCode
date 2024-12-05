include("utils.jl")

using .AdventOfCodeUtils

const PageOrderingRule = Tuple{Int,Int}
const Update = Vector{Int}
const ParsedInput = Tuple{Vector{PageOrderingRule},Vector{Update}}

function Base.parse(::Type{PageOrderingRule}, input)::PageOrderingRule
    a, b = split(input, '|')
    PageOrderingRule((parse(Int, a), parse(Int, b)))
end

function Base.parse(::Type{Update}, input)::Update
    Update(parse.(Int, split(input, ",")))
end

function is_in_right_order(update::Update, rules::Vector{PageOrderingRule})::Bool
    index_map = Dict((value, index) for (index, value) in enumerate(update))
    for (a, b) in rules
        if haskey(index_map, a) && haskey(index_map, b) && index_map[a] > index_map[b]
            return false
        end
    end
    return true
end

function middle_page_number(update::Update)
    update[(begin+end)÷2]
end

function sort_update(update::Update, rules::Vector{PageOrderingRule})::Update
    function lt(a, b)
        for (rule_a, rule_b) in rules
            if rule_a == a && rule_b == b
                return true
            elseif rule_a == b && rule_b == a
                return false
            end
        end
        return false
    end
    sort(update, lt=lt)
end


function prepare_input(input::AbstractString)::ParsedInput
    rules_input, updates_input = split(input, "\n\n")
    (parse.(PageOrderingRule, split(rules_input, "\n")), parse.(Update, split(updates_input, "\n")))
end

function part1(input::ParsedInput)
    rules, updates = input
    sum(middle_page_number(update) for update in updates if is_in_right_order(update, rules))
end

function part2(input::ParsedInput)
    rules, updates = input
    sum(middle_page_number(sort_update(update, rules)) for update in updates if !is_in_right_order(update, rules))
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=5, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end