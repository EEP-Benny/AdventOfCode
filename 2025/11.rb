#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day11
  module_function

  def real_input
    Utils.get_input(11, 2025)
  end

  Graph = Struct.new(:connections) do
    def initialize(...)
      super(...)
      @paths_to_end_cache = {}
    end

    def paths_to_end(node_name)
      cached_value = @paths_to_end_cache[node_name]
      return cached_value if cached_value

      individual_paths = connections[node_name].map do |next_node_name|
        next_node_name == 'out' ? 1 : paths_to_end(next_node_name)
      end
      value = individual_paths.sum
      @paths_to_end_cache[node_name] = value
      value
    end
  end

  def prepare_input(input)
    connections = input.lines.map do |line|
      node_name, target_nodes = line.split(': ')
      [node_name, target_nodes.split(' ')]
    end
    Graph.new(connections.to_h)
  end

  def part1(input)
    input.paths_to_end('you')
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
