#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day06
  module_function

  def real_input
    Utils.get_input(6, 2025)
  end

  def prepare_input(input)
    *number_lines, operations = input.lines
    [*number_lines.map { |line| line.split.map(&:to_i) }, operations.split.map(&:to_sym)]
  end

  def solve_worksheet(input)
    input.transpose.map do |problem|
      *numbers, operator = problem
      numbers.reduce(operator)
    end
  end

  def part1(input)
    solve_worksheet(input).sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
