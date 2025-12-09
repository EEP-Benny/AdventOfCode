#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day09
  module_function

  def real_input
    Utils.get_input(9, 2025)
  end

  Position = Struct.new(:x, :y)

  def prepare_input(input)
    input.lines.map do |line|
      x, y = line.split(',').map(&:to_i)
      Position.new(x, y)
    end
  end

  def rectangle_area(pos1, pos2)
    ((pos1.x - pos2.x).abs + 1) * ((pos1.y - pos2.y).abs + 1)
  end

  def part1(input)
    input.combination(2).map { |pos1, pos2| rectangle_area(pos1, pos2) }.max
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
