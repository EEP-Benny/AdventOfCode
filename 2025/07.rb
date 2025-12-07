#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day07
  module_function

  def real_input
    Utils.get_input(7, 2025)
  end

  Position = Struct.new(:x, :y)

  Manifold = Struct.new(:starting_position, :splitter_positions, :max_y)

  def prepare_input(input)
    starting_position = nil
    splitter_positions = Set.new
    input.lines.each_with_index do |line, y|
      line.split('').each_with_index do |char, x|
        case char
        when 'S'
          starting_position = Position.new(x, y)
        when '^'
          splitter_positions << Position.new(x, y)
        end
      end
    end
    Manifold.new(starting_position, splitter_positions, input.lines.length)
  end

  def part1(input)
    split_count = 0
    current_beams_x = Set[input.starting_position.x]
    (input.starting_position.y..input.max_y).each do |y|
      new_beams_x = Set.new
      current_beams_x.each do |x|
        if input.splitter_positions.include?(Position.new(x, y))
          split_count += 1
          new_beams_x << x - 1
          new_beams_x << x + 1
        else
          new_beams_x << x
        end
      end
      current_beams_x = new_beams_x
    end
    split_count
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
