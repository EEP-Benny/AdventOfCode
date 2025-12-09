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

  def valid_rectangle?(pos1, pos2, all_positions)
    min_x, max_x = [pos1.x, pos2.x].minmax
    min_y, max_y = [pos1.y, pos2.y].minmax

    [*all_positions, all_positions[0]].each_cons(2).all? do |test_pos1, test_pos2|
      is_horizontal = test_pos1.y == test_pos2.y

      if is_horizontal
        test_pos1.y <= min_y || # above
          max_y <= test_pos1.y || # below
          (test_pos1.x <= min_x && test_pos2.x <= min_x) || # on the left
          (test_pos1.x >= max_x && test_pos2.x >= max_x) # on the right
      else
        test_pos1.x <= min_x || # on the left
          max_x <= test_pos1.x || # on the right
          (test_pos1.y <= min_y && test_pos2.y <= min_y) || # above
          (test_pos1.y >= max_y && test_pos2.y >= max_y) # below
      end
    end
  end

  def part2(input)
    biggest_rectangles = input.combination(2).sort_by { |pos1, pos2| rectangle_area(pos1, pos2) }.reverse
    pos1, pos2 = biggest_rectangles.find { |pos1, pos2| valid_rectangle?(pos1, pos2, input) }
    rectangle_area(pos1, pos2)
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
