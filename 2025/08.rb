#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day08
  module_function

  def real_input
    Utils.get_input(8, 2025)
  end

  Position = Struct.new(:x, :y, :z) do
    def distance(other)
      Math.sqrt((x - other.x)**2 + (y - other.y)**2 + (z - other.z)**2)
    end
  end

  Graph = Struct.new(:positions, :connections) do
    def circuit_sizes
      circuits = positions.map { |position| Set[position] }
      connections.each do |pos1, pos2|
        circuit1 = circuits.find { |circuit| circuit.include? pos1 }
        circuit2 = circuits.find { |circuit| circuit.include? pos2 }
        circuits.delete(circuit1)
        circuits.delete(circuit2)
        circuits.push(circuit1 | circuit2)
      end
      circuits.map(&:size).sort.reverse
    end

    def last_necessary_connection
      circuits = positions.map { |position| Set[position] }
      connections.each do |pos1, pos2|
        circuit1 = circuits.find { |circuit| circuit.include? pos1 }
        circuit2 = circuits.find { |circuit| circuit.include? pos2 }
        circuits.delete(circuit1)
        circuits.delete(circuit2)
        circuits.push(circuit1 | circuit2)
        return [pos1, pos2] if circuits.size == 1
      end
    end
  end

  def prepare_input(input)
    input.lines.map do |line|
      x, y, z = line.split(',').map(&:to_i)
      Position.new(x, y, z)
    end
  end

  def get_shortest_connections(positions)
    positions.combination(2).sort_by { |pos1, pos2| pos1.distance(pos2) }
  end

  def part1(input)
    connection_count = input.length < 100 ? 10 : 1000 # difference between example and real input
    graph = Graph.new(input, get_shortest_connections(input)[...connection_count])
    graph.circuit_sizes[...3].reduce(:*)
  end

  def part2(input)
    graph = Graph.new(input, get_shortest_connections(input))
    pos1, pos2 = graph.last_necessary_connection
    pos1.x * pos2.x
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
