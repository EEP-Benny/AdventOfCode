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

function get_neighbors(node::Node, connections::Set{Connection})
    union([Set(n for n in c if n != node) for c in connections if node ∈ c]...)
end

function find_interconnected_clusters(connections::Set{Connection}, start_nodes=get_all_nodes(connections))
    clusters = Set{Set{Node}}()
    for start_node in start_nodes
        nodes_connected_to_start_node = get_neighbors(start_node, connections)
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

function find_largest_interconnected_cluster(connections::Set{Connection})
    all_nodes = get_all_nodes(connections)
    neighboring_nodes = Dict(node => Set([node, get_neighbors(node, connections)...]) for node in all_nodes)
    all_clusters = Set{Set{Node}}()
    function grow_cluster(cluster::Set{Node})
        if cluster ∈ all_clusters
            return
        end
        push!(all_clusters, cluster)
        for node in cluster
            for neighbor in neighboring_nodes[node]
                if issubset(cluster, neighboring_nodes[neighbor])
                    grow_cluster(Set([cluster..., neighbor]))
                end
            end
        end
    end
    for node in all_nodes
        grow_cluster(Set{Node}([node]))
    end
    argmax(length, all_clusters)
end

function get_password(nodes::Set{Node})
    join(sort([nodes...]), ",")
end

function part2(input)
    get_password(find_largest_interconnected_cluster(input))
end

if abspath(PROGRAM_FILE) == @__FILE__
    input = prepare_input(get_input(day=23, year=2024))
    @show part1(input)
    @show part2(input)
    @showtime part1(input)
    @showtime part2(input)
end