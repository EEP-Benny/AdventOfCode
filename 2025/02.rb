#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative 'utils'

module Day02
  module_function

  def real_input
    Utils.get_input(2, 2025)
  end

  def prepare_input(input)
    input.split(',').map do |range_string|
      left, right = range_string.split('-')
      (left.to_i..right.to_i)
    end
  end

  def get_invalid_ids(range)
    range.filter do |id|
      id_string = id.to_s
      next if id_string.length.odd?

      split_point = id_string.length.div 2
      left = id_string[...split_point]
      right = id_string[split_point..]

      left == right
    end
  end

  def get_divisors(id)
    if id <= 9 then []
    elsif id <= 99 then [10]
    elsif id <= 999 then [10]
    elsif id <= 9999 then [10, 10**2]
    elsif id <= 99_999 then [10]
    elsif id <= 999_999 then [10, 10**2, 10**3]
    elsif id <= 9_999_999 then [10]
    elsif id <= 99_999_999 then [10, 10**2, 10**4]
    elsif id <= 999_999_999 then [10, 10**3]
    elsif id <= 9_999_999_999 then [10, 10**2, 10**5]
    else
      raise RangeError, "#{id} is bigger than expected"
    end
  end

  def get_advanced_invalid_ids(range)
    range.filter do |id|
      get_divisors(id).any? do |divisor|
        rest, split_part = id.divmod(divisor)
        while rest.positive?
          rest, test = rest.divmod(divisor)
          break if test != split_part
        end
        test == split_part
      end
    end
  end

  def part1(input)
    input.flat_map { |range| get_invalid_ids(range) }.sum
  end

  def part2(input)
    input.flat_map { |range| get_advanced_invalid_ids(range) }.sum
  end

  Utils.run_benchmark_for(self) if __FILE__ == $PROGRAM_NAME
end
