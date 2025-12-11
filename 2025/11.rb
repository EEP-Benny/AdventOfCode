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
      @paths_cache = {}
    end

    def paths_between_nodes(start_node, end_node)
      cached_value = @paths_cache[[start_node, end_node]]
      return cached_value if cached_value

      next_nodes = connections[start_node]
      return 0 unless next_nodes

      individual_paths = next_nodes.map do |next_node_name|
        next_node_name == end_node ? 1 : paths_between_nodes(next_node_name, end_node)
      end
      value = individual_paths.sum
      @paths_cache[[start_node, end_node]] = value
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
    input.paths_between_nodes('you', 'out')
  end

  def part2(input)
    dac_to_fft = input.paths_between_nodes('dac', 'fft')
    fft_to_dac = input.paths_between_nodes('fft', 'dac')

    if dac_to_fft.positive?
      input.paths_between_nodes('svr', 'dac') * dac_to_fft * input.paths_between_nodes('fft', 'out')
    elsif fft_to_dac.positive?
      input.paths_between_nodes('svr', 'fft') * fft_to_dac * input.paths_between_nodes('dac', 'out')
    end
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
