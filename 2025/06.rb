#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day06
  module_function

  def real_input
    Utils.get_input(6, 2025)
  end

  def prepare_input(input)
    input # no-op, because parsing differs between parts
  end

  def solve_worksheet(problems)
    problems.map do |problem|
      numbers, operator = problem
      numbers.reduce(operator)
    end
  end

  def prepare_input_part1(input)
    *number_lines, operations = input.lines
    number_lines.map { |line| line.split.map(&:to_i) }.transpose.zip(operations.split.map(&:to_sym))
  end

  def part1(input)
    solve_worksheet(prepare_input_part1(input)).sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
