include("utils.jl")

using .AdventOfCodeUtils

Node = String
Connection = Set{Node}

function prepare_input(input::AbstractString)
    connections = Set{Connection}()
    for line in split(input, "\n")
        connection = Set(split(line, "-"))
        push!(connections, connection)
    end
    connections
end

function get_all_nodes(connections::Set{Connection})
    union(connections...)
end

function find_interconnected_clusters(connections::Set{Connection}, start_nodes=get_all_nodes(connections))
    clusters = Set{Set{Node}}()
    for start_node in start_nodes
        nodes_connected_to_start_node = union([Set(n for n in c if n != start_node) for c in connections if start_node ∈ c]...)
        for b in nodes_connected_to_start_node, c in nodes_connected_to_start_node
            b < c || continue
            if Set([b, c]) ∈ connections
                push!(clusters, Set([start_node, b, c]))
            end
        end
    end
    clusters
end

function part1(input)
    nodes_starting_with_t = [n for n in get_all_nodes(input) if startswith(n, "t")]
    length(find_interconnected_clusters(input, nodes_starting_with_t))
end

function part2(input)
    nothing
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=23, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end