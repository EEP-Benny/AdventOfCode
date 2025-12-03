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

  def get_bank_joltage(bank)
    ten_digit = bank[...-1].max
    one_digit = bank[bank.index(ten_digit) + 1..].max
    ten_digit * 10 + one_digit
  end

  def part1(input)
    input.map { |bank| get_bank_joltage(bank) }.sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
