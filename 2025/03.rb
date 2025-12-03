#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day03
  module_function

  def real_input
    Utils.get_input(3, 2025)
  end

  def prepare_input(input)
    input.lines(chomp: true).map do |line|
      line.split('').map(&:to_i)
    end
  end

  def get_bank_joltage(bank, num_cells)
    final_joltage = 0
    start_index = 0
    num_cells.times.each do |cell_index|
      final_joltage *= 10
      last_index = bank.length - num_cells + cell_index
      max_digit = bank[start_index..last_index].max
      start_index = bank[start_index..].index(max_digit) + start_index + 1
      final_joltage += max_digit
    end
    final_joltage
  end

  def part1(input)
    input.map { |bank| get_bank_joltage(bank, 2) }.sum
  end

  def part2(input)
    input.map { |bank| get_bank_joltage(bank, 12) }.sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
