#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day04
  module_function

  def real_input
    Utils.get_input(4, 2025)
  end

  Grid = Struct.new(:grid) do
    def each_position
      grid.each_with_index do |line, y|
        line.each_index do |x|
          yield x, y
        end
      end
    end

    def roll_of_paper_at_position?(x, y)
      return false if x.negative? || y.negative?

      grid.fetch(y, []).fetch(x, '.') == '@'
    end

    def count_rolls_of_paper_around_position(x, y)
      [
        [x - 1, y - 1],
        [x + 0, y - 1],
        [x + 1, y - 1],
        [x - 1, y + 0],
        [x + 1, y + 0],
        [x - 1, y + 1],
        [x + 0, y + 1],
        [x + 1, y + 1]
      ].count do |x, y|
        roll_of_paper_at_position? x, y
      end
    end
  end

  def prepare_input(input)
    Grid.new(
      input.lines(chomp: true).map do |line|
        line.split('')
      end
    )
  end

  def part1(input)
    count_of_accessible_rolls = 0
    input.each_position do |x, y|
      if input.roll_of_paper_at_position?(x, y) && input.count_rolls_of_paper_around_position(x, y) < 4
        count_of_accessible_rolls += 1
      end
    end
    count_of_accessible_rolls
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
